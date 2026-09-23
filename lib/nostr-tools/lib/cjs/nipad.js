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

// nipad.ts
var nipad_exports = {};
__export(nipad_exports, {
  AD_REGEX: () => AD_REGEX,
  isWebAddress: () => isWebAddress,
  queryWebAddress: () => queryWebAddress,
  useFetchImplementation: () => useFetchImplementation
});
module.exports = __toCommonJS(nipad_exports);
var AD_REGEX = /^(?:https?:\/\/)?((?:[\w-]+\.)+[\w-]+)(\/[^\s]*)?$/;
var isWebAddress = (value) => AD_REGEX.test(value || "");
var _fetch;
try {
  _fetch = fetch;
} catch (_) {
  null;
}
function useFetchImplementation(fetchImplementation) {
  _fetch = fetchImplementation;
}
async function queryWebAddress(url) {
  const match = url.match(AD_REGEX);
  if (!match)
    return null;
  const [, domain, path = "/"] = match;
  try {
    const res = await _fetch(`https://${domain}/.well-known/nostr.json?path=${path}`);
    if (res.status !== 200) {
      throw Error("Wrong response code");
    }
    const json = await res.json();
    return json[path] || null;
  } catch (_) {
    return null;
  }
}
