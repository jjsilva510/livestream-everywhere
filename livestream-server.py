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
import json, os, subprocess, http.server, socketserver, pathlib, time
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
SSH = ["ssh", "-o", "ConnectTimeout=5", "-o", "BatchMode=yes", VPS_SSH,
       "curl -s " + MTX_API]

def hls_url():
    return f"{HLS_BASE}{STREAM_PATH}/index.m3u8"

def ingest_state():
    try:
        out = subprocess.run(SSH, capture_output=True, text=True, timeout=12).stdout
        items = json.loads(out or "{}").get("items", [])
        live = [p["name"] for p in items if p.get("ready")]
        return {"ok": True, "live_paths": live, "pushing": bool(live)}
    except Exception as e:
        return {"ok": False, "error": str(e), "pushing": False}

# ---- NIP-01 signing/publish via node (reuses the vendored nostr-tools) ----
NODE_SNIPPET = """
import { readFileSync } from 'fs';
import { URL, fileURLToPath } from 'url';
const [, , libDirURL, keyFile, mode, title, d, hls] = process.argv;
const libDir = fileURLToPath(libDirURL);
const { finalizeEvent, getPublicKey } = await import(new URL('nostr-tools/lib/esm/index.js', libDirURL.endsWith('/') ? libDirURL : libDirURL + '/').href);
const sk = Buffer.from(readFileSync(keyFile, 'utf8').trim(), 'hex');
const tags = mode === 'stop'
  ? [['d', d], ['status', 'ended']]
  : [['d', d], ['title', title], ['streaming', hls], ['status', 'live'],
     ['starts', String(Math.floor(Date.now()/1000))], ['t', 'livestream']];
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

def announce(mode, title, d, hls):
    lib_url = (HERE/"lib").resolve().as_uri()
    r = subprocess.run(["node", "--input-type=module", "-", lib_url, str(KEY_FILE), mode, title, d, hls],
                       input=NODE_SNIPPET, text=True, capture_output=True, timeout=30)
    try:
        return json.loads(r.stdout)
    except Exception:
        return {"error": (r.stderr or r.stdout).strip()[:300]}

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(HERE), **kw)
    def do_GET(self):
        u = urlparse(self.path)
        if u.path == "/api/ingest":
            return self._json(ingest_state())
        if u.path == "/api/config":
            return self._json({"watch_base": HLS_BASE, "hls_url": hls_url(),
                               "stream_path": STREAM_PATH, "relays": RELAYS,
                               "default_title": DEFAULT_TITLE})
        if u.path == "/api/announce":
            q = parse_qs(u.query)
            return self._json(announce(q.get("mode", ["start"])[0],
                                      q.get("title", [DEFAULT_TITLE])[0],
                                      q.get("d", [str(int(time.time()))])[0],
                                      q.get("hls", [hls_url()])[0]))
        if u.path == "/":
            self.path = "/go-live.html"
        return super().do_GET()
    def _json(self, obj):
        body = json.dumps(obj).encode()
        try:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass  # browser tab closed mid-poll; harmless
    def log_message(self, *a): pass

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    bind = os.environ.get("LIVESTREAM_BIND", "127.0.0.1")
    with socketserver.ThreadingTCPServer((bind, PORT), H) as httpd:
        httpd.daemon_threads = True
        print(f"Livestream control at http://localhost:{PORT}")
        httpd.serve_forever()
