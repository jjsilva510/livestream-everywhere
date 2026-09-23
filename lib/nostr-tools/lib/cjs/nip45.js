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

// nip45.ts
var nip45_exports = {};
__export(nip45_exports, {
  computeOffset: () => computeOffset,
  estimateCount: () => estimateCount,
  feedEvent: () => feedEvent,
  feedPubkey: () => feedPubkey,
  getCountManyFilter: () => getCountManyFilter,
  getFilterFirstTagValue: () => getFilterFirstTagValue,
  hllDecode: () => hllDecode,
  hllEncode: () => hllEncode,
  mergeHll: () => mergeHll,
  newHll: () => newHll
});
module.exports = __toCommonJS(nip45_exports);
var import_sha2 = require("@noble/hashes/sha2.js");
var import_utils2 = require("@noble/hashes/utils.js");

// utils.ts
var import_utils = require("@noble/hashes/utils.js");
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

// nip45.ts
var M = 256;
var HLL_HEX_LENGTH = M * 2;
var utf8Encoder2 = new TextEncoder();
function getCountManyFilter(target, directive) {
  switch (directive) {
    case "reactions":
      return { "#e": [target], kinds: [7] };
    case "reposts":
      return { "#e": [target], kinds: [6] };
    case "quotes":
      return { "#q": [target], kinds: [1, 1111] };
    case "replies":
      return { "#e": [target], kinds: [1] };
    case "comments":
      return { "#E": [target], kinds: [1111] };
    case "followers":
      return { "#p": [target], kinds: [3] };
  }
}
function newHll() {
  return new Uint8Array(M);
}
function hllDecode(hex) {
  if (hex.length !== HLL_HEX_LENGTH || !/^[0-9a-f]+$/.test(hex))
    return void 0;
  const registers = new Uint8Array(M);
  for (let i = 0; i < M; i++) {
    registers[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return registers;
}
function hllEncode(registers) {
  if (registers.length !== M)
    throw new Error(`invalid number of registers ${registers.length}`);
  let hex = "";
  for (let i = 0; i < M; i++) {
    hex += registers[i].toString(16).padStart(2, "0");
  }
  return hex;
}
function computeOffset(filterFirstTagValue) {
  let hex = filterFirstTagValue;
  if (!isHex32(hex)) {
    const parts = hex.split(":");
    if (parts.length === 3 && isHex32(parts[1])) {
      hex = parts[1];
    } else {
      hex = (0, import_utils2.bytesToHex)((0, import_sha2.sha256)(utf8Encoder2.encode(filterFirstTagValue)));
    }
  }
  return parseInt(hex[32], 16) + 8;
}
function getFilterFirstTagValue(filter) {
  for (const key in filter) {
    if (key[0] !== "#")
      continue;
    const values = filter[key];
    if (Array.isArray(values) && typeof values[0] === "string")
      return values[0];
  }
  return void 0;
}
function feedPubkey(hll, pubkey, offset) {
  if (offset < 0 || offset > 24)
    throw new Error(`invalid offset ${offset}`);
  if (!isHex32(pubkey))
    throw new Error("pubkey must be 32-byte hex");
  if (hll.length === 0)
    hll = newHll();
  if (hll.length !== M)
    throw new Error(`invalid number of registers ${hll.length}`);
  const ri = parseInt(pubkey.slice(offset * 2, offset * 2 + 2), 16);
  const value = countLeadingZeroBitsAfterOffset(pubkey, offset) + 1;
  if (value > hll[ri])
    hll[ri] = value;
  return hll;
}
function feedEvent(hll, event, offset) {
  return feedPubkey(hll, event.pubkey, offset);
}
function mergeHll(target, source) {
  if (target.length === 0)
    target = newHll();
  if (target.length !== M)
    throw new Error(`invalid number of registers ${target.length}`);
  if (source.length !== M)
    throw new Error(`invalid number of registers ${source.length}`);
  for (let i = 0; i < M; i++) {
    if (source[i] > target[i])
      target[i] = source[i];
  }
  return target;
}
function estimateCount(hll) {
  if (hll.length === 0)
    return 0;
  if (hll.length !== M)
    throw new Error(`invalid number of registers ${hll.length}`);
  const v = countZeros(hll);
  if (v !== 0) {
    const lc = linearCounting(M, v);
    if (lc <= 220)
      return Math.floor(lc);
  }
  const estimate = calculateEstimate(hll);
  if (estimate <= M * 3 && v !== 0)
    return Math.floor(linearCounting(M, v));
  return Math.floor(estimate);
}
function countLeadingZeroBitsAfterOffset(pubkey, offset) {
  let zeroBits = 0;
  for (let i = offset + 1; i < offset + 8; i++) {
    const byte = parseInt(pubkey.slice(i * 2, i * 2 + 2), 16);
    if (byte === 0) {
      zeroBits += 8;
      continue;
    }
    let mask = 128;
    while ((byte & mask) === 0) {
      zeroBits++;
      mask >>= 1;
    }
    break;
  }
  return zeroBits;
}
function countZeros(registers) {
  let count = 0;
  for (let i = 0; i < M; i++) {
    if (registers[i] === 0)
      count++;
  }
  return count;
}
function linearCounting(m, v) {
  return m * Math.log(m / v);
}
function calculateEstimate(registers) {
  let sum = 0;
  for (let i = 0; i < M; i++) {
    sum += 1 / 2 ** registers[i];
  }
  return 0.7182725932495458 * M * M / sum;
}
