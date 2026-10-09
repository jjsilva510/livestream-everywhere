#!/usr/bin/env python3
"""publish-clip.py — release one Jefizzle Gaming clip per day to the world.

Lists the channel's uploads, takes the OLDEST unlisted video, flips it to
public, regenerates vod-ids.txt (all videos, newest first) and pushes it to
the VPS so the idle-replay stream rotates the fresh catalogue.

usage: publish-clip.py [--dry-run] [--if-due]
  --if-due  skip if the last successful release was < 22h ago (@reboot guard)
env: YT_CLIENT_ID, YT_CLIENT_SECRET, YT_TOKEN (set by publish-clip.sh)
"""
import json, os, sys, time, tempfile, subprocess
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

HERE = os.path.dirname(os.path.abspath(__file__))
STAMP = os.path.join(HERE, ".last-publish")
VPS = os.environ.get("LIVESTREAM_VPS_SSH", "")
IDS_REMOTE = "/root/idle-stream/vod-ids.txt"


def log(*a):
    print(time.strftime("%Y-%m-%d %H:%M:%S"), *a, flush=True)

def main():
    if not VPS:
        log("FATAL: set LIVESTREAM_VPS_SSH (user@host) — exported by publish-clip.sh from repo config.json")
        sys.exit(2)
    dry = "--dry-run" in sys.argv
    if_due = "--if-due" in sys.argv
    if if_due and os.path.exists(STAMP):
        age = time.time() - os.path.getmtime(STAMP)
        if age < 22 * 3600:
            log(f"if-due: last release {age/3600:.1f}h ago (<22h) — nothing to do")
            return 0

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
    pi = svc.playlistItems().list(part="snippet,status", playlistId=uploads,
                                  maxResults=50).execute()
    items = pi.get("items", [])
    unlisted = [it for it in items
                if it.get("status", {}).get("privacyStatus") == "unlisted"]
    log(f"uploads={len(items)} unlisted={len(unlisted)}")
    if not unlisted:
        log("nothing unlisted left — catalogue refreshed anyway")

    if unlisted:
        pick = unlisted[-1]  # playlistItems comes newest-first; oldest = last
        vid = pick["snippet"]["resourceId"]["videoId"]
        title = pick["snippet"]["title"]
        log(f"releasing: {vid} | {title}")
        if not dry:
            # minimal body — passing the whole list() resource back can no-op silently
            svc.videos().update(part="status",
                                body={"id": vid, "status": {"privacyStatus": "public"}}).execute()
            new = "?"
            for _ in range(6):
                time.sleep(5)
                ok = svc.videos().list(part="status", id=vid).execute()
                new = ok["items"][0]["status"]["privacyStatus"]
                if new == "public":
                    break
            log(f"verified privacyStatus={new}")
            if new != "public":
                log("ERROR: flip did not stick"); return 1

    # regenerate vod-ids.txt newest-first (all videos)
    ids = [it["snippet"]["resourceId"]["videoId"] for it in items]
    fd, tmp = tempfile.mkstemp(suffix=".txt"); os.close(fd)
    with open(tmp, "w") as f:
        f.write("\n".join(ids) + "\n")
    if not dry:
        r = subprocess.run(["scp", "-q", "-o", "ConnectTimeout=10", tmp,
                            f"{VPS}:{IDS_REMOTE}"], capture_output=True, text=True)
        log("push vod-ids to VPS: " + ("ok" if r.returncode == 0 else f"FAIL {r.stderr[:120]}"))
    os.unlink(tmp)

    if not dry:
        open(STAMP, "w").write(str(time.time()))
        subprocess.run(["ssh", "-o", "ConnectTimeout=10", VPS,
                        "systemctl restart idle-stream"], capture_output=True, timeout=30)
    log("done")
    return 0

if __name__ == "__main__":
    sys.exit(main())
