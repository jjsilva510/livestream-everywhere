#!/usr/bin/env bash
# idle-watchdog.sh — keep the live path always occupied:
#  - path has publisher + idle active   -> ours, fine
#  - path has publisher + idle inactive -> real live stream in progress, stay down
#  - path empty 2 ticks (~60s) + no pause file -> start idle
#  - idle active but path lost publisher -> broken pipeline, restart it
set -uo pipefail
. /root/idle-stream/idle-stream.conf
PAUSE=/run/idle-stream.pause
EMPTY=/run/idle-stream.empty
PATHID="live/$STREAM_KEY"

json=$(curl -sf http://127.0.0.1:9998/v3/paths/list || true)
ready=$(printf '%s' "$json" | python3 -c '
import json,sys
try: d=json.load(sys.stdin)
except Exception: print("err"); raise SystemExit
p=[x for x in d.get("items",[]) if x.get("name")==sys.argv[1]]
print("True" if p and p[0].get("ready") else "False")' "$PATHID" 2>/dev/null || echo err)

# auto-expire a stale pause after 12h so the stream never dies silent
if [ -f "$PAUSE" ]; then
  age=$(( $(date +%s) - $(stat -c %Y "$PAUSE") ))
  [ "$age" -gt 43200 ] && rm -f "$PAUSE" && logger -t idle-watchdog "pause auto-expired after 12h"
fi

active=$(systemctl is-active idle-stream 2>/dev/null || echo inactive)

if [ "$ready" = "True" ]; then
  rm -f "$EMPTY"
  [ "$active" != "active" ] && systemctl stop idle-stream 2>/dev/null || true
else
  n=$(( $(cat "$EMPTY" 2>/dev/null || echo 0) + 1 )); echo $n > "$EMPTY"
  if [ "$active" = "active" ]; then
    [ $n -ge 4 ] && { systemctl restart idle-stream; echo 0 > "$EMPTY"; logger -t idle-watchdog "restarted dead idle pipeline"; }
  elif [ ! -f "$PAUSE" ] && [ $n -ge 2 ]; then
    systemctl start idle-stream; logger -t idle-watchdog "path empty -> starting idle stream"
  fi
fi
