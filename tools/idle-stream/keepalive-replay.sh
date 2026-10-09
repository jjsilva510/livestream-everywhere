#!/bin/bash
# Keepalive + thumbnail rotation for the 24/7 replay listing (NIP-72 30311, d=idle-replay-247).
# damus/snort expire events within ~a day → account looks offline though the stream is fine.
# Re-announce every 4h, AND each time: set the listing image to the thumbnail of the clip
# the replay is CURRENTLY playing (Jeffrey 2026-10-07: "every time you go live make a new
# image"). Falls back to the previous image if the clip-thumb/catbox path fails.
# SAFETY: touches nothing on the VPS except a read-only journalctl; skips when a real
# stream owns live-state or the path isn't pushing — never fakes live.
set -u
PANEL=http://127.0.0.1:8765
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VPS="${LIVESTREAM_VPS_SSH:-$(CFG="$REPO_ROOT/config.json" python3 -c "import json,os;print(json.load(open(os.environ['CFG']))['vps_ssh'])" 2>/dev/null)}"
TITLE="24/7 CLIP REPLAY — not live | Jefizzle — main: shosho.live/npub1ypj34wxzlv07hjjkhqx7hg2xxzh5227uue873uz2na0k0e9rc8xqeapukx"

STATE=$(curl -s -m 5 $PANEL/api/live-state 2>/dev/null)
ING=$(curl -s -m 20 $PANEL/api/ingest 2>/dev/null)
# Guard: skip ONLY if a real stream owns live-state. If state is empty/unknown (cleared
# by probes/restarts) and the path IS pushing, (re)claim it — the replay should always be live.
D=$(echo "$STATE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('d',''))" 2>/dev/null)
[ -n "$D" ] && [ "$D" != "idle-replay-247" ] && exit 0
echo "$ING" | grep -q '"pushing": *true' || exit 0

IMG=""
CLIP=$(timeout 20 ssh -o ConnectTimeout=8 -o BatchMode=yes $VPS \
  'journalctl -u idle-stream --since -12h -o cat 2>/dev/null | grep -oE "playing [A-Za-z0-9_-]{11}" | tail -1 | awk "{print \$2}"' 2>/dev/null)
if [ -n "$CLIP" ]; then
  for q in maxresdefault hqdefault; do
    code=$(curl -s -o /tmp/rot-thumb.jpg -m 20 -w "%{http_code}" "https://i.ytimg.com/vi/$CLIP/$q.jpg" 2>/dev/null)
    sz=$(stat -c%s /tmp/rot-thumb.jpg 2>/dev/null || echo 0)
    [ "$code" = "200" ] && [ "$sz" -gt 5000 ] && break
  done
  if [ "$code" = "200" ] && [ "$sz" -gt 5000 ]; then
    # self-host on the VPS via Caddy's /thumbs/ route (stream.silvafamily.space is used only
    # as an embedded resource URL in the image tag, never as an advertised link). catbox is
    # fallback. GC: keep newest 12 thumbs.
    TS=$(date +%s)
    if timeout 25 scp -o ConnectTimeout=8 -o BatchMode=yes -q /tmp/rot-thumb.jpg \
        "$VPS:/var/www/thumbs/clip-$CLIP-$TS.jpg" 2>/dev/null; then
      IMG="https://stream.silvafamily.space/thumbs/clip-$CLIP-$TS.jpg"
      timeout 15 ssh -o BatchMode=yes $VPS 'cd /var/www/thumbs && ls -t clip-*.jpg 2>/dev/null | tail -n +13 | xargs -r rm --' 2>/dev/null
      echo "$(date '+%F %T') rotate: clip=$CLIP img=$IMG"
    else
      UP=$(curl -s -m 45 -F reqtype=fileupload -F userhash= \
           -F "fileToUpload=@/tmp/rot-thumb.jpg;type=image/jpeg" https://catbox.moe/user/api.php 2>/dev/null)
      case "$UP" in https://*) IMG="$UP"; echo "$(date '+%F %T') rotate(catbox): clip=$CLIP img=$IMG" ;; esac
    fi
  fi
fi
[ -z "$IMG" ] && IMG=$(echo "$STATE" | grep -oE 'https://files\.catbox\.moe/[a-z0-9]+\.jpg' | head -1)

ARGS=(--data-urlencode "mode=start" --data-urlencode "d=idle-replay-247" --data-urlencode "title=$TITLE")
[ -n "$IMG" ] && ARGS+=(--data-urlencode "image=$IMG")
curl -s -m 25 --get "$PANEL/api/announce" "${ARGS[@]}" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print('keepalive', d.get('id','')[:12], sum(1 for r in d.get('results',[]) if r[1]=='accepted'),'/',len(d.get('results',[])),'relays')"
