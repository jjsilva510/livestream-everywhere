#!/usr/bin/env python3
"""weekly-thumb.py — refresh the stream listing thumbnail from the newest PUBLIC clip.

Grabs the YouTube thumbnail of the most recent public upload, mirrors it to
catbox, then:
  1. republishes kind-0 (picture+banner = new image) via update-profile.mjs --image
  2. republishes the 30311 idle-replay listing through the panel with the new image
Runs weekly via cron (Sunday ~12:10 EDT, just after the daily clip release).
If Jeffrey ever changes the listing TITLE string, update it below too.

env: YT_CLIENT_ID, YT_CLIENT_SECRET, YT_TOKEN (set by weekly-thumb.sh)
"""
import json, os, sys, time, urllib.request, urllib.parse, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
TITLE = ("24/7 CLIP REPLAY — not live | Jefizzle — main: "
         "shosho.live/npub1ypj34wxzlv07hjjkhqx7hg2xxzh5227uue873uz2na0k0e9rc8xqeapukx")
PANEL = "http://127.0.0.1:8765"

def log(*a):
    print(time.strftime("%Y-%m-%d %H:%M:%S"), *a, flush=True)

def main():
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build

    tok = os.environ["YT_TOKEN"]
    d = json.load(open(tok))
    c = Credentials(token=d["token"], refresh_token=d["refresh_token"],
                    token_uri=d["token_uri"], client_id=os.environ["YT_CLIENT_ID"],
                    client_secret=os.environ["YT_CLIENT_SECRET"], scopes=d["scopes"])
    if c.expired:
        c.refresh(Request())
        d["token"] = c.token
        json.dump(d, open(tok, "w"), indent=2)
    svc = build("youtube", "v3", credentials=c)

    ch = svc.channels().list(part="contentDetails", mine=True).execute()
    uploads = ch["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
    items = svc.playlistItems().list(part="snippet,status", playlistId=uploads,
                                     maxResults=50).execute().get("items", [])
    pub = next((it for it in items
                if it.get("status", {}).get("privacyStatus") == "public"), None)
    if not pub:
        log("no public upload found — aborting"); return 1
    vid = pub["snippet"]["resourceId"]["videoId"]
    log(f"newest public: {vid} | {pub['snippet']['title']}")

    data = None
    for q in ("maxresdefault", "hqdefault"):
        url = f"https://i.ytimg.com/vi/{vid}/{q}.jpg"
        try:
            body = urllib.request.urlopen(url, timeout=20).read()
            if len(body) > 2000:
                data = body; log(f"thumb: {q} ({len(body)} bytes)"); break
        except Exception as e:
            log(f"{q}: {e}")
    if not data:
        log("thumb download failed"); return 1
    tmp = "/tmp/weekly-thumb.jpg"
    open(tmp, "wb").write(data)

    cb = subprocess.run(["curl", "-s", "-m", "60", "-F", "reqtype=fileupload",
                         "-F", "userhash=",
                         "-F", f"fileToUpload=@{tmp};type=image/jpeg",
                         "https://catbox.moe/user/api.php"],
                        capture_output=True, text=True)
    img = cb.stdout.strip()
    if not img.startswith("https://"):
        log(f"catbox FAIL: {cb.stdout[:80]} {cb.stderr[:80]}"); return 1
    log("catbox:", img)

    r = subprocess.run(["node", os.path.join(HERE, "update-profile.mjs"),
                        "--publish", "--image", img],
                       capture_output=True, text=True, timeout=120)
    log("kind0:", " ".join(r.stdout.strip().splitlines()[-7:]))
    if r.returncode != 0:
        log("kind0 ERR:", (r.stderr or "").strip()[:200]); return 1

    q = urllib.parse.urlencode({"mode": "start", "d": "idle-replay-247",
                                "title": TITLE, "image": img})
    res = json.load(urllib.request.urlopen(f"{PANEL}/api/announce?{q}", timeout=40))
    acked = sum(1 for _, s in res.get("results", []) if s == "accepted")
    log(f"30311 {str(res.get('id', '?'))[:12]}… accepted {acked}/6")
    return 0 if acked > 0 else 1

if __name__ == "__main__":
    sys.exit(main())
