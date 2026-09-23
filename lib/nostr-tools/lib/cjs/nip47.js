"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// nip47.ts
var nip47_exports = {};
__export(nip47_exports, {
  makeNwcRequestEvent: () => makeNwcRequestEvent,
  parseConnectionString: () => parseConnectionString
});
module.exports = __toCommonJS(nip47_exports);

// pure.ts
var import_secp256k1 = require("@noble/curves/secp256k1.js");
var import_utils3 = require("@noble/hashes/utils.js");

// utils.ts
var import_utils = require("@noble/hashes/utils.js");
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

// pure.ts
var import_sha2 = require("@noble/hashes/sha2.js");
var JS = class {
  generateSecretKey() {
    return import_secp256k1.schnorr.utils.randomSecretKey();
  }
  getPublicKey(secretKey) {
    return (0, import_utils3.bytesToHex)(import_secp256k1.schnorr.getPublicKey(secretKey));
  }
  finalizeEvent(t, secretKey) {
    const event = t;
    event.pubkey = (0, import_utils3.bytesToHex)(import_secp256k1.schnorr.getPublicKey(secretKey));
    event.id = getEventHash(event);
    event.sig = (0, import_utils3.bytesToHex)(import_secp256k1.schnorr.sign((0, import_utils3.hexToBytes)(getEventHash(event)), secretKey));
    event[verifiedSymbol] = true;
    return event;
  }
  verifyEvent(event) {
    if (typeof event[verifiedSymbol] === "boolean")
      return event[verifiedSymbol];
    try {
      const hash = getEventHash(event);
      if (hash !== event.id) {
        event[verifiedSymbol] = false;
        return false;
      }
      const valid = import_secp256k1.schnorr.verify((0, import_utils3.hexToBytes)(event.sig), (0, import_utils3.hexToBytes)(hash), (0, import_utils3.hexToBytes)(event.pubkey));
      event[verifiedSymbol] = valid;
      return valid;
    } catch (err) {
      event[verifiedSymbol] = false;
      return false;
    }
  }
};
function serializeEvent(evt) {
  if (!validateEvent(evt))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, evt.pubkey, evt.created_at, evt.kind, evt.tags, evt.content]);
}
function getEventHash(event) {
  let eventHash = (0, import_sha2.sha256)(utf8Encoder.encode(serializeEvent(event)));
  return (0, import_utils3.bytesToHex)(eventHash);
}
var i = new JS();
var generateSecretKey = i.generateSecretKey;
var getPublicKey = i.getPublicKey;
var finalizeEvent = i.finalizeEvent;
var verifyEvent = i.verifyEvent;

// kinds.ts
var NWCWalletRequest = 23194;

// nip04.ts
var import_utils5 = require("@noble/hashes/utils.js");
var import_secp256k12 = require("@noble/curves/secp256k1.js");
var import_aes = require("@noble/ciphers/aes.js");
var import_base = require("@scure/base");
function encrypt(secretKey, pubkey, text) {
  const privkey = secretKey instanceof Uint8Array ? secretKey : (0, import_utils5.hexToBytes)(secretKey);
  const key = import_secp256k12.secp256k1.getSharedSecret(privkey, (0, import_utils5.hexToBytes)("02" + pubkey));
  const normalizedKey = getNormalizedX(key);
  let iv = Uint8Array.from((0, import_utils5.randomBytes)(16));
  let plaintext = utf8Encoder.encode(text);
  let ciphertext = (0, import_aes.cbc)(normalizedKey, iv).encrypt(plaintext);
  let ctb64 = import_base.base64.encode(new Uint8Array(ciphertext));
  let ivb64 = import_base.base64.encode(new Uint8Array(iv.buffer));
  return `${ctb64}?iv=${ivb64}`;
}
function getNormalizedX(key) {
  return key.slice(1, 33);
}

// nip47.ts
function parseConnectionString(connectionString) {
  const { host, pathname, searchParams } = new URL(connectionString);
  const pubkey = pathname || host;
  const relays = searchParams.getAll("relay");
  const secret = searchParams.get("secret");
  if (!pubkey || relays.length === 0 || !secret) {
    throw new Error("invalid connection string");
  }
  return { pubkey, relay: relays[0], relays, secret };
}
async function makeNwcRequestEvent(pubkey, secretKey, invoice) {
  const content = {
    method: "pay_invoice",
    params: {
      invoice
    }
  };
  const encryptedContent = encrypt(secretKey, pubkey, JSON.stringify(content));
  const eventTemplate = {
    kind: NWCWalletRequest,
    created_at: Math.round(Date.now() / 1e3),
    content: encryptedContent,
    tags: [["p", pubkey]]
  };
  return finalizeEvent(eventTemplate, secretKey);
}
