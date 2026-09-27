#!/usr/bin/env bash
# Push a local file to the VPS and serve it at https://stream.silvafamily.space/pub/<name>
# Usage: ./publish-thumb.sh <local-file>   (e.g. thumbs/IMG_00001_.png)
set -euo pipefail
VPS="${LIVESTREAM_VPS_SSH:?set LIVESTREAM_VPS_SSH (e.g. root@your-vps-ip) or run via the panel, which passes it from config.json}"
FILE="${1:?usage: publish-thumb.sh <file>}"
NAME="$(basename "$FILE")"
ssh "$VPS" "mkdir -p /var/www/thumbs"
scp -q "$FILE" "$VPS:/var/www/thumbs/$NAME"
echo "https://stream.silvafamily.space/thumbs/$NAME"
