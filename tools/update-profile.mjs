// One-off: rebrand Jefizzle Clips kind-0 -> "Jefizzle" replay pointer (nostr, not YouTube).
// Usage: node tools/update-profile.mjs [--publish]
import { readFileSync } from 'fs';
import { finalizeEvent, getPublicKey } from '../lib/nostr-tools/lib/esm/index.js';

const HERE = new URL('.', import.meta.url).pathname;
const CFG = JSON.parse(readFileSync(HERE + '../config.json', 'utf8'));
const RELAYS = CFG.relays;
const sk = Buffer.from(readFileSync(process.env.HOME + '/.config/nostr-live/privkey.hex', 'utf8').trim(), 'hex');
const pk = getPublicKey(sk);

const MAIN_NPUB = 'npub1ypj34wxzlv07hjjkhqx7hg2xxzh5227uue873uz2na0k0e9rc8xqeapukx';

// 1) fetch current kind 0 (defensive)
function fetchKind0(url) {
  return new Promise(res => {
    const ws = new WebSocket(url); const t = setTimeout(() => { try { ws.close() } catch {} res(null); }, 8000);
    ws.onopen = () => ws.send(JSON.stringify(['REQ', 'q1', { kinds: [0], authors: [pk], limit: 1 }]));
    ws.onmessage = m => {
      let j; try { j = JSON.parse(m.data); } catch { return; }
      if (j[0] === 'EVENT' && j[2] && typeof j[2].content === 'string') {
        clearTimeout(t); try { ws.close() } catch {}
        try { res(JSON.parse(j[2].content)) } catch { res(null) }
      }
    };
    ws.onerror = () => { clearTimeout(t); res(null) };
  });
}

let cur = null;
for (const r of RELAYS) { cur = await fetchKind0(r); if (cur) break; }
console.log('current kind 0:', JSON.stringify(cur));
if (!cur) {
  if (process.argv.includes('--image')) {
    console.log('no existing profile found on relays — building fresh one');
    cur = { name: 'JefizzleClips', display_name: 'Jefizzle Clips',
            website: 'https://stream.silvafamily.space' };
  } else { console.error('could not fetch existing profile — aborting, nothing merged'); process.exit(1); }
}

// 2) merge fields (always keep existing about; only override when --about given)
const prof = { ...cur };
if (!prof.about) {
  prof.about = '24/7 clip replay — not live right now. When Jeffrey is actually live it is announced on this account first. Follow the main account: ' + MAIN_NPUB + ' (zap: jefizzle@cake.cash)';
}
if (process.argv.includes('--image')) {
  prof.picture = process.argv[process.argv.indexOf('--image') + 1];
  prof.banner = prof.picture;
}

// 3) publish kind 0
function pub(url, ev) {
  return new Promise(res => {
    const ws = new WebSocket(url); const t = setTimeout(() => { try { ws.close() } catch {} res([url, 'timeout']); }, 8000);
    ws.onopen = () => ws.send(JSON.stringify(['EVENT', ev]));
    ws.onmessage = m => { let j; try { j = JSON.parse(m.data); } catch { return; } if (j[0] === 'OK') { clearTimeout(t); res([url, j[2] ? 'accepted' : 'rejected: ' + (j[3] || '')]); try { ws.close() } catch {} } };    ws.onerror = () => { clearTimeout(t); res([url, 'error']); };
  });
}

const ev = finalizeEvent({ kind: 0, created_at: Math.floor(Date.now() / 1000), tags: [], content: JSON.stringify(prof) }, sk);
console.log('signed kind 0 id', ev.id.slice(0, 12) + '… pubkey', pk.slice(0, 12) + '…');
if (!process.argv.includes('--publish')) { console.log('dry run — pass --publish to send'); process.exit(0); }
for (const [r, s] of await Promise.all(RELAYS.map(u => pub(u, ev)))) console.log(' ', r.replace('wss://', ''), s);
