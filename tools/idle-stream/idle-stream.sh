#!/usr/bin/env bash
# idle-stream.sh — loop the VOD playlist into MediaMTX RTMP as the live publisher.
# Pipe-through: yt-dlp stdout -> ffmpeg -> rtmp. ~zero disk use.
# Paused by touching /run/idle-stream.pause (the watchdog respects it too).
#
# 2026-10-07 (backups: idle-stream.{sh,conf}.bak-20261007):
#  * $YTDLP_JS passes a *supported* JS runtime (deno 2.9.7 in /opt/deno-ejs) so yt-dlp
#    can mint YouTube proof-of-origin tokens; the old /usr/local/bin/deno 2.1.9 was
#    reported "unsupported" => no challenge solver.
#  * real exit codes are logged (the old `rc=$?` captured the arithmetic line = always 0).
#  * a fast failure is retried once before the video is judged.
#  * failures are classified: "Sign in to confirm" = IP/bot-wall => keep the 15min sleep.
#    Anything else (SABR-only/missing URL/one-off 5xx) parks THAT video for $PARK_HOURS
#    and keeps streaming, so two bad videos can no longer black out the channel.
set -uo pipefail
. /root/idle-stream/idle-stream.conf
PAUSE=/run/idle-stream.pause
ERRLOG=/var/log/idle-stream.err
SKIP=/root/idle-stream/skip.txt
PARK_HOURS=${PARK_HOURS:-6}
log(){ echo "$(date -Is) $*"; logger -t idle-stream "$*" || true; }
fails=0

attempt(){   # attempt <id> <client_args>  -> sets DUR RC_YT RC_FF BOTWALL NOURL
  local id=$1 client=$2 t0 err
  err=$(mktemp)
  t0=$(date +%s)
  yt-dlp $YTDLP_JS --extractor-args "$client" -f "$FORMAT" --no-playlist \
    --limit-rate "$YTDL_RATE_LIMIT" -q -o - \
    "https://www.youtube.com/watch?v=$id" 2>>"$err" \
  | ffmpeg -hide_banner -loglevel warning -re -i pipe:0 \
      -c copy \
      -max_muxing_queue_size 4096 \
      -f flv -flvflags no_duration_filesize "$RTMP_BASE/$STREAM_KEY" 2>>"$err"
  local ps=("${PIPESTATUS[@]}")
  RC_YT=${ps[0]:-1}; RC_FF=${ps[1]:-1}
  DUR=$(( $(date +%s) - t0 ))
  BOTWALL=$(grep -c 'Sign in to confirm' "$err" 2>/dev/null || true)
  NOURL=$(grep -cE 'missing a URL|SABR-only' "$err" 2>/dev/null || true)
  CLAIM=$(grep -cE "blocked due to the claimed content|It was blocked due to" "$err" 2>/dev/null || true)
  cat "$err" >> "$ERRLOG" 2>/dev/null || true
  rm -f "$err"
  return 0
}

while :; do
  if [ -f "$PAUSE" ]; then sleep 20; continue; fi
  if [ -s /root/idle-stream/vod-ids.txt ]; then
    ids=$(tr -d '\r' < /root/idle-stream/vod-ids.txt)
  else
    ids=$(yt-dlp $YTDLP_JS --flat-playlist --print id "$PLAYLIST_URL" 2>/dev/null)
  fi
  if [ -z "$ids" ]; then log "playlist empty or unreachable — retry in 120s"; sleep 120; continue; fi
  now=$(date +%s)
  for id in $ids; do
    [ -f "$PAUSE" ] && break
    until=$(awk -v i="$id" '$1==i && $2+0>0 {print $2}' "$SKIP" 2>/dev/null | tail -1)
    if [ -n "${until:-}" ] && [ "${until:-0}" -gt "$now" ]; then continue; fi
    log "idle: playing $id"
    attempt "$id" "$CLIENT_ARGS"
    log "idle: $id ended after ${DUR}s (yt_rc=$RC_YT ff_rc=$RC_FF botwall=$BOTWALL nourl=$NOURL)"
    if [ "$DUR" -lt 20 ] && [ "${CLAIM:-0}" -gt 0 ]; then
      printf '%s %s claimed\n' "$id" 4102444800 >> "$SKIP"
      log "CLAIMED $id (YouTube content claim) — removed from rotation permanently"
      sleep 8; continue
    fi
    if [ "$DUR" -lt 20 ]; then
      sleep 5
      log "idle: $id retrying"
      attempt "$id" "${CLIENT_ARGS_RETRY:-$CLIENT_ARGS}"
      log "idle: $id retry ended after ${DUR}s (yt_rc=$RC_YT ff_rc=$RC_FF botwall=$BOTWALL nourl=$NOURL)"
    fi
    if [ "$DUR" -ge 20 ]; then
      fails=0
      awk -v i="$id" '$1!=i' "$SKIP" > "$SKIP.tmp" 2>/dev/null && mv "$SKIP.tmp" "$SKIP"
    elif [ "${BOTWALL:-0}" -gt 0 ]; then
      fails=$((fails+1))
      log "BOTWALL on $id ($fails consecutive) — YouTube is challenging this IP"
      if [ "$fails" -ge 3 ]; then
        log "THROTTLE_SUSPECT: 3 bot-walled failures — sleeping 15min"
        sleep 900; fails=0
      fi
    else
      prev=$(awk -v i="$id" '$1==i{c++} END{print c+0}' "$SKIP" 2>/dev/null)
      if [ "${prev:-0}" -ge 1 ]; then
        printf '%s %s nourl=%s yt=%s ff=%s\n' "$id" "$(( now + PARK_HOURS*3600 ))" "${NOURL:-0}" "$RC_YT" "$RC_FF" >> "$SKIP"
        log "PARKED $id for ${PARK_HOURS}h (nourl=$NOURL yt_rc=$RC_YT ff_rc=$RC_FF) — not counted as throttle"
      else
        printf '%s 0 seen=fastfail\n' "$id" >> "$SKIP"
        log "idle: $id short (${DUR}s) twice — parked once for the next pass to re-judge"
      fi
      fails=0
    fi
    sleep 8
  done
done
