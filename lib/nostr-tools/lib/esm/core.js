// utils.ts
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
var utf8Decoder = new TextDecoder("utf-8");
var utf8Encoder = new TextEncoder();
function isHex32(input) {
  if (input.length !== 64)
    return false;
  for (let i = 0; i < 64; i++) {
    let cc = input.charCodeAt(i);
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
  for (let i = 0; i < event.tags.length; i++) {
    let tag = event.tags[i];
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
export {
  compareEvents,
  sortEvents,
  validateEvent,
  verifiedSymbol
};
