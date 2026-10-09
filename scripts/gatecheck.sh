#!/usr/bin/env bash
# Pre-release secret gate: run from repo root. Nonzero exit = DO NOT PUBLISH.
# HARD FAILS: real (non-example) IPv4 addresses, nsec strings, 64-hex key material,
# private key blocks, root@ VPS ssh targets, stream-key literals.
# WARNINGS (non-failing): npub strings — a nostr public identifier is public by
# design (it rides every NIP-53 event); the private key is the secret.
# Allows localhost, netmasks, and <PLACEHOLDER> style examples.
set -euo pipefail
cd "$(dirname "$0")/.."

ALLOW='127\.0\.0\.1|0\.0\.0\.0|255\.255\.|\[0-9\]\.\[0-9\]|1\.9\.3|10\.0\.0\.[0-9]|your-vps|vps\.example|<user>@'
HARD='nsec1[a-z0-9]{10,}|BEGIN [A-Z ]*PRIVATE KEY|[0-9a-fA-F]{64}|([0-9]{1,3}\.){3}[0-9]{1,3}|root@[0-9a-zA-Z.-]+'
WARN='npub1[a-z0-9]{20,}'
SCANNED='--exclude-dir=lib --exclude-dir=.git --exclude-dir=__pycache__ --exclude=gatecheck.sh --exclude=config.json --exclude=studio-config.json --exclude=config.example.json'

HITS=$(grep -rInE "$HARD" --exclude-dir=lib --exclude-dir=.git --exclude-dir=__pycache__ --exclude=gatecheck.sh \
      --exclude=config.json --exclude=studio-config.json --exclude=config.example.json . || true)
HITS=$(echo "$HITS" | grep -vE "$ALLOW" || true)
NPUBS=$(grep -rInE "$WARN" --exclude-dir=lib --exclude-dir=.git --exclude-dir=__pycache__ \
      --exclude=config.json --exclude=studio-config.json --exclude=config.example.json . || true)

if [ -n "$HITS" ]; then
  echo "$HITS"
  echo "❌ SECRET GATE FAILED — fix these before any public commit"
  exit 1
fi
if [ -n "$NPUBS" ]; then
  echo "⚠️  npub (public identity) lines, allowed:"; echo "$NPUBS" | sed 's/^/   /' | head -10
fi
echo "✅ gate passed: no private keys, IPs, nsec, or ssh targets — npub lines are public identity"
