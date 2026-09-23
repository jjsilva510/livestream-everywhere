#!/usr/bin/env bash
# Publish (or delete) a NIP-72 livestream event for the Livestream Everywhere hub.
# Usage:  ./nostr-live.sh start "My stream title" [d-id]
#         ./nostr-live.sh stop  <d-id>
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# HLS URL + relays come from config.json next to this script (copy config.example.json).
CONFIG_FILE="${LIVESTREAM_CONFIG:-$SCRIPT_DIR/config.json}"
[ -f "$CONFIG_FILE" ] || CONFIG_FILE="$SCRIPT_DIR/config.example.json"
HLS_URL="${HLS_URL:-$(python3 -c 'import json,sys;c=json.load(open(sys.argv[1]));print(c["hls_base"].rstrip("/")+"/"+c.get("stream_path","index")+"/index.m3u8")' "$CONFIG_FILE")}"
KEY_FILE="${NOSTR_LIVE_KEY:-$(python3 -c 'import json,sys,os;print(os.path.expanduser(json.load(open(sys.argv[1])).get("key_file","~/.config/nostr-live/privkey.hex")))' "$CONFIG_FILE")}"   # 64-char hex nsec, chmod 600

MODE="${1:-}"; TITLE="${2:-Livestream Everywhere}"; D="${3:-$(date +%s)}"

[ -f "$KEY_FILE" ] || { echo "no signing key at $KEY_FILE — create: openssl rand -hex 32 > $KEY_FILE && chmod 600 $KEY_FILE" >&2; exit 1; }

node --input-type=module - "$SCRIPT_DIR/lib" "$MODE" "$TITLE" "$D" "$HLS_URL" "$KEY_FILE" <<'EOF'
import { readFileSync } from 'fs';
const [, , libDir, mode, title, d, hls, keyFile] = process.argv;
const { finalizeEvent, getPublicKey } = await import(libDir + '/nostr-tools/lib/esm/index.js');

const sk = Buffer.from(readFileSync(keyFile, 'utf8').trim(), 'hex');
const pk = getPublicKey(sk);

const tags = mode === 'stop'
  ? [['d', d]]
  : [['d', d], ['title', title], ['t', hls], ['published_at', String(Math.floor(Date.now()/1000))]];

const ev = finalizeEvent({ kind: 30311, created_at: Math.floor(Date.now()/1000), tags, content: '' }, sk);

async function pub(url) {
  return new Promise(res => {
    const ws = new WebSocket(url); const t = setTimeout(() => { try{ws.close()}catch{}; res([url,'timeout']); }, 8000);
    ws.onopen = () => ws.send(JSON.stringify(['EVENT', ev]));
    ws.onmessage = m => { const j = JSON.parse(m.data); if (j[0]==='OK') { clearTimeout(t); res([url, j[2] ? 'accepted' : ('rejected: '+(j[3]||''))]); try{ws.close()}catch{} } };
    ws.onerror = () => { clearTimeout(t); res([url,'error']); };
  });
}
const results = await Promise.all(['wss://relay.primal.net','wss://nos.lol','wss://relay.damus.io'].map(pub));
console.log(`kind 30311 ${mode} | pubkey ${pk.slice(0,12)}… | id ${ev.id.slice(0,12)}…`);
for (const [r,s] of results) console.log(' ', r.replace('wss://',''), s);
process.exit(0);
EOF
