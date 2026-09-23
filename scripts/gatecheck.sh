#!/usr/bin/env bash
# Pre-release secret gate: run from repo root. Nonzero exit = DO NOT PUBLISH.
# Flags: real (non-example) IPv4 addresses, nsec/npub strings, 64-hex key material,
# private key blocks. Allows localhost, netmasks, and <PLACEHOLDER> style examples.
set -euo pipefail
cd "$(dirname "$0")/.."

ALLOW='127\.0\.0\.1|0\.0\.0\.0|255\.255\.|\[0-9\]\.\[0-9\]|1\.9\.3'
PATTERN='nsec1[a-z0-9]{10,}|npub1[a-z0-9]{20,}|BEGIN [A-Z ]*PRIVATE KEY|[0-9a-fA-F]{64}|([0-9]{1,3}\.){3}[0-9]{1,3}'

HITS=$(grep -rInE "$PATTERN" --exclude-dir=lib --exclude-dir=.git --exclude=gatecheck.sh \
      --exclude=config.json . || true)
# drop allowed lines
HITS=$(echo "$HITS" | grep -vE "$ALLOW" || true)

if [ -n "$HITS" ]; then
  echo "❌ SECRET GATE FAILED — fix these before any public commit:"
  echo "$HITS"
  exit 1
fi
echo "✅ gate passed: no private IPs, keys, or npubs outside gitignored config"
