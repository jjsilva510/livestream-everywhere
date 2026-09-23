// wasm.ts
import { bytesToHex as bytesToHex2 } from "@noble/hashes/utils.js";

// utils.ts
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
var utf8Decoder = new TextDecoder("utf-8");
var utf8Encoder = new TextEncoder();
function isHex32(input) {
  if (input.length !== 64)
    return false;
  for (let i2 = 0; i2 < 64; i2++) {
    let cc = input.charCodeAt(i2);
    if (isNaN(cc) || cc < 48 || cc > 102 || cc > 57 && cc < 97) {
      return false;
    }
  }
  return true;
}

// core.ts
var verifiedSymbol = Symbol("verified");
var isRecord = (obj) => obj instanceof Object;
function validateEvent(event) {
  if (!isRecord(event))
    return false;
  if (typeof event.kind !== "number")
    return false;
  if (typeof event.content !== "string")
    return false;
  if (typeof event.created_at !== "number")
    return false;
  if (typeof event.pubkey !== "string")
    return false;
  if (!isHex32(event.pubkey))
    return false;
  if (!Array.isArray(event.tags))
    return false;
  for (let i2 = 0; i2 < event.tags.length; i2++) {
    let tag = event.tags[i2];
    if (!Array.isArray(tag))
      return false;
    for (let j = 0; j < tag.length; j++) {
      if (typeof tag[j] !== "string")
        return false;
    }
  }
  return true;
}
function compareEvents(a, b) {
  if (a.created_at !== b.created_at) {
    return b.created_at - a.created_at;
  }
  return a.id.localeCompare(b.id);
}
function sortEvents(events) {
  return events.sort(compareEvents);
}

// wasm.ts
var nw;
function setNostrWasm(x) {
  nw = x;
}
var Wasm = class {
  generateSecretKey() {
    return nw.generateSecretKey();
  }
  getPublicKey(secretKey) {
    return bytesToHex2(nw.getPublicKey(secretKey));
  }
  finalizeEvent(t, secretKey) {
    nw.finalizeEvent(t, secretKey);
    return t;
  }
  verifyEvent(event) {
    try {
      nw.verifyEvent(event);
      event[verifiedSymbol] = true;
      return true;
    } catch (err) {
      return false;
    }
  }
};
var i = new Wasm();
var generateSecretKey = i.generateSecretKey;
var getPublicKey = i.getPublicKey;
var finalizeEvent = i.finalizeEvent;
var verifyEvent = i.verifyEvent;
export {
  compareEvents,
  finalizeEvent,
  generateSecretKey,
  getPublicKey,
  setNostrWasm,
  sortEvents,
  validateEvent,
  verifiedSymbol,
  verifyEvent
};
