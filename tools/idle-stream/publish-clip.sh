#!/usr/bin/env bash
# publish-clip.sh — daily clip release wrapper (env + venv wiring, mirrors yt-jefizzle.sh)
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PY="$HOME/.openclaw/workspace/youtube/venv/bin/python"
TOKEN="${JEFIZZLE_YT_TOKEN:-$DIR/../../../../media/youtube-jefizzle-token.json}"
CLIENT_ID="$(cd "$HOME/.openclaw/workspace/.secrets" && ./secrets.sh get youtube/oauth-client-id)"
CLIENT_SECRET="$(cd "$HOME/.openclaw/workspace/.secrets" && ./secrets.sh get youtube/oauth-client-secret)"
export YT_CLIENT_ID="$CLIENT_ID" YT_CLIENT_SECRET="$CLIENT_SECRET" YT_TOKEN="$TOKEN"
CFG="$DIR/../../config.json"
export LIVESTREAM_VPS_SSH="${LIVESTREAM_VPS_SSH:-$("$PY" -c "import json;print(json.load(open('$CFG'))['vps_ssh'])" 2>/dev/null)}"
exec "$PY" "$DIR/publish-clip.py" "$@"
