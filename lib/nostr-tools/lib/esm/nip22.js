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

// nip22.ts
function parseKind(kind) {
  if (!kind)
    return void 0;
  return /^\d+$/.test(kind) ? parseInt(kind, 10) : kind;
}
function parseAddressPointer(value, relayUrl) {
  const idx = value.indexOf(":");
  const idx2 = value.indexOf(":", idx + 1);
  if (idx === -1 || idx2 === -1)
    return void 0;
  const kind = parseInt(value.slice(0, idx), 10);
  if (Number.isNaN(kind))
    return void 0;
  const pubkey = value.slice(idx + 1, idx2);
  if (!isHex32(pubkey))
    return void 0;
  return {
    kind,
    pubkey,
    identifier: value.slice(idx2 + 1),
    relays: relayUrl ? [relayUrl] : []
  };
}
function parsePointer(tag) {
  switch (tag[0]) {
    case "E":
    case "e":
      if (!tag[1] || !isHex32(tag[1]))
        return void 0;
      return {
        id: tag[1],
        relays: tag[2] ? [tag[2]] : [],
        author: tag[3] && isHex32(tag[3]) ? tag[3] : void 0
      };
    case "A":
    case "a":
      if (!tag[1])
        return void 0;
      return parseAddressPointer(tag[1], tag[2]);
    case "I":
    case "i":
      if (!tag[1])
        return void 0;
      return {
        value: tag[1],
        hint: tag[2]
      };
  }
}
function parseQuote(tag) {
  if (!tag[1])
    return void 0;
  if (tag[1].includes(":")) {
    return parseAddressPointer(tag[1], tag[2]);
  }
  if (!isHex32(tag[1]))
    return void 0;
  return {
    id: tag[1],
    relays: tag[2] ? [tag[2]] : [],
    author: tag[3] && isHex32(tag[3]) ? tag[3] : void 0
  };
}
function choosePointer(candidates) {
  return candidates.findLast((candidate) => candidate.tagName === "A" || candidate.tagName === "a")?.pointer || candidates.findLast((candidate) => candidate.tagName === "I" || candidate.tagName === "i")?.pointer || candidates.findLast((candidate) => candidate.tagName === "E" || candidate.tagName === "e")?.pointer;
}
function inheritRelayHints(pointer, profiles) {
  if (!pointer || !("id" in pointer) || !pointer.author)
    return;
  const author = profiles.find((profile) => profile.pubkey === pointer.author);
  if (!author || !author.relays)
    return;
  if (!pointer.relays) {
    pointer.relays = [];
  }
  author.relays.forEach((url) => {
    if (pointer.relays.indexOf(url) === -1)
      pointer.relays.push(url);
  });
  author.relays = pointer.relays;
}
function parse(event) {
  const result = {
    root: void 0,
    rootKind: void 0,
    reply: void 0,
    replyKind: void 0,
    mentions: [],
    quotes: [],
    profiles: []
  };
  const rootCandidates = [];
  const replyCandidates = [];
  for (const tag of event.tags) {
    if ((tag[0] === "E" || tag[0] === "A" || tag[0] === "I") && tag[1]) {
      const pointer = parsePointer(tag);
      if (pointer)
        rootCandidates.push({ tagName: tag[0], pointer });
      continue;
    }
    if ((tag[0] === "e" || tag[0] === "a" || tag[0] === "i") && tag[1]) {
      const pointer = parsePointer(tag);
      if (pointer)
        replyCandidates.push({ tagName: tag[0], pointer });
      continue;
    }
    if (tag[0] === "K") {
      result.rootKind = parseKind(tag[1]);
      continue;
    }
    if (tag[0] === "k") {
      result.replyKind = parseKind(tag[1]);
      continue;
    }
    if (tag[0] === "q") {
      const pointer = parseQuote(tag);
      if (pointer)
        result.quotes.push(pointer);
      continue;
    }
    if ((tag[0] === "P" || tag[0] === "p") && tag[1] && isHex32(tag[1])) {
      result.profiles.push({
        pubkey: tag[1],
        relays: tag[2] ? [tag[2]] : []
      });
    }
  }
  result.root = choosePointer(rootCandidates);
  result.reply = choosePointer(replyCandidates);
  inheritRelayHints(result.root, result.profiles);
  inheritRelayHints(result.reply, result.profiles);
  result.quotes.forEach((pointer) => inheritRelayHints(pointer, result.profiles));
  return result;
}
export {
  parse
};
