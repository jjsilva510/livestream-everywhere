#!/usr/bin/env python3
"""Livestream Everywhere control server.
- Serves go-live.html (the one-button browser UI) on :8765
- /api/ingest   -> asks the VPS MediaMTX API whether OBS is pushing right now
- /api/config   -> safe, non-secret settings the UI pre-fills from
- /api/announce?mode=start|stop&title=..&d=..&hls=.. -> signs + publishes the
  NIP-53 kind-30311 event with your local key, so signing happens server-side
  (no browser crypto deps, key never leaves the disk).

Setup: copy config.example.json -> config.json and fill in your own values.
Run: python3 livestream-server.py   (then open http://localhost:8765)
"""
import json, os, re, shutil, subprocess, http.server, socketserver, pathlib, sys, time, threading
from urllib.parse import urlparse, parse_qs

HERE = pathlib.Path(__file__).parent

def _load_config():
    path = os.environ.get("LIVESTREAM_CONFIG") or str(HERE / "config.json")
    if not pathlib.Path(path).exists():
        path = str(HERE / "config.example.json")
        print(f"[warn] no config.json found — using example defaults ({path})")
    with open(path) as f:
        return json.load(f)

CFG = _load_config()
PORT = int(CFG.get("port", 8765))
VPS_SSH = CFG.get("vps_ssh", "root@your-vps-ip")
MTX_API = CFG.get("mediamtx_api_url", "http://127.0.0.1:9998/v3/paths/list")
RELAYS = CFG.get("relays", ["wss://relay.primal.net", "wss://nos.lol", "wss://relay.damus.io"])
KEY_FILE = pathlib.Path(CFG.get("key_file", "~/.config/nostr-live/privkey.hex")).expanduser()
HLS_BASE = CFG.get("hls_base", "https://your-domain.example/live/").rstrip("/") + "/"
STREAM_PATH = CFG.get("stream_path", "index")
DEFAULT_TITLE = CFG.get("default_title", "Livestream Everywhere")
STUDIO_BASE = CFG.get("studio_base", "http://127.0.0.1:3998").rstrip("/")
THUMB_DIR = pathlib.Path(CFG.get("thumb_dir", str(HERE / "thumbs"))).expanduser()
THUMB_DIR.mkdir(parents=True, exist_ok=True)
SSH = ["ssh", "-o", "ConnectTimeout=5", "-o", "BatchMode=yes", VPS_SSH,
       "curl -s " + MTX_API]

# ---- Jefizzle Studio, embedded (Phase 2.6): one host, /studio/* is the app ----
STUDIO = None          # module object once mounted
STUDIO_ERR = ""        # why it isn't mounted (shown by /api/studio-state)
def _mount_studio():
    global STUDIO, STUDIO_ERR
    try:
        os.environ["LIVESTREAM_PANEL_PORT"] = str(PORT)   # flips studio to EMBEDDED
        os.environ.setdefault("STUDIO_CONFIG", str(HERE / "studio-config.json"))
        sys.path.insert(0, str(HERE / "studio"))
        import server as studio_mod                       # studio/server.py
        studio_mod.start_backend()
        STUDIO = studio_mod
        print("[studio] embedded at /studio/ (%d lanes)" % len(studio_mod.LANES))
    except Exception as e:
        STUDIO_ERR = "%s: %s" % (type(e).__name__, e)
        print("[studio] not embedded — %s" % STUDIO_ERR)
_mount_studio()

def hls_url():
    return f"{HLS_BASE}{STREAM_PATH}/index.m3u8"

def _hide_kwargs():
    """Windows: spawn children (ssh/node/bash) with NO console window.
    pythonw has no console to inherit, so each child would otherwise flash
    a cmd window every few seconds and wake monitors. No-op elsewhere."""
    if os.name != "nt":
        return {}
    si = subprocess.STARTUPINFO()
    si.dwFlags = subprocess.STARTF_USESHOWWINDOW
    si.wShowWindow = 0  # SW_HIDE
    return {"startupinfo": si, "creationflags": subprocess.CREATE_NO_WINDOW}

def ingest_state():
    try:
        out = subprocess.run(SSH, capture_output=True, text=True, timeout=12, **_hide_kwargs()).stdout
        items = json.loads(out or "{}").get("items", [])
        live = [p["name"] for p in items if p.get("ready")]
        return {"ok": True, "live_paths": live, "pushing": bool(live)}
    except Exception as e:
        return {"ok": False, "error": str(e), "pushing": False}

# ---- NIP-01 signing/publish via node (reuses the vendored nostr-tools) ----
NODE_SNIPPET = """
import { readFileSync } from 'fs';
import { URL, fileURLToPath } from 'url';
const [, , libDirURL, keyFile, mode, title, d, hls, image] = process.argv;
const libDir = fileURLToPath(libDirURL);
const { finalizeEvent, getPublicKey } = await import(new URL('nostr-tools/lib/esm/index.js', libDirURL.endsWith('/') ? libDirURL : libDirURL + '/').href);
const sk = Buffer.from(readFileSync(keyFile, 'utf8').trim(), 'hex');
const tags = mode === 'stop'
  ? [['d', d], ['status', 'ended'], ...(image ? [['image', image]] : [])]
  : [['d', d], ['title', title], ['streaming', hls], ['status', 'live'],
     ['starts', String(Math.floor(Date.now()/1000))], ['t', 'livestream'],
     ...(image ? [['image', image]] : [])];
const ev = finalizeEvent({ kind: 30311, created_at: Math.floor(Date.now()/1000), tags, content: '' }, sk);
async function pub(url) {
  return new Promise(res => {
    const ws = new WebSocket(url); const t = setTimeout(() => { try{ws.close()}catch{}; res([url,'timeout']); }, 8000);
    ws.onopen = () => ws.send(JSON.stringify(['EVENT', ev]));
    ws.onmessage = m => { const j = JSON.parse(m.data); if (j[0]==='OK') { clearTimeout(t); res([url, j[2] ? 'accepted' : ('rejected: '+(j[3]||''))]); try{ws.close()}catch{} } };
    ws.onerror = () => { clearTimeout(t); res([url,'error']); };
  });
}
const results = await Promise.all(%s.map(pub));
console.log(JSON.stringify({ id: ev.id, pubkey: getPublicKey(sk), results }));
process.exit(0);
""" % json.dumps(RELAYS)

STATE_FILE = HERE / "live-state.json"
CURRENT_IMAGE = [""]   # last image tag used by a successful start (for restore)

def save_live_state(d=None):
    """Persist the live listing so a panel restart doesn't lose END-ability."""
    try:
        if d is None and STATE_FILE.exists():
            STATE_FILE.unlink()
        elif d is not None:
            STATE_FILE.write_text(json.dumps({"d": d, "since": time.time(), "image": CURRENT_IMAGE[0]}))
    except Exception:
        pass

def load_live_state():
    try:
        return json.loads(STATE_FILE.read_text()) if STATE_FILE.exists() else None
    except Exception:
        return None

def announce(mode, title, d, hls, image=""):
    lib_url = (HERE/"lib").resolve().as_uri()
    r = subprocess.run(["node", "--input-type=module", "-", lib_url, str(KEY_FILE), mode, title, d, hls, image],
                       input=NODE_SNIPPET, text=True, capture_output=True, timeout=30, **_hide_kwargs())
    try:
        return json.loads(r.stdout)
    except Exception:
        return {"error": (r.stderr or r.stdout).strip()[:300]}

# ---- idle-replay yield (real stream takes over the same RTMP path) ----
REPLAY_D = "idle-replay-247"
REPLAY_TITLE = ("24/7 CLIP REPLAY — not live | Jefizzle — main: "
                "shosho.live/npub1ypj34wxzlv07hjjkhqx7hg2xxzh5227uue873uz2na0k0e9rc8xqeapukx")
REPLAY_IMAGE = ["https://files.catbox.moe/crnty0.jpg"]  # synced on every replay-start announce

def idle_yield(mode):
    """'start' -> pause + stop the idle replay so OBS can claim the path;
       'stop' -> drop the pause file; watchdog relaunches idle within ~60s."""
    cmd = ("touch /run/idle-stream.pause && systemctl stop idle-stream" if mode == "start"
           else "rm -f /run/idle-stream.pause")
    try:
        r = subprocess.run(["ssh", "-o", "ConnectTimeout=5", "-o", "BatchMode=yes", VPS_SSH, cmd],
                           capture_output=True, text=True, timeout=20, **_hide_kwargs())
        return {"ok": r.returncode == 0, "stderr": (r.stderr or "").strip()[:200]}
    except Exception as e:
        return {"ok": False, "stderr": str(e)[:200]}

REPLAY_LIVE_ANNOUNCE = True  # 2026-10-04 10:41 Jeffrey: revive the 24/7 replay
                              # listing — but NEVER advertise stream.silvafamily.space
                              # in profile fields; external links point at the main
                              # nostr account. Set False to retire the listing again.

def replay_republish(mode):
    if mode == "start":
        if not REPLAY_LIVE_ANNOUNCE:
            return {"skipped": "replay live-announce disabled (REPLAY_LIVE_ANNOUNCE=False)"}
        return announce("start", REPLAY_TITLE, REPLAY_D, hls_url(), REPLAY_IMAGE[0])
    return announce("stop", "", REPLAY_D, "", REPLAY_IMAGE[0])

def wait_path_then_replay(timeout_s=180):
    """After END STREAM: wait for the replay pipeline to be back, then re-announce
       the 24/7 listing so frontends never show a dead 'live' link.
       If the path never returns (throttle/backoff), leave the listing ended —
       honesty over a dead player."""
    def _w():
        t0 = time.time()
        ready = False
        while time.time() - t0 < timeout_s:
            if ingest_state().get("pushing"):
                ready = True
                break
            time.sleep(5)
        if ready:
            try:
                replay_republish("start")
            except Exception:
                pass
    threading.Thread(target=_w, daemon=True).start()

def _fetch(url, timeout=60.0):
    from urllib.request import Request, urlopen
    req = Request(url, headers={"Accept": "*/*"})
    with urlopen(req, timeout=timeout) as r:
        return r.read(), r.headers.get("Content-Type", "application/octet-stream")

def studio_view_url(lane, filename, subfolder):
    from urllib.parse import urlencode
    # Studio runs embedded in this process (Phase 2.6): :3998 never listens, so
    # fetch through our own /studio/* mount. Standalone studio keeps STUDIO_BASE.
    base = ("http://127.0.0.1:%d/studio" % PORT) if STUDIO is not None else STUDIO_BASE
    return base + "/api/view?" + urlencode({"lane": lane, "filename": filename,
                                             "subfolder": subfolder, "type": "output"})

def set_thumb(lane, filename, subfolder):
    """Pull a finished studio output, freeze it locally, and scp-publish it to
    the VPS so nostr clients can actually fetch the image tag URL."""
    try:
        data, _ = _fetch(studio_view_url(lane, filename, subfolder), timeout=120.0)
    except Exception as e:
        return {"ok": False, "error": "studio fetch failed: %s" % e}
    if len(data) > 5 * 1024 * 1024:
        return {"ok": False, "error": "image too large (>5MB) for a thumbnail"}
    safe = re.sub(r"[^A-Za-z0-9._-]", "_", os.path.basename(filename)) or "thumb.png"
    out = THUMB_DIR / safe
    out.write_bytes(data)
    return publish_thumb_bytes(data, safe, out)

def publish_thumb_bytes(data, safe, out):
    """VPS-hosted publish first (self-sovereign, fast: https://stream.silvafamily.space/thumbs/…);
    catbox as fallback (2026-10-09: catbox outage hung UIs on its 90s timeout)."""
    pub = CFG.get("publish_thumb")
    if pub:
        script = HERE / "scripts" / "publish-thumb.sh"
        bash = shutil.which("bash") or "bash"
        env = dict(os.environ, LIVESTREAM_VPS_SSH=VPS_SSH)
        try:
            r = subprocess.run([bash, str(script), str(out)], capture_output=True, text=True, timeout=60, env=env, **_hide_kwargs())
        except Exception as e:
            r = None
            err = "publish timeout: %s" % e
        else:
            err = None
        if r is not None and r.returncode == 0:
            return {"ok": True, "file": safe, "local_path": str(out),
                    "url": r.stdout.strip().splitlines()[-1]}
        # VPS path failed -> catbox
        if r is not None:
            err = "publish failed: %s" % (r.stderr or r.stdout).strip()[:300]
        try:
            cb = catbox_upload(data, safe)
            if isinstance(cb, dict) and cb.get("ok") and cb.get("url"):
                return {"ok": True, "file": safe, "local_path": str(out), "url": cb["url"]}
        except Exception:
            pass
        return {"ok": False, "error": err or "publish failed", "local_path": str(out)}
    try:
        cb = catbox_upload(data, safe)
        if isinstance(cb, dict) and cb.get("ok") and cb.get("url"):
            return {"ok": True, "file": safe, "local_path": str(out), "url": cb["url"]}
    except Exception:
        pass
    return {"ok": False, "error": "no publish_thumb configured and catbox failed", "local_path": str(out)}

def catbox_upload(data, name):
    """POST a raw image to catbox.moe (verified reachable from this box) and
    return the public https URL. Stdlib-only hand-built multipart."""
    import urllib.request, uuid
    boundary = uuid.uuid4().hex
    def field(fn, val):
        return ('--%s\r\nContent-Disposition: form-data; name="%s"\r\n\r\n%s\r\n' % (boundary, fn, val)).encode()
    parts = [field("reqtype", "fileupload"), field("userhash", "")]
    parts.append(('--%s\r\nContent-Disposition: form-data; name="fileToUpload"; filename="%s"\r\n'
                  'Content-Type: image/jpeg\r\n\r\n' % (boundary, name)).encode() + data + b"\r\n")
    parts.append(("--%s--\r\n" % boundary).encode())
    req = urllib.request.Request("https://catbox.moe/user/api.php", data=b"".join(parts),
        headers={"Content-Type": "multipart/form-data; boundary=%s" % boundary,
                 "User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            out = r.read().decode(errors="replace").strip()
    except Exception as e:
        return {"ok": False, "error": "upload failed: %s" % e}
    if out.startswith("https://"):
        return {"ok": True, "url": out}
    return {"ok": False, "error": "upload reply: " + out[:120]}

def save_upload_thumb(name, data_b64):
    """Decode a data-URL/base64 image, freeze it in thumbs/, publish (VPS first, catbox fallback)."""
    import base64
    if not data_b64:
        return {"ok": False, "error": "no data"}
    data_b64 = data_b64.split("base64,", 1)[-1]
    try:
        data = base64.b64decode(data_b64)
    except Exception:
        return {"ok": False, "error": "bad base64"}
    if len(data) > 8 * 1024 * 1024:
        return {"ok": False, "error": "file too large (>8MB)"}
    safe = re.sub(r"[^A-Za-z0-9._-]", "_", os.path.basename(name or "thumb.jpg")) or "thumb.jpg"
    out = THUMB_DIR / ("%d-%s" % (int(time.time()), safe))
    out.write_bytes(data)
    res = publish_thumb_bytes(data, safe, out)
    res["local"] = str(out)
    return res

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(HERE), **kw)
    def parse_request(self):
        ok = super().parse_request()
        if ok:
            # keep the untouched request-line path (self.path gets query-stripped)
            raw = self.requestline or ""
            parts = raw.split(" ")
            self.raw_requestpath = parts[1] if len(parts) > 1 else self.path
        return ok

    def _via_studio(self):
        full = getattr(self, "raw_requestpath", "") or self.path
        if full.startswith("/_gen/"):
            full = "/studio" + full[len("/_gen"):]
        if STUDIO is not None and full.startswith("/studio"):
            # SimpleHTTPRequestHandler.parse_request() keeps the un-mangled
            # request-line path in raw_requestpath; hand it to the studio handler.
            h = STUDIO.Handler.__new__(STUDIO.Handler)
            h.raw_requestline = self.raw_requestline
            h.request_version = self.request_version
            h.requestline = full
            h.path = full
            h.command = self.command
            h.headers = self.headers
            h.rfile, h.wfile, h.request = self.rfile, self.wfile, self.request
            h.content_length = int(self.headers.get("Content-Length") or 0)
            h.close_connection = True   # one request per mount; no re-parse races
            try:
                h.handle_one_request()
            finally:
                h.wfile.flush()
            return True
        return False
    PANEL_API = ("/api/ingest", "/api/config", "/api/announce", "/api/live-state",
                 "/api/thumb", "/api/upload_thumb", "/api/studio-state", "/api/idle")
    def _bare_studio_api(self):
        # The embedded iframe may fetch absolute /api/* paths; forward them to
        # the studio engine unless the panel itself owns that endpoint.
        return (STUDIO is not None and self.path.startswith("/api/")
                and not self.path.startswith(H.PANEL_API))
    def do_OPTIONS(self):
        # CORS preflight for standalone-studio -> panel /api/thumb relay.
        origin = self.headers.get("Origin", "")
        if re.match(r"^https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$", origin):
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Access-Control-Max-Age", "86400")
            self.send_header("Content-Length", "0")
            self.end_headers()
        else:
            self.send_response(403); self.send_header("Content-Length","0"); self.end_headers()
    def do_GET(self):
        if self._via_studio(): return
        if self._bare_studio_api():
            self.raw_requestpath = "/studio" + (getattr(self, "raw_requestpath", "") or self.path)
            self.path = "/studio" + self.path
            return self._via_studio()
        if self.path == "/api/studio-state":
            return self._json({"embedded": STUDIO is not None,
                               "error": STUDIO_ERR or None})
        u = urlparse(self.path)
        if u.path == "/api/ingest":
            return self._json(ingest_state())
        if u.path == "/api/config":
            return self._json({"watch_base": HLS_BASE, "hls_url": hls_url(),
                               "stream_path": STREAM_PATH, "relays": RELAYS,
                               "default_title": DEFAULT_TITLE})
        if u.path == "/api/announce":
            q = parse_qs(u.query)
            mode = q.get("mode", ["start"])[0]
            d = q.get("d", [str(int(time.time()))])[0]
            img = q.get("image", [""])[0]
            if d == REPLAY_D and mode == "start" and not REPLAY_LIVE_ANNOUNCE:
                return self._json({"skipped": "replay live-announce disabled (REPLAY_LIVE_ANNOUNCE=False)"})
            res = announce(mode, q.get("title", [DEFAULT_TITLE])[0], d,
                           q.get("hls", [hls_url()])[0], img)
            acked = isinstance(res.get("results"), list) and any(r[1] == "accepted" for r in res["results"])
            if acked:
                if d == REPLAY_D:
                    if mode == "start":
                        if img: REPLAY_IMAGE[0] = img
                        CURRENT_IMAGE[0] = img or CURRENT_IMAGE[0]
                        save_live_state(d)
                    else:
                        save_live_state(None)
                elif mode == "start":
                    if img: CURRENT_IMAGE[0] = img
                    save_live_state(d)
                    idle_yield("start"); replay_republish("stop")   # yield the path + retire replay listing
                else:
                    save_live_state(None)
                    idle_yield("stop"); wait_path_then_replay()     # replay returns when the path frees up
            return self._json(res)
        if u.path == "/api/idle":
            # client-side (Alby/NIP-07) announces bypass /api/announce — they hit this
            mode = parse_qs(u.query).get("mode", ["start"])[0]
            qd = parse_qs(u.query)
            dcli = qd.get("d", [""])[0]
            icli = qd.get("image", [""])[0]
            if mode == "start":
                y = idle_yield("start")
                e2 = replay_republish("stop")
                # NIP-07 client-mode announces bypass /api/go — record the live state
                # here so keepalive-replay.sh never re-claims the listing mid-stream.
                if dcli and dcli != REPLAY_D:
                    if icli: CURRENT_IMAGE[0] = icli
                    save_live_state(dcli)
                return self._json({"yield": y, "replay_end": e2})
            if mode == "stop":
                save_live_state(None)
                y = idle_yield("stop")
                wait_path_then_replay()
                return self._json({"yield": y, "replay": "re-announced when path is back"})
            return self._json({"error": "mode must be start|stop"})
        if u.path == "/api/live-state":
            st = load_live_state()
            out = {"live": bool(st)}
            if st: out.update(st)
            return self._json(out)
        if u.path.endswith(".html") or u.path == "/":
            # always fresh UI: this page IS the app; browsers cache headerless
            # 200s and then serve stale tabs forever.
            try:
                data = (HERE / ("go-live.html" if u.path == "/" else u.path.lstrip("/"))).read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(data)))
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(data)
            except Exception:
                self.send_error(404)
            return
        return super().do_GET()
    def do_POST(self):
        if self._via_studio(): return
        if self._bare_studio_api():
            self.raw_requestpath = "/studio" + (getattr(self, "raw_requestpath", "") or self.path)
            self.path = "/studio" + self.path
            return self._via_studio()
        u = urlparse(self.path)
        if u.path == "/api/upload_thumb":
            try:
                n = int(self.headers.get("Content-Length") or 0)
                body = json.loads(self.rfile.read(n).decode() or "{}")
                res = save_upload_thumb(body.get("name", "thumb.jpg"), body.get("data_b64", ""))
                return self._json(res)
            except Exception as e:
                return self._json({"ok": False, "error": str(e)})
        if u.path == "/api/thumb":
            try:
                n = int(self.headers.get("Content-Length") or 0)
                body = json.loads(self.rfile.read(n).decode() or "{}")
                res = set_thumb(body.get("lane", ""), body.get("filename", ""),
                                body.get("subfolder", ""))
                return self._json(res, cors=True)
            except Exception as e:
                return self._json({"ok": False, "error": str(e)}, cors=True)
        self.send_response(404); self.end_headers()
    def _json(self, obj, cors=False):
        body = json.dumps(obj).encode()
        try:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            if cors:
                origin = self.headers.get("Origin", "")
                if re.match(r"^https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$", origin):
                    self.send_header("Access-Control-Allow-Origin", origin)
            self.end_headers()
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass  # browser tab closed mid-poll; harmless
    def log_message(self, *a): pass

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    bind = os.environ.get("LIVESTREAM_BIND") or CFG.get("bind", "127.0.0.1")
    with socketserver.ThreadingTCPServer((bind, PORT), H) as httpd:
        httpd.daemon_threads = True
        print(f"Livestream control at http://localhost:{PORT}")
        httpd.serve_forever()
