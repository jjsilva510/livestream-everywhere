// nip11.ts
var _fetch;
try {
  _fetch = fetch;
} catch {
}
async function fetchRelayInformation(url) {
  return await (await fetch(url.replace("ws://", "http://").replace("wss://", "https://"), {
    headers: { Accept: "application/nostr+json" }
  })).json();
}

// nip19.ts
import { bytesToHex as bytesToHex2, concatBytes, hexToBytes as hexToBytes2 } from "@noble/hashes/utils.js";
import { bech32 } from "@scure/base";

// utils.ts
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
var utf8Decoder = new TextDecoder("utf-8");
var utf8Encoder = new TextEncoder();
function normalizeURL(url) {
  try {
    if (url.indexOf("://") === -1)
      url = "wss://" + url;
    let p = new URL(url);
    if (p.protocol === "http:")
      p.protocol = "ws:";
    else if (p.protocol === "https:")
      p.protocol = "wss:";
    p.pathname = p.pathname.replace(/\/+/g, "/");
    if (p.pathname.endsWith("/"))
      p.pathname = p.pathname.slice(0, -1);
    if (p.port === "80" && p.protocol === "ws:" || p.port === "443" && p.protocol === "wss:")
      p.port = "";
    p.searchParams.sort();
    p.hash = "";
    return p.toString();
  } catch (e) {
    throw new Error(`Invalid URL: ${url}`);
  }
}

// nip19.ts
var NostrTypeGuard = {
  isNProfile: (value) => /^nprofile1[a-z\d]+$/.test(value || ""),
  isNEvent: (value) => /^nevent1[a-z\d]+$/.test(value || ""),
  isNAddr: (value) => /^naddr1[a-z\d]+$/.test(value || ""),
  isNSec: (value) => /^nsec1[a-z\d]{58}$/.test(value || ""),
  isNPub: (value) => /^npub1[a-z\d]{58}$/.test(value || ""),
  isNote: (value) => /^note1[a-z\d]+$/.test(value || ""),
  isNcryptsec: (value) => /^ncryptsec1[a-z\d]+$/.test(value || "")
};
var Bech32MaxSize = 5e3;
function decode(code) {
  let { prefix, words } = bech32.decode(code, Bech32MaxSize);
  let data = new Uint8Array(bech32.fromWords(words));
  switch (prefix) {
    case "nprofile": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for nprofile");
      if (tlv[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      return {
        type: "nprofile",
        data: {
          pubkey: bytesToHex2(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : []
        }
      };
    }
    case "nevent": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for nevent");
      if (tlv[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      if (tlv[2] && tlv[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (tlv[3] && tlv[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "nevent",
        data: {
          id: bytesToHex2(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : [],
          author: tlv[2]?.[0] ? bytesToHex2(tlv[2][0]) : void 0,
          kind: tlv[3]?.[0] ? parseInt(bytesToHex2(tlv[3][0]), 16) : void 0
        }
      };
    }
    case "naddr": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for naddr");
      if (!tlv[2]?.[0])
        throw new Error("missing TLV 2 for naddr");
      if (tlv[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (!tlv[3]?.[0])
        throw new Error("missing TLV 3 for naddr");
      if (tlv[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "naddr",
        data: {
          identifier: utf8Decoder.decode(tlv[0][0]),
          pubkey: bytesToHex2(tlv[2][0]),
          kind: parseInt(bytesToHex2(tlv[3][0]), 16),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : []
        }
      };
    }
    case "nsec":
      return { type: prefix, data };
    case "npub":
    case "note":
      return { type: prefix, data: bytesToHex2(data) };
    default:
      throw new Error(`unknown prefix ${prefix}`);
  }
}
function parseTLV(data) {
  let result = {};
  let rest = data;
  while (rest.length > 0) {
    if (rest.length < 2)
      throw new Error("not enough data to read TLV");
    let t = rest[0];
    let l = rest[1];
    let v = rest.slice(2, 2 + l);
    rest = rest.slice(2 + l);
    if (v.length < l)
      throw new Error(`not enough data to read on TLV ${t}`);
    result[t] = result[t] || [];
    result[t].push(v);
  }
  return result;
}

// nip29.ts
var GroupAdminPermission = /* @__PURE__ */ ((GroupAdminPermission2) => {
  GroupAdminPermission2["AddUser"] = "add-user";
  GroupAdminPermission2["EditMetadata"] = "edit-metadata";
  GroupAdminPermission2["DeleteEvent"] = "delete-event";
  GroupAdminPermission2["RemoveUser"] = "remove-user";
  GroupAdminPermission2["AddPermission"] = "add-permission";
  GroupAdminPermission2["RemovePermission"] = "remove-permission";
  GroupAdminPermission2["EditGroupStatus"] = "edit-group-status";
  GroupAdminPermission2["PutUser"] = "put-user";
  GroupAdminPermission2["CreateGroup"] = "create-group";
  GroupAdminPermission2["DeleteGroup"] = "delete-group";
  GroupAdminPermission2["CreateInvite"] = "create-invite";
  GroupAdminPermission2["UpdatePinList"] = "update-pin-list";
  return GroupAdminPermission2;
})(GroupAdminPermission || {});
function buildGroupMetadataTags(metadata) {
  const tags = [];
  metadata.name && tags.push(["name", metadata.name]);
  metadata.picture && tags.push(["picture", metadata.picture]);
  metadata.banner && tags.push(["banner", metadata.banner]);
  metadata.about && tags.push(["about", metadata.about]);
  metadata.isPrivate && tags.push(["private"]);
  metadata.isRestricted && tags.push(["restricted"]);
  metadata.isHidden && tags.push(["hidden"]);
  metadata.isClosed && tags.push(["closed"]);
  metadata.hasLiveKit && tags.push(["livekit"]);
  metadata.supportedKinds && metadata.supportedKinds.length > 0 && tags.push(["supported_kinds", ...metadata.supportedKinds]);
  metadata.parent && tags.push(["parent", metadata.parent]);
  metadata.children && metadata.children.forEach((child) => {
    tags.push(["child", child]);
  });
  return tags;
}
function generateGroupMetadataEventTemplate(group) {
  return {
    content: "",
    created_at: Math.floor(Date.now() / 1e3),
    kind: 39e3,
    tags: [["d", group.metadata.id], ...buildGroupMetadataTags(group.metadata)]
  };
}
function validateGroupMetadataEvent(event) {
  if (event.kind !== 39e3)
    return false;
  if (!event.pubkey)
    return false;
  const requiredTags = ["d"];
  for (const tag of requiredTags) {
    if (!event.tags.find(([t]) => t == tag))
      return false;
  }
  return true;
}
function generateGroupAdminsEventTemplate(group, admins) {
  const tags = [["d", group.metadata.id]];
  for (const admin of admins) {
    tags.push(["p", admin.pubkey, admin.label || "", ...admin.permissions]);
  }
  return {
    content: "",
    created_at: Math.floor(Date.now() / 1e3),
    kind: 39001,
    tags
  };
}
function validateGroupAdminsEvent(event) {
  if (event.kind !== 39001)
    return false;
  const requiredTags = ["d"];
  for (const tag of requiredTags) {
    if (!event.tags.find(([t]) => t == tag))
      return false;
  }
  for (const [tag, _value, _label, ...permissions] of event.tags) {
    if (tag !== "p")
      continue;
    for (let i = 0; i < permissions.length; i += 1) {
      if (typeof permissions[i] !== "string")
        return false;
      if (!Object.values(GroupAdminPermission).includes(permissions[i]))
        return false;
    }
  }
  return true;
}
function generateGroupMembersEventTemplate(group, members) {
  const tags = [["d", group.metadata.id]];
  for (const member of members) {
    tags.push(["p", member.pubkey, member.label || ""]);
  }
  return {
    content: "",
    created_at: Math.floor(Date.now() / 1e3),
    kind: 39002,
    tags
  };
}
function validateGroupMembersEvent(event) {
  if (event.kind !== 39002)
    return false;
  const requiredTags = ["d"];
  for (const tag of requiredTags) {
    if (!event.tags.find(([t]) => t == tag))
      return false;
  }
  return true;
}
function getNormalizedRelayURLByGroupReference(groupReference) {
  return normalizeURL(groupReference.host);
}
async function fetchRelayInformationByGroupReference(groupReference) {
  const normalizedRelayURL = getNormalizedRelayURLByGroupReference(groupReference);
  return fetchRelayInformation(normalizedRelayURL);
}
async function fetchGroupMetadataEvent({
  pool,
  groupReference,
  relayInformation,
  normalizedRelayURL
}) {
  if (!normalizedRelayURL) {
    normalizedRelayURL = getNormalizedRelayURLByGroupReference(groupReference);
  }
  if (!relayInformation) {
    relayInformation = await fetchRelayInformation(normalizedRelayURL);
  }
  const groupMetadataEvent = await pool.get([normalizedRelayURL], {
    kinds: [39e3],
    authors: [relayInformation.pubkey],
    "#d": [groupReference.id]
  });
  if (!groupMetadataEvent)
    throw new Error(`group '${groupReference.id}' not found on ${normalizedRelayURL}`);
  return groupMetadataEvent;
}
function parseGroupMetadataEvent(event) {
  if (!validateGroupMetadataEvent(event))
    throw new Error("invalid group metadata event");
  const metadata = {
    id: "",
    pubkey: event.pubkey
  };
  for (const [tag, value] of event.tags) {
    switch (tag) {
      case "d":
        metadata.id = value;
        break;
      case "name":
        metadata.name = value;
        break;
      case "picture":
        metadata.picture = value;
        break;
      case "banner":
        metadata.banner = value;
        break;
      case "about":
        metadata.about = value;
        break;
      case "private":
        metadata.isPrivate = true;
        break;
      case "restricted":
        metadata.isRestricted = true;
        break;
      case "hidden":
        metadata.isHidden = true;
        break;
      case "closed":
        metadata.isClosed = true;
        break;
      case "livekit":
        metadata.hasLiveKit = true;
        break;
      case "parent":
        metadata.parent = value;
        break;
    }
  }
  const supportedKinds = event.tags.filter(([tag]) => tag === "supported_kinds").flatMap(([, ...values]) => values);
  if (supportedKinds.length > 0)
    metadata.supportedKinds = supportedKinds;
  const children = event.tags.filter(([tag]) => tag === "child").map(([, value]) => value);
  if (children.length > 0)
    metadata.children = children;
  return metadata;
}
async function fetchGroupAdminsEvent({
  pool,
  groupReference,
  relayInformation,
  normalizedRelayURL
}) {
  if (!normalizedRelayURL) {
    normalizedRelayURL = getNormalizedRelayURLByGroupReference(groupReference);
  }
  if (!relayInformation) {
    relayInformation = await fetchRelayInformation(normalizedRelayURL);
  }
  const groupAdminsEvent = await pool.get([normalizedRelayURL], {
    kinds: [39001],
    authors: [relayInformation.pubkey],
    "#d": [groupReference.id]
  });
  if (!groupAdminsEvent)
    throw new Error(`admins for group '${groupReference.id}' not found on ${normalizedRelayURL}`);
  return groupAdminsEvent;
}
function parseGroupAdminsEvent(event) {
  if (!validateGroupAdminsEvent(event))
    throw new Error("invalid group admins event");
  const admins = [];
  for (const [tag, value, label, ...permissions] of event.tags) {
    if (tag !== "p")
      continue;
    admins.push({
      pubkey: value,
      label,
      permissions
    });
  }
  return admins;
}
async function fetchGroupMembersEvent({
  pool,
  groupReference,
  relayInformation,
  normalizedRelayURL
}) {
  if (!normalizedRelayURL) {
    normalizedRelayURL = getNormalizedRelayURLByGroupReference(groupReference);
  }
  if (!relayInformation) {
    relayInformation = await fetchRelayInformation(normalizedRelayURL);
  }
  const groupMembersEvent = await pool.get([normalizedRelayURL], {
    kinds: [39002],
    authors: [relayInformation.pubkey],
    "#d": [groupReference.id]
  });
  if (!groupMembersEvent)
    throw new Error(`members for group '${groupReference.id}' not found on ${normalizedRelayURL}`);
  return groupMembersEvent;
}
async function fetchGroupRolesEvent({
  pool,
  groupReference,
  relayInformation,
  normalizedRelayURL
}) {
  if (!normalizedRelayURL) {
    normalizedRelayURL = getNormalizedRelayURLByGroupReference(groupReference);
  }
  if (!relayInformation) {
    relayInformation = await fetchRelayInformation(normalizedRelayURL);
  }
  const groupRolesEvent = await pool.get([normalizedRelayURL], {
    kinds: [39003],
    authors: [relayInformation.pubkey],
    "#d": [groupReference.id]
  });
  if (!groupRolesEvent)
    throw new Error(`roles for group '${groupReference.id}' not found on ${normalizedRelayURL}`);
  return groupRolesEvent;
}
async function fetchGroupLivekitParticipantsEvent({
  pool,
  groupReference,
  relayInformation,
  normalizedRelayURL
}) {
  if (!normalizedRelayURL) {
    normalizedRelayURL = getNormalizedRelayURLByGroupReference(groupReference);
  }
  if (!relayInformation) {
    relayInformation = await fetchRelayInformation(normalizedRelayURL);
  }
  const groupLivekitParticipantsEvent = await pool.get([normalizedRelayURL], {
    kinds: [39004],
    authors: [relayInformation.pubkey],
    "#d": [groupReference.id]
  });
  if (!groupLivekitParticipantsEvent)
    throw new Error(`livekit participants for group '${groupReference.id}' not found on ${normalizedRelayURL}`);
  return groupLivekitParticipantsEvent;
}
async function fetchGroupPinnedEventsEvent({
  pool,
  groupReference,
  relayInformation,
  normalizedRelayURL
}) {
  if (!normalizedRelayURL) {
    normalizedRelayURL = getNormalizedRelayURLByGroupReference(groupReference);
  }
  if (!relayInformation) {
    relayInformation = await fetchRelayInformation(normalizedRelayURL);
  }
  const groupPinnedEventsEvent = await pool.get([normalizedRelayURL], {
    kinds: [39005],
    authors: [relayInformation.pubkey],
    "#d": [groupReference.id]
  });
  if (!groupPinnedEventsEvent)
    throw new Error(`pinned events for group '${groupReference.id}' not found on ${normalizedRelayURL}`);
  return groupPinnedEventsEvent;
}
function parseGroupMembersEvent(event) {
  if (!validateGroupMembersEvent(event))
    throw new Error("invalid group members event");
  const members = [];
  for (const [tag, value, label] of event.tags) {
    if (tag !== "p")
      continue;
    members.push({
      pubkey: value,
      label
    });
  }
  return members;
}
function generateGroupRolesEventTemplate(group, roles) {
  const tags = [["d", group.metadata.id]];
  for (const role of roles) {
    const tag = ["role", role.name];
    role.description && tag.push(role.description);
    tags.push(tag);
  }
  return {
    content: "",
    created_at: Math.floor(Date.now() / 1e3),
    kind: 39003,
    tags
  };
}
function validateGroupRolesEvent(event) {
  if (event.kind !== 39003)
    return false;
  const requiredTags = ["d"];
  for (const tag of requiredTags) {
    if (!event.tags.find(([t]) => t == tag))
      return false;
  }
  return true;
}
function parseGroupRolesEvent(event) {
  if (!validateGroupRolesEvent(event))
    throw new Error("invalid group roles event");
  const roles = [];
  for (const [tag, name, description] of event.tags) {
    if (tag !== "role")
      continue;
    roles.push({ name, description });
  }
  return roles;
}
function generateGroupLivekitParticipantsEventTemplate(group, participants) {
  const tags = [["d", group.metadata.id]];
  participants.forEach((pubkey) => {
    tags.push(["participant", pubkey]);
  });
  return {
    content: "",
    created_at: Math.floor(Date.now() / 1e3),
    kind: 39004,
    tags
  };
}
function validateGroupLivekitParticipantsEvent(event) {
  if (event.kind !== 39004)
    return false;
  const requiredTags = ["d"];
  for (const tag of requiredTags) {
    if (!event.tags.find(([t]) => t == tag))
      return false;
  }
  return true;
}
function parseGroupLivekitParticipantsEvent(event) {
  if (!validateGroupLivekitParticipantsEvent(event))
    throw new Error("invalid group livekit participants event");
  return event.tags.filter(([tag]) => tag === "participant").map(([, pubkey]) => pubkey);
}
function generateGroupPinnedEventsEventTemplate(group, pinnedEvents) {
  const tags = [["d", group.metadata.id]];
  pinnedEvents.forEach((pinnedEvent) => {
    tags.push([pinnedEvent.type, pinnedEvent.value]);
  });
  return {
    content: "",
    created_at: Math.floor(Date.now() / 1e3),
    kind: 39005,
    tags
  };
}
function validateGroupPinnedEventsEvent(event) {
  if (event.kind !== 39005)
    return false;
  const requiredTags = ["d"];
  for (const tag of requiredTags) {
    if (!event.tags.find(([t]) => t == tag))
      return false;
  }
  return true;
}
function parseGroupPinnedEventsEvent(event) {
  if (!validateGroupPinnedEventsEvent(event))
    throw new Error("invalid group pinned events event");
  const pinnedEvents = [];
  for (const [tag, value] of event.tags) {
    if (tag !== "e" && tag !== "a")
      continue;
    pinnedEvents.push({ type: tag, value });
  }
  return pinnedEvents;
}
function generateGroupModerationEventTemplate(kind, groupId, content, tags, previous) {
  const allTags = [["h", groupId], ...tags];
  previous && previous.length > 0 && allTags.push(["previous", ...previous]);
  return {
    content,
    created_at: Math.floor(Date.now() / 1e3),
    kind,
    tags: allTags
  };
}
function generatePutUserEventTemplate(groupId, pubkey, roles, reason, previous) {
  return generateGroupModerationEventTemplate(9e3, groupId, reason || "", [["p", pubkey, ...roles || []]], previous);
}
function generateRemoveUserEventTemplate(groupId, pubkey, reason, previous) {
  return generateGroupModerationEventTemplate(9001, groupId, reason || "", [["p", pubkey]], previous);
}
function generateEditGroupMetadataEventTemplate(group, reason, previous) {
  return generateGroupModerationEventTemplate(
    9002,
    group.metadata.id,
    reason || "",
    buildGroupMetadataTags(group.metadata),
    previous
  );
}
function generateDeleteEventEventTemplate(groupId, eventId, reason, previous) {
  return generateGroupModerationEventTemplate(9005, groupId, reason || "", [["e", eventId]], previous);
}
function generateCreateGroupEventTemplate(groupId, reason, previous) {
  return generateGroupModerationEventTemplate(9007, groupId, reason || "", [], previous);
}
function generateDeleteGroupEventTemplate(groupId, reason, previous) {
  return generateGroupModerationEventTemplate(9008, groupId, reason || "", [], previous);
}
function generateCreateInviteEventTemplate(groupId, code, reason, previous) {
  return generateGroupModerationEventTemplate(9009, groupId, reason || "", [["code", code]], previous);
}
function generateUpdatePinListEventTemplate(groupId, pinnedEvents, reason, previous) {
  const tags = pinnedEvents.map((pinnedEvent) => [pinnedEvent.type, pinnedEvent.value]);
  return generateGroupModerationEventTemplate(9010, groupId, reason || "", tags, previous);
}
function generateGroupJoinRequestEventTemplate(groupId, inviteCode, reason, previous) {
  const tags = [["h", groupId]];
  inviteCode && tags.push(["code", inviteCode]);
  previous && previous.length > 0 && tags.push(["previous", ...previous]);
  return {
    content: reason || "",
    created_at: Math.floor(Date.now() / 1e3),
    kind: 9021,
    tags
  };
}
function generateGroupLeaveRequestEventTemplate(groupId, reason, previous) {
  const tags = [["h", groupId]];
  previous && previous.length > 0 && tags.push(["previous", ...previous]);
  return {
    content: reason || "",
    created_at: Math.floor(Date.now() / 1e3),
    kind: 9022,
    tags
  };
}
async function loadGroup({
  pool,
  groupReference,
  normalizedRelayURL,
  relayInformation
}) {
  if (!normalizedRelayURL) {
    normalizedRelayURL = getNormalizedRelayURLByGroupReference(groupReference);
  }
  if (!relayInformation) {
    relayInformation = await fetchRelayInformation(normalizedRelayURL);
  }
  const metadataEvent = await fetchGroupMetadataEvent({ pool, groupReference, normalizedRelayURL, relayInformation });
  const metadata = parseGroupMetadataEvent(metadataEvent);
  const adminsEvent = await fetchGroupAdminsEvent({ pool, groupReference, normalizedRelayURL, relayInformation });
  const admins = parseGroupAdminsEvent(adminsEvent);
  const membersEvent = await fetchGroupMembersEvent({ pool, groupReference, normalizedRelayURL, relayInformation });
  const members = parseGroupMembersEvent(membersEvent);
  const group = {
    relay: normalizedRelayURL,
    metadata,
    admins,
    members,
    reference: groupReference
  };
  return group;
}
async function loadGroupFromCode(pool, code) {
  const groupReference = parseGroupCode(code);
  if (!groupReference)
    throw new Error("invalid group code");
  return loadGroup({ pool, groupReference });
}
function parseGroupCode(code) {
  if (NostrTypeGuard.isNAddr(code)) {
    try {
      let { data } = decode(code);
      let { relays, identifier } = data;
      if (!relays || relays.length === 0)
        return null;
      let host = relays[0];
      if (host.startsWith("wss://")) {
        host = host.slice(6);
      }
      return { host, id: identifier };
    } catch (err) {
      return null;
    }
  } else if (code.split("'").length === 2) {
    let spl = code.split("'");
    return { host: spl[0], id: spl[1] };
  }
  return null;
}
function encodeGroupReference(gr) {
  const { host, id } = gr;
  const normalizedHost = host.replace(/^(https?:\/\/|wss?:\/\/)/, "");
  return `${normalizedHost}'${id}`;
}
function subscribeRelayGroupsMetadataEvents({
  pool,
  relayURL,
  onError,
  onEvent,
  onConnect
}) {
  let sub;
  const normalizedRelayURL = normalizeURL(relayURL);
  fetchRelayInformation(normalizedRelayURL).then(async (info) => {
    const abstractedRelay = await pool.ensureRelay(normalizedRelayURL);
    onConnect?.();
    sub = abstractedRelay.prepareSubscription(
      [
        {
          kinds: [39e3],
          limit: 50,
          authors: [info.pubkey]
        }
      ],
      {
        onevent(event) {
          onEvent(event);
        }
      }
    );
  }).catch((err) => {
    sub.close();
    onError(err);
  });
  return () => sub.close();
}
export {
  GroupAdminPermission,
  encodeGroupReference,
  fetchGroupAdminsEvent,
  fetchGroupLivekitParticipantsEvent,
  fetchGroupMembersEvent,
  fetchGroupMetadataEvent,
  fetchGroupPinnedEventsEvent,
  fetchGroupRolesEvent,
  fetchRelayInformationByGroupReference,
  generateCreateGroupEventTemplate,
  generateCreateInviteEventTemplate,
  generateDeleteEventEventTemplate,
  generateDeleteGroupEventTemplate,
  generateEditGroupMetadataEventTemplate,
  generateGroupAdminsEventTemplate,
  generateGroupJoinRequestEventTemplate,
  generateGroupLeaveRequestEventTemplate,
  generateGroupLivekitParticipantsEventTemplate,
  generateGroupMembersEventTemplate,
  generateGroupMetadataEventTemplate,
  generateGroupPinnedEventsEventTemplate,
  generateGroupRolesEventTemplate,
  generatePutUserEventTemplate,
  generateRemoveUserEventTemplate,
  generateUpdatePinListEventTemplate,
  getNormalizedRelayURLByGroupReference,
  loadGroup,
  loadGroupFromCode,
  parseGroupAdminsEvent,
  parseGroupCode,
  parseGroupLivekitParticipantsEvent,
  parseGroupMembersEvent,
  parseGroupMetadataEvent,
  parseGroupPinnedEventsEvent,
  parseGroupRolesEvent,
  subscribeRelayGroupsMetadataEvents,
  validateGroupAdminsEvent,
  validateGroupLivekitParticipantsEvent,
  validateGroupMembersEvent,
  validateGroupMetadataEvent,
  validateGroupPinnedEventsEvent,
  validateGroupRolesEvent
};
