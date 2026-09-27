# Thumbnail feature (added 2026-09-25/26 build)

- go-live.html now has a drag-drop box + URL field for the NIP-53 kind-30311 `image` tag.
  Drop a JPG/PNG (or paste a public https URL). Persisted in localStorage
  (livestream.lastImage) and restored after reload; carried on BOTH start and
  stop/end announcements, on both signing paths (Alby NIP-07 client-side and
  server-side /api/announce fallback).
- Server: POST /api/upload_thumb {name, data_b64} -> saves under thumbs/ and
  publishes the file to a public URL (catbox.moe, content-hash dedup, files
  kept ~2 years with traffic). stdlib-only, no new deps.
- Jefizzle Studio route also present: /api/thumb pulls a ComfyUI still, freezes
  it in thumbs/, scp-publishes to the VPS (needs working root SSH to the VPS).
- zap.stream / Shosho / Sifaka read the `image` tag for the stream card art.
  Relays replace the listing in place: re-announce with the same `d` tag.
- Windows autostart: drop a .vbs in shell:startup running pythonw.exe on
  livestream-server.py. IMPORTANT for headless/pythonw use: _hide_kwargs()
  (CREATE_NO_WINDOW + SW_HIDE) is applied to all subprocess.run sites — without
  it, every /api/ingest poll flashes a cmd window and can wake monitors.
