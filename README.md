# Livestream Everywhere

**Own your broadcast.** One click in a browser takes you live on [Nostr](https://nostr.com) —
your stream, your VPS, your domain, your keys. No platform login, no paywall that appears
mid-stream, no frontend that redesigns itself out from under you.

```
┌───────────┐  1× RTMP   ┌───────────────────────────┐        ┌─▶ HLS on YOUR domain (watch.html)
│    OBS    ├───────────▶│  Your VPS · MediaMTX       ├──────┤
└───────────┘            │  (docker, ~30 MB RAM)      │        └─▶ auto-records .mp4
                         └────────────┬──────────────┘
                                      │ HTTPS (HLS URL)
                         ┌────────────▼──────────────┐
                         │  This panel (any box)      │  GO LIVE / END
                         │  livestream-server.py      ├────────────▶ signs NIP-53 kind 30311
                         │  browser UI on :8765       │              with YOUR local key
                         └───────────────────────────┘              → relays → any Nostr client
```

## What it does

- **GO LIVE** publishes a NIP-53 livestream event (kind `30311`) to your relays with your
  HLS URL — clients like zap.stream, Shosho, Distro and Amethyst pick it up automatically.
- **END** publishes the matching `status=ended` event.
- **Live ingest indicator** — the panel asks MediaMTX (over SSH) whether OBS is actually
  pushing right now, so the button state matches reality.
- **Two signing modes** — sign with your browser extension (Alby / NIP-07) or let the
  server sign locally with your key file. The key never leaves your machine either way.

## Requirements

- Any box that can SSH to your VPS (Python 3.11+, Node 22+).
- A VPS running [MediaMTX](https://github.com/bluenviron/mediamtx) with RTMP ingest + HLS out,
  behind your own domain (Caddy/nginx). See [WINDOWS-setup.txt](WINDOWS-setup.txt) for a
  worked example.
- A Nostr keypair (one command to create — see below).

## Setup (5 minutes)

```bash
cp config.example.json config.json      # fill in your VPS host, HLS base, stream path
mkdir -p ~/.config/nostr-live
openssl rand -hex 32 > ~/.config/nostr-live/privkey.hex && chmod 600 ~/.config/nostr-live/privkey.hex
python3 livestream-server.py            # then open http://localhost:8765
```

In OBS: Server = `rtmp://<your-vps>:1936/live`, Stream Key = your `stream_path`.
Open the panel, press **GO LIVE**, start streaming in OBS. Done.

## Files

| File | Purpose |
|------|---------|
| `livestream-server.py` | stdlib-only panel server + server-side signer bridge |
| `go-live.html` | the one-button UI (served at `/`) |
| `watch.html` | minimal HLS player page |
| `nostr-live.sh` | CLI announce (`./nostr-live.sh start "Title"` / `stop <d-id>`) |
| `lib/` | vendored nostr-tools + deps — works fully offline, no CDN |
| `scripts/gatecheck.sh` | pre-commit secret scanner — run it before publishing changes |

## Privacy

Nothing phones home. The panel talks only to your VPS (SSH), your relays (WSS), and the
browser talks only to the panel. `config.json` and `privkey.hex` are gitignored — the
public repo can never contain your infrastructure.

## License

MIT — see [LICENSE](LICENSE).
