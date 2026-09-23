var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// nipb7.ts
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex as bytesToHex2 } from "@noble/hashes/utils.js";

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

// kinds.ts
var kinds_exports = {};
__export(kinds_exports, {
  AIEmbeddings: () => AIEmbeddings,
  AppCurationSet: () => AppCurationSet,
  Application: () => Application,
  AuthoredPodcasts: () => AuthoredPodcasts,
  BadgeAward: () => BadgeAward,
  BadgeDefinition: () => BadgeDefinition,
  Bid: () => Bid,
  BidConfirmation: () => BidConfirmation,
  BlobsAuth: () => BlobsAuth,
  BlockedRelaysList: () => BlockedRelaysList,
  BlossomServerList: () => BlossomServerList,
  BookmarkList: () => BookmarkList,
  Bookmarksets: () => Bookmarksets,
  Calendar: () => Calendar,
  CalendarEventRSVP: () => CalendarEventRSVP,
  CashuMintAnnouncement: () => CashuMintAnnouncement,
  CashuWalletEvent: () => CashuWalletEvent,
  CashuWalletHistory: () => CashuWalletHistory,
  CashuWalletTokens: () => CashuWalletTokens,
  ChannelCreation: () => ChannelCreation,
  ChannelHideMessage: () => ChannelHideMessage,
  ChannelMessage: () => ChannelMessage,
  ChannelMetadata: () => ChannelMetadata,
  ChannelMuteUser: () => ChannelMuteUser,
  ChatMessage: () => ChatMessage,
  Chess: () => Chess,
  ClassifiedListing: () => ClassifiedListing,
  ClientAuth: () => ClientAuth,
  CodeSnippet: () => CodeSnippet,
  CoinjoinPool: () => CoinjoinPool,
  Comment: () => Comment,
  CommunitiesList: () => CommunitiesList,
  CommunityDefinition: () => CommunityDefinition,
  CommunityPostApproval: () => CommunityPostApproval,
  ConferenceEvent: () => ConferenceEvent,
  Contacts: () => Contacts,
  CreateOrUpdateProduct: () => CreateOrUpdateProduct,
  CreateOrUpdateStall: () => CreateOrUpdateStall,
  CuratedVideoSets: () => CuratedVideoSets,
  Curationsets: () => Curationsets,
  Date: () => Date2,
  DecoupledEncryptionKeyDistribution: () => DecoupledEncryptionKeyDistribution,
  DecoupledKeyAnnouncement: () => DecoupledKeyAnnouncement,
  DecoupledKeyClientAnnouncement: () => DecoupledKeyClientAnnouncement,
  DirectMessageRelaysList: () => DirectMessageRelaysList,
  DraftClassifiedListing: () => DraftClassifiedListing,
  DraftEvent: () => DraftEvent,
  DraftLong: () => DraftLong,
  Emojisets: () => Emojisets,
  EncryptedDirectMessage: () => EncryptedDirectMessage,
  EventDeletion: () => EventDeletion,
  FavoriteFollowSets: () => FavoriteFollowSets,
  FavoritePodcasts: () => FavoritePodcasts,
  FavoriteRelays: () => FavoriteRelays,
  FedimintAnnouncement: () => FedimintAnnouncement,
  Feed: () => Feed,
  FileMessage: () => FileMessage,
  FileMetadata: () => FileMetadata,
  FileServerPreference: () => FileServerPreference,
  Followsets: () => Followsets,
  ForumThread: () => ForumThread,
  GenericRepost: () => GenericRepost,
  Genericlists: () => Genericlists,
  GeocacheListing: () => GeocacheListing,
  GeocacheLog: () => GeocacheLog,
  GeocacheLogEntry: () => GeocacheLogEntry,
  GeocacheProofOfFind: () => GeocacheProofOfFind,
  GiftWrap: () => GiftWrap,
  GitPullRequest: () => GitPullRequest,
  GitPullRequestUpdate: () => GitPullRequestUpdate,
  GoodWikiAuthorList: () => GoodWikiAuthorList,
  GoodWikiRelayList: () => GoodWikiRelayList,
  GroupMetadata: () => GroupMetadata,
  HTTPAuth: () => HTTPAuth,
  Handlerinformation: () => Handlerinformation,
  Handlerrecommendation: () => Handlerrecommendation,
  Highlights: () => Highlights,
  InteractiveRoom: () => InteractiveRoom,
  InterestsList: () => InterestsList,
  Interestsets: () => Interestsets,
  Issue: () => Issue,
  JobFeedback: () => JobFeedback,
  JobRequest: () => JobRequest,
  JobResult: () => JobResult,
  Label: () => Label,
  LegacyNsiteFile: () => LegacyNsiteFile,
  LightningPubRPC: () => LightningPubRPC,
  LinkSet: () => LinkSet,
  LiveChatMessage: () => LiveChatMessage,
  LiveEvent: () => LiveEvent,
  LongFormArticle: () => LongFormArticle,
  MarketplaceUI: () => MarketplaceUI,
  MediaFollows: () => MediaFollows,
  MediaStarterPacks: () => MediaStarterPacks,
  MergeRequests: () => MergeRequests,
  Metadata: () => Metadata,
  ModularArticleContent: () => ModularArticleContent,
  ModularArticleHeader: () => ModularArticleHeader,
  MuteSets: () => MuteSets,
  Mutelist: () => Mutelist,
  NWCWalletInfo: () => NWCWalletInfo,
  NWCWalletRequest: () => NWCWalletRequest,
  NWCWalletResponse: () => NWCWalletResponse,
  NormalVideo: () => NormalVideo,
  NostrConnect: () => NostrConnect,
  NsiteNamed: () => NsiteNamed,
  NsiteRoot: () => NsiteRoot,
  NutZap: () => NutZap,
  NutZapInfo: () => NutZapInfo,
  OpenTimestamps: () => OpenTimestamps,
  Patch: () => Patch,
  PeerToPeerOrderEvents: () => PeerToPeerOrderEvents,
  Photo: () => Photo,
  Pinlist: () => Pinlist,
  PodcastEpisode: () => PodcastEpisode,
  PodcastMetadata: () => PodcastMetadata,
  Poll: () => Poll,
  PollResponse: () => PollResponse,
  PrivateDirectMessage: () => PrivateDirectMessage,
  PrivateEventRelayList: () => PrivateEventRelayList,
  ProblemTracker: () => ProblemTracker,
  ProductSoldAsAuction: () => ProductSoldAsAuction,
  ProfileBadges: () => ProfileBadges,
  ProxyAnnouncement: () => ProxyAnnouncement,
  PublicChatsList: () => PublicChatsList,
  PublicMessage: () => PublicMessage,
  Reaction: () => Reaction,
  ReactionToWebsite: () => ReactionToWebsite,
  RecommendRelay: () => RecommendRelay,
  Redirects: () => Redirects,
  RelayDiscovery: () => RelayDiscovery,
  RelayList: () => RelayList,
  RelayMonitorAnnouncement: () => RelayMonitorAnnouncement,
  RelayReview: () => RelayReview,
  RelayReviews: () => RelayReviews,
  Relaysets: () => Relaysets,
  ReleaseArtifactSets: () => ReleaseArtifactSets,
  Reply: () => Reply,
  Report: () => Report,
  Reporting: () => Reporting,
  RepositoryAnnouncement: () => RepositoryAnnouncement,
  RepositoryState: () => RepositoryState,
  Repost: () => Repost,
  ReservedCashuWalletTokens: () => ReservedCashuWalletTokens,
  RoomPresence: () => RoomPresence,
  Scroll: () => Scroll,
  Seal: () => Seal,
  SearchRelaysList: () => SearchRelaysList,
  ShortTextNote: () => ShortTextNote,
  ShortVideo: () => ShortVideo,
  SimpleGroupAdmins: () => SimpleGroupAdmins,
  SimpleGroupCreateGroup: () => SimpleGroupCreateGroup,
  SimpleGroupCreateInvite: () => SimpleGroupCreateInvite,
  SimpleGroupDeleteEvent: () => SimpleGroupDeleteEvent,
  SimpleGroupDeleteGroup: () => SimpleGroupDeleteGroup,
  SimpleGroupEditMetadata: () => SimpleGroupEditMetadata,
  SimpleGroupJoinRequest: () => SimpleGroupJoinRequest,
  SimpleGroupLeaveRequest: () => SimpleGroupLeaveRequest,
  SimpleGroupList: () => SimpleGroupList,
  SimpleGroupLiveKitParticipants: () => SimpleGroupLiveKitParticipants,
  SimpleGroupMembers: () => SimpleGroupMembers,
  SimpleGroupPutUser: () => SimpleGroupPutUser,
  SimpleGroupRemoveUser: () => SimpleGroupRemoveUser,
  SimpleGroupReply: () => SimpleGroupReply,
  SimpleGroupRoles: () => SimpleGroupRoles,
  SimpleGroupThreadedReply: () => SimpleGroupThreadedReply,
  SlideSet: () => SlideSet,
  SoftwareApplication: () => SoftwareApplication,
  StarterPacks: () => StarterPacks,
  StatusApplied: () => StatusApplied,
  StatusClosed: () => StatusClosed,
  StatusDraft: () => StatusDraft,
  StatusOpen: () => StatusOpen,
  TidalLogin: () => TidalLogin,
  Time: () => Time,
  Torrent: () => Torrent,
  TorrentComment: () => TorrentComment,
  TransportMethodAnnouncement: () => TransportMethodAnnouncement,
  UserEmojiList: () => UserEmojiList,
  UserGraspList: () => UserGraspList,
  UserStatuses: () => UserStatuses,
  VideoViewEvent: () => VideoViewEvent,
  Voice: () => Voice,
  VoiceComment: () => VoiceComment,
  WebBookmarks: () => WebBookmarks,
  WikiArticle: () => WikiArticle,
  Zap: () => Zap,
  ZapGoal: () => ZapGoal,
  ZapRequest: () => ZapRequest,
  classifyKind: () => classifyKind,
  isAddressableKind: () => isAddressableKind,
  isEphemeralKind: () => isEphemeralKind,
  isKind: () => isKind,
  isRegularKind: () => isRegularKind,
  isReplaceableKind: () => isReplaceableKind
});
function isRegularKind(kind) {
  return kind < 1e4 && kind !== 0 && kind !== 3;
}
function isReplaceableKind(kind) {
  return kind === 0 || kind === 3 || 1e4 <= kind && kind < 2e4;
}
function isEphemeralKind(kind) {
  return 2e4 <= kind && kind < 3e4;
}
function isAddressableKind(kind) {
  return 3e4 <= kind && kind < 4e4;
}
function classifyKind(kind) {
  if (isRegularKind(kind))
    return "regular";
  if (isReplaceableKind(kind))
    return "replaceable";
  if (isEphemeralKind(kind))
    return "ephemeral";
  if (isAddressableKind(kind))
    return "parameterized";
  return "unknown";
}
function isKind(event, kind) {
  const kindAsArray = kind instanceof Array ? kind : [kind];
  return validateEvent(event) && kindAsArray.includes(event.kind) || false;
}
var Metadata = 0;
var ShortTextNote = 1;
var RecommendRelay = 2;
var Contacts = 3;
var EncryptedDirectMessage = 4;
var EventDeletion = 5;
var Repost = 6;
var Reaction = 7;
var BadgeAward = 8;
var ChatMessage = 9;
var SimpleGroupThreadedReply = 10;
var ForumThread = 11;
var SimpleGroupReply = 12;
var Seal = 13;
var PrivateDirectMessage = 14;
var FileMessage = 15;
var GenericRepost = 16;
var ReactionToWebsite = 17;
var Photo = 20;
var NormalVideo = 21;
var ShortVideo = 22;
var PublicMessage = 24;
var ChannelCreation = 40;
var ChannelMetadata = 41;
var ChannelMessage = 42;
var ChannelHideMessage = 43;
var ChannelMuteUser = 44;
var PodcastEpisode = 54;
var Chess = 64;
var MergeRequests = 818;
var PollResponse = 1018;
var Bid = 1021;
var BidConfirmation = 1022;
var OpenTimestamps = 1040;
var GiftWrap = 1059;
var FileMetadata = 1063;
var Poll = 1068;
var Comment = 1111;
var Voice = 1222;
var Scroll = 1227;
var VoiceComment = 1244;
var LiveChatMessage = 1311;
var CodeSnippet = 1337;
var Patch = 1617;
var GitPullRequest = 1618;
var GitPullRequestUpdate = 1619;
var Issue = 1621;
var Reply = 1622;
var StatusOpen = 1630;
var StatusApplied = 1631;
var StatusClosed = 1632;
var StatusDraft = 1633;
var ProblemTracker = 1971;
var Report = 1984;
var Reporting = 1984;
var Label = 1985;
var RelayReviews = 1986;
var AIEmbeddings = 1987;
var Torrent = 2003;
var TorrentComment = 2004;
var CoinjoinPool = 2022;
var DecoupledKeyClientAnnouncement = 4454;
var DecoupledEncryptionKeyDistribution = 4455;
var CommunityPostApproval = 4550;
var JobRequest = 5999;
var JobResult = 6999;
var JobFeedback = 7e3;
var ReservedCashuWalletTokens = 7374;
var CashuWalletTokens = 7375;
var CashuWalletHistory = 7376;
var GeocacheLog = 7516;
var GeocacheProofOfFind = 7517;
var SimpleGroupPutUser = 9e3;
var SimpleGroupRemoveUser = 9001;
var SimpleGroupEditMetadata = 9002;
var SimpleGroupDeleteEvent = 9005;
var SimpleGroupCreateGroup = 9007;
var SimpleGroupDeleteGroup = 9008;
var SimpleGroupCreateInvite = 9009;
var SimpleGroupJoinRequest = 9021;
var SimpleGroupLeaveRequest = 9022;
var ZapGoal = 9041;
var NutZap = 9321;
var TidalLogin = 9467;
var ZapRequest = 9734;
var Zap = 9735;
var Highlights = 9802;
var Mutelist = 1e4;
var Pinlist = 10001;
var RelayList = 10002;
var BookmarkList = 10003;
var CommunitiesList = 10004;
var PublicChatsList = 10005;
var BlockedRelaysList = 10006;
var SearchRelaysList = 10007;
var SimpleGroupList = 10009;
var FavoriteRelays = 10012;
var PrivateEventRelayList = 10013;
var InterestsList = 10015;
var NutZapInfo = 10019;
var MediaFollows = 10020;
var FavoriteFollowSets = 10021;
var UserEmojiList = 10030;
var DecoupledKeyAnnouncement = 10044;
var DirectMessageRelaysList = 10050;
var FavoritePodcasts = 10054;
var BlossomServerList = 10063;
var FileServerPreference = 10096;
var GoodWikiAuthorList = 10101;
var GoodWikiRelayList = 10102;
var PodcastMetadata = 10154;
var AuthoredPodcasts = 10164;
var RelayMonitorAnnouncement = 10166;
var RoomPresence = 10312;
var UserGraspList = 10317;
var ProxyAnnouncement = 10377;
var TransportMethodAnnouncement = 11111;
var NWCWalletInfo = 13194;
var NsiteRoot = 15128;
var CashuWalletEvent = 17375;
var LightningPubRPC = 21e3;
var ClientAuth = 22242;
var NWCWalletRequest = 23194;
var NWCWalletResponse = 23195;
var NostrConnect = 24133;
var BlobsAuth = 24242;
var HTTPAuth = 27235;
var Followsets = 3e4;
var Genericlists = 30001;
var Relaysets = 30002;
var Bookmarksets = 30003;
var Curationsets = 30004;
var CuratedVideoSets = 30005;
var MuteSets = 30007;
var ProfileBadges = 30008;
var BadgeDefinition = 30009;
var Interestsets = 30015;
var CreateOrUpdateStall = 30017;
var CreateOrUpdateProduct = 30018;
var MarketplaceUI = 30019;
var ProductSoldAsAuction = 30020;
var LongFormArticle = 30023;
var DraftLong = 30024;
var Emojisets = 30030;
var ModularArticleHeader = 30040;
var ModularArticleContent = 30041;
var ReleaseArtifactSets = 30063;
var Application = 30078;
var RelayDiscovery = 30166;
var AppCurationSet = 30267;
var LiveEvent = 30311;
var InteractiveRoom = 30312;
var ConferenceEvent = 30313;
var UserStatuses = 30315;
var SlideSet = 30388;
var ClassifiedListing = 30402;
var DraftClassifiedListing = 30403;
var RepositoryAnnouncement = 30617;
var RepositoryState = 30618;
var WikiArticle = 30818;
var Redirects = 30819;
var DraftEvent = 31234;
var LinkSet = 31388;
var Feed = 31890;
var Date2 = 31922;
var Time = 31923;
var Calendar = 31924;
var CalendarEventRSVP = 31925;
var RelayReview = 31987;
var Handlerrecommendation = 31989;
var Handlerinformation = 31990;
var SoftwareApplication = 32267;
var LegacyNsiteFile = 34128;
var VideoViewEvent = 34237;
var CommunityDefinition = 34550;
var NsiteNamed = 35128;
var GeocacheListing = 37515;
var GeocacheLogEntry = 37516;
var CashuMintAnnouncement = 38172;
var FedimintAnnouncement = 38173;
var PeerToPeerOrderEvents = 38383;
var GroupMetadata = 39e3;
var SimpleGroupAdmins = 39001;
var SimpleGroupMembers = 39002;
var SimpleGroupRoles = 39003;
var SimpleGroupLiveKitParticipants = 39004;
var StarterPacks = 39089;
var MediaStarterPacks = 39092;
var WebBookmarks = 39701;

// nipb7.ts
function getBlobSize(blob) {
  if (typeof File !== "undefined" && blob instanceof File || blob instanceof Blob) {
    return blob.size;
  }
  return blob.length;
}
function getBlobType(blob) {
  if (typeof File !== "undefined" && blob instanceof File || blob instanceof Blob) {
    return blob.type || void 0;
  }
  return void 0;
}
async function computeBlobSha256(blob) {
  let buffer;
  if (typeof File !== "undefined" && blob instanceof File || blob instanceof Blob) {
    buffer = await blob.arrayBuffer();
  } else {
    buffer = blob;
  }
  const hash = sha256.create().update(new Uint8Array(buffer)).digest();
  return bytesToHex2(hash);
}
function encodeAuthorizationHeader(event) {
  const json = JSON.stringify(event);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes)
    binary += String.fromCharCode(byte);
  return "Nostr " + btoa(binary);
}
function now() {
  return Math.floor(Date.now() / 1e3);
}
function oneHour() {
  return now() + 3600;
}
function getAuthTagValues(auth, tagName) {
  return auth.tags.filter((tag) => tag[0] === tagName).map((tag) => tag[1]);
}
function getAuthExpiration(auth) {
  const expiration = auth.tags.find((tag) => tag[0] === "expiration")?.[1];
  if (!expiration)
    return void 0;
  const timestamp = Number(expiration);
  if (!Number.isFinite(timestamp))
    return void 0;
  return timestamp;
}
function isAuthExpired(auth, timestamp = now()) {
  const expiration = getAuthExpiration(auth);
  return expiration !== void 0 && expiration <= timestamp;
}
function normalizeServerTag(server) {
  if (server instanceof URL)
    return server.hostname.toLowerCase();
  if (URL.canParse(server))
    return new URL(server).hostname.toLowerCase();
  return server.toLowerCase();
}
function areServersEqual(a, b) {
  return normalizeServerTag(a) === normalizeServerTag(b);
}
function normalizeServers(servers) {
  const values = Array.isArray(servers) ? servers : [servers];
  return [...new Set(values.map(normalizeServerTag))];
}
async function createAuthEvent(signer, type, options) {
  const draft = {
    created_at: now(),
    kind: kinds_exports.BlobsAuth,
    content: options?.message ?? "",
    tags: [
      ["t", type],
      ["expiration", String(options?.expiration ?? oneHour())]
    ]
  };
  if (options?.blobs) {
    const blobList = Array.isArray(options.blobs) ? options.blobs : [options.blobs];
    const seen = /* @__PURE__ */ new Set();
    for (const blob of blobList) {
      const hash = typeof blob === "string" ? blob : await computeBlobSha256(blob);
      if (!seen.has(hash)) {
        draft.tags.push(["x", hash]);
        seen.add(hash);
      }
    }
  }
  if (options?.servers) {
    for (const server of normalizeServers(options.servers)) {
      draft.tags.push(["server", server]);
    }
  }
  return signer(draft);
}
async function createUploadAuth(signer, blobs, options) {
  return createAuthEvent(signer, options?.type ?? "upload", { message: "Upload Blob", ...options, blobs });
}
async function createDownloadAuth(signer, hash, options) {
  return createAuthEvent(signer, "get", { message: "Download Blob", ...options, blobs: [hash] });
}
async function createMirrorAuth(signer, hash, options) {
  return createAuthEvent(signer, "upload", { message: "Mirror Blob", ...options, blobs: [hash] });
}
async function createListAuth(signer, options) {
  return createAuthEvent(signer, "list", { message: "List Blobs", ...options });
}
async function createDeleteAuth(signer, hash, options) {
  return createAuthEvent(signer, "delete", { message: "Delete Blob", ...options, blobs: [hash] });
}
function parseBlossomURI(uri) {
  if (!uri.startsWith("blossom:"))
    throw new Error("Invalid blossom URI: missing blossom: scheme");
  const body = uri.slice("blossom:".length);
  const queryIndex = body.indexOf("?");
  const path = queryIndex === -1 ? body : body.slice(0, queryIndex);
  const query = queryIndex === -1 ? "" : body.slice(queryIndex + 1);
  const dotIndex = path.indexOf(".");
  if (dotIndex === -1)
    throw new Error("Invalid blossom URI: missing file extension");
  const sha2562 = path.slice(0, dotIndex);
  const ext = path.slice(dotIndex + 1);
  if (!isHex32(sha2562))
    throw new Error("Invalid blossom URI: invalid sha256 hash");
  if (!ext)
    throw new Error("Invalid blossom URI: empty file extension");
  const params = new URLSearchParams(query);
  const servers = params.getAll("xs");
  const authors = params.getAll("as");
  const szValue = params.get("sz");
  let size;
  if (szValue !== null) {
    size = Number(szValue);
    if (!Number.isFinite(size) || size <= 0 || Math.floor(size) !== size) {
      throw new Error("Invalid blossom URI: sz must be a positive integer");
    }
  }
  return { sha256: sha2562, ext, servers, authors, size };
}
function buildBlossomURI(options) {
  const params = new URLSearchParams();
  for (const server of options.servers)
    params.append("xs", server);
  for (const author of options.authors)
    params.append("as", author);
  if (options.size !== void 0)
    params.append("sz", String(options.size));
  const query = params.toString();
  return `blossom:${options.sha256}.${options.ext}${query ? "?" + query : ""}`;
}
function blossomURIToURL(uri) {
  const str = typeof uri === "string" ? uri : buildBlossomURI(uri);
  return new URL(str);
}
function blossomURIFromURL(url) {
  if (url.protocol !== "blossom:")
    throw new Error("Invalid blossom URL: expected blossom: protocol");
  const path = url.pathname;
  const dotIndex = path.indexOf(".");
  if (dotIndex === -1)
    throw new Error("Invalid blossom URL: missing file extension");
  const sha2562 = path.slice(0, dotIndex);
  const ext = path.slice(dotIndex + 1);
  if (!isHex32(sha2562))
    throw new Error("Invalid blossom URL: invalid sha256 hash");
  if (!ext)
    throw new Error("Invalid blossom URL: empty file extension");
  const servers = url.searchParams.getAll("xs");
  const authors = url.searchParams.getAll("as");
  const szValue = url.searchParams.get("sz");
  let size;
  if (szValue !== null) {
    size = Number(szValue);
    if (!Number.isFinite(size) || size <= 0 || Math.floor(size) !== size) {
      throw new Error("Invalid blossom URL: sz must be a positive integer");
    }
  }
  return { sha256: sha2562, ext, servers, authors, size };
}
var commonMimeExtensions = {
  "application/json": ".json",
  "application/pdf": ".pdf",
  "application/vnd.android.package-archive": ".apk",
  "application/vnd.sqlite3": ".sqlite3",
  "application/xml": ".xml",
  "audio/aac": ".aac",
  "audio/flac": ".flac",
  "audio/midi": ".midi",
  "audio/mp3": ".mp3",
  "audio/mpeg": ".mp3",
  "audio/mp4": ".m4a",
  "audio/ogg": ".ogg",
  "audio/wav": ".wav",
  "audio/webm": ".weba",
  "audio/x-aiff": ".aiff",
  "audio/x-m4a": ".m4a",
  "image/avif": ".avif",
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/svg+xml": ".svg",
  "image/webp": ".webp",
  "text/css": ".css",
  "text/csv": ".csv",
  "text/html": ".html",
  "text/javascript": ".js",
  "text/markdown": ".md",
  "text/plain": ".txt",
  "text/xml": ".xml",
  "video/mp2t": ".ts",
  "video/mp4": ".mp4",
  "video/ogg": ".ogv",
  "video/quicktime": ".mov",
  "video/webm": ".webm",
  "video/x-matroska": ".mkv"
};
var commonExtensionMimes = {
  ".aac": "audio/aac",
  ".aiff": "audio/x-aiff",
  ".apk": "application/vnd.android.package-archive",
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".flac": "audio/flac",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".m4a": "audio/mp4",
  ".md": "text/markdown; charset=utf-8",
  ".midi": "audio/midi",
  ".mkv": "video/x-matroska",
  ".mov": "video/quicktime",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".oga": "audio/ogg",
  ".ogg": "audio/ogg",
  ".ogv": "video/ogg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".sqlite3": "application/vnd.sqlite3",
  ".svg": "image/svg+xml",
  ".ts": "video/mp2t",
  ".txt": "text/plain; charset=utf-8",
  ".wav": "audio/wav",
  ".weba": "audio/webm",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".xml": "application/xml"
};
function normalizeMIMEType(mimetype) {
  const idx = mimetype.indexOf(";");
  return idx >= 0 ? mimetype.slice(0, idx).trim().toLowerCase() : mimetype.trim().toLowerCase();
}
function getExtension(mimetype) {
  const normalized = normalizeMIMEType(mimetype);
  if (!normalized)
    return "";
  return commonMimeExtensions[normalized] ?? "";
}
function getMIMEType(ext) {
  if (!ext)
    return "";
  ext = ext.trim().toLowerCase();
  if (ext[0] !== ".")
    ext = "." + ext;
  return commonExtensionMimes[ext] ?? "";
}
function getServersFromServerListEvent(event) {
  const servers = [];
  for (const tag of event.tags) {
    if (tag[0] === "server" && tag[1]) {
      try {
        const url = new URL(tag[1]);
        url.pathname = "/";
        servers.push(url);
      } catch {
      }
    }
  }
  return servers;
}
function getHashFromURL(url) {
  const path = typeof url === "string" ? url.split("#", 1)[0].split("?", 1)[0] : url.pathname;
  const lastSlash = path.lastIndexOf("/");
  let segment = lastSlash === -1 ? path : path.slice(lastSlash + 1);
  const dotIndex = segment.indexOf(".");
  if (dotIndex !== -1 && dotIndex !== 64)
    return null;
  for (let i = 0; i < 64; i++) {
    const c = segment.charCodeAt(i);
    const isDigit = c >= 48 && c <= 57;
    const isLowerHex = c >= 97 && c <= 102;
    if (!isDigit && !isLowerHex)
      return null;
  }
  return segment.slice(0, 64);
}
async function uploadBlob(server, blob, opts) {
  const url = new URL("/upload", server).toString();
  const sha2562 = await computeBlobSha256(blob);
  const headers = {
    "X-SHA-256": sha2562,
    "Content-Type": getBlobType(blob) || "application/octet-stream"
  };
  if (opts?.auth) {
    const authEvent = typeof opts.auth === "boolean" ? await opts.onAuth?.(server, sha2562) : opts.auth;
    if (authEvent)
      headers["Authorization"] = encodeAuthorizationHeader(authEvent);
  }
  const res = await fetch(url, {
    method: "PUT",
    body: blob,
    headers,
    signal: opts?.signal
  });
  if (res.status >= 300) {
    const reason = res.headers.get("X-Reason") || res.statusText;
    throw new Error(`upload returned error (${res.status}): ${reason}`);
  }
  return res.json();
}
async function downloadBlob(server, hash, opts) {
  const url = new URL("/" + hash, server).toString();
  const headers = {};
  if (opts?.auth) {
    const authEvent = typeof opts.auth === "boolean" ? await opts.onAuth?.(server, hash) : opts.auth;
    if (authEvent)
      headers["Authorization"] = encodeAuthorizationHeader(authEvent);
  }
  const res = await fetch(url, { headers, signal: opts?.signal });
  if (res.status >= 300) {
    const reason = res.headers.get("X-Reason") || res.statusText;
    throw new Error(`${hash} download error (${res.status}): ${reason}`);
  }
  return res;
}
async function listBlobs(server, pubkey, opts) {
  const url = new URL("/list/" + pubkey, server);
  if (opts?.cursor)
    url.searchParams.append("cursor", opts.cursor);
  if (opts?.limit)
    url.searchParams.append("limit", String(opts.limit));
  if (opts?.since)
    url.searchParams.append("since", String(opts.since));
  if (opts?.until)
    url.searchParams.append("until", String(opts.until));
  const headers = {};
  if (opts?.auth) {
    const authEvent = typeof opts.auth === "boolean" ? await opts.onAuth?.(server) : opts.auth;
    if (authEvent)
      headers["Authorization"] = encodeAuthorizationHeader(authEvent);
  }
  const res = await fetch(url.toString(), { headers, signal: opts?.signal });
  if (res.status >= 300) {
    const reason = res.headers.get("X-Reason") || res.statusText;
    throw new Error(`list error (${res.status}): ${reason}`);
  }
  return res.json();
}
async function* iterateBlobs(server, pubkey, opts) {
  let cursor = opts?.cursor;
  while (true) {
    const page = await listBlobs(server, pubkey, { ...opts, cursor });
    if (page.length === 0)
      return;
    yield page;
    if (opts?.limit && page.length < opts.limit)
      return;
    cursor = page[page.length - 1]?.sha256;
    if (!cursor)
      return;
  }
}
async function deleteBlob(server, hash, opts) {
  const url = new URL("/" + hash, server).toString();
  const headers = {};
  if (opts?.auth) {
    const authEvent = typeof opts.auth === "boolean" ? await opts.onAuth?.(server, hash) : opts.auth;
    if (authEvent)
      headers["Authorization"] = encodeAuthorizationHeader(authEvent);
  }
  const res = await fetch(url, { method: "DELETE", headers, signal: opts?.signal });
  if (res.status >= 300) {
    const reason = res.headers.get("X-Reason") || res.statusText;
    throw new Error(`delete error (${res.status}): ${reason}`);
  }
  return res.ok;
}
async function hasBlob(server, hash, opts) {
  const url = new URL("/" + hash, server);
  try {
    const res = await fetch(url.toString(), { method: "HEAD", signal: opts?.signal });
    return res.status !== 404;
  } catch {
    return false;
  }
}
async function mirrorBlob(server, blob, opts) {
  const url = new URL("/mirror", server).toString();
  const headers = {
    "Content-Type": "application/json",
    "X-SHA-256": blob.sha256
  };
  if (opts?.auth) {
    const authEvent = typeof opts.auth === "boolean" ? await opts.onAuth?.(server, blob.sha256) : opts.auth;
    if (authEvent)
      headers["Authorization"] = encodeAuthorizationHeader(authEvent);
  }
  const res = await fetch(url, {
    method: "PUT",
    body: JSON.stringify({ url: blob.url }),
    headers,
    signal: opts?.signal
  });
  if (res.status >= 300) {
    const reason = res.headers.get("X-Reason") || res.statusText;
    throw new Error(`mirror error (${res.status}): ${reason}`);
  }
  return res.json();
}
async function reportBlobs(servers, report, opts) {
  if (report.kind !== 1984 || !report.tags.some((tag) => tag[0] === "x" && !!tag[1])) {
    throw new Error("Invalid blob report event: must be kind 1984 with x tag");
  }
  const results = /* @__PURE__ */ new Map();
  const body = JSON.stringify(report);
  for (const server of servers) {
    try {
      const res = await fetch(new URL("/report", server).toString(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body,
        signal: opts?.signal
      });
      if (res.status >= 300) {
        const reason = res.headers.get("X-Reason") || res.statusText;
        throw new Error(`report error (${res.status}): ${reason}`);
      }
      results.set(server, true);
    } catch (error) {
      if (opts?.onError && error instanceof Error)
        opts.onError(server, error);
    }
  }
  return results;
}
var BlossomClient = class {
  constructor(mediaserver, signer) {
    this.signer = signer;
    if (!mediaserver.startsWith("http")) {
      mediaserver = "https://" + mediaserver;
    }
    this.mediaserver = mediaserver.replace(/\/$/, "") + "/";
  }
  mediaserver;
  getMediaServer() {
    return this.mediaserver;
  }
  async authorizationHeader(modify) {
    const event = {
      created_at: now(),
      kind: kinds_exports.BlobsAuth,
      content: "blossom stuff",
      tags: [["expiration", String(now() + 60)]]
    };
    modify?.(event);
    try {
      const signedEvent = await this.signer.signEvent(event);
      const json = JSON.stringify(signedEvent);
      return "Nostr " + btoa(json);
    } catch {
      return "";
    }
  }
  async httpCall(method, url, contentType, addAuthorization, body) {
    const headers = {};
    if (contentType)
      headers["Content-Type"] = contentType;
    if (addAuthorization) {
      const auth = await addAuthorization();
      if (auth)
        headers["Authorization"] = auth;
    }
    const res = await fetch(this.mediaserver + url, { method, headers, body });
    if (res.status >= 300) {
      const reason = res.headers.get("X-Reason") || res.statusText;
      throw new Error(`${url} returned error (${res.status}): ${reason}`);
    }
    if (res.headers.get("content-type")?.includes("application/json")) {
      return res.json();
    }
    return res;
  }
  async uploadBlob(file, contentType) {
    const hash = bytesToHex2(sha256(new Uint8Array(await file.arrayBuffer())));
    const actualContentType = contentType || getBlobType(file) || "application/octet-stream";
    return this.httpCall(
      "PUT",
      "upload",
      actualContentType,
      () => this.authorizationHeader((evt) => {
        evt.tags.push(["t", "upload"], ["x", hash]);
      }),
      file
    );
  }
  async uploadFile(file) {
    return this.uploadBlob(file, file.type);
  }
  async download(hash) {
    if (!isHex32(hash))
      throw new Error(`${hash} is not a valid 32-byte hex string`);
    const authHeader = await this.authorizationHeader((evt) => {
      evt.tags.push(["t", "get"], ["x", hash]);
    });
    const res = await fetch(this.mediaserver + hash, {
      method: "GET",
      headers: { Authorization: authHeader }
    });
    if (res.status >= 300) {
      throw new Error(`${hash} not present on ${this.mediaserver}: ${res.status}`);
    }
    return res.arrayBuffer();
  }
  async downloadAsBlob(hash) {
    return new Blob([await this.download(hash)]);
  }
  async list() {
    const pubkey = await this.signer.getPublicKey();
    if (!isHex32(pubkey)) {
      throw new Error(`pubkey ${pubkey} is not valid`);
    }
    return this.httpCall(
      "GET",
      `list/${pubkey}`,
      void 0,
      () => this.authorizationHeader((evt) => {
        evt.tags.push(["t", "list"]);
      })
    );
  }
  async delete(hash) {
    if (!isHex32(hash))
      throw new Error(`${hash} is not a valid 32-byte hex string`);
    await this.httpCall(
      "DELETE",
      hash,
      void 0,
      () => this.authorizationHeader((evt) => {
        evt.tags.push(["t", "delete"], ["x", hash]);
      })
    );
  }
  async check(hash) {
    if (!isHex32(hash))
      throw new Error(`${hash} is not valid 32-byte hex`);
    await this.httpCall("HEAD", hash);
  }
  async mirror(remoteBlobURL) {
    const hash = remoteBlobURL.split("/").pop()?.split(".")[0] || "";
    return this.httpCall(
      "PUT",
      "mirror",
      "application/json",
      () => this.authorizationHeader((evt) => {
        evt.tags.push(["t", "upload"], ["x", hash]);
      }),
      JSON.stringify({ url: remoteBlobURL })
    );
  }
};
export {
  BlossomClient,
  areServersEqual,
  blossomURIFromURL,
  blossomURIToURL,
  buildBlossomURI,
  computeBlobSha256,
  createAuthEvent,
  createDeleteAuth,
  createDownloadAuth,
  createListAuth,
  createMirrorAuth,
  createUploadAuth,
  deleteBlob,
  downloadBlob,
  encodeAuthorizationHeader,
  getAuthExpiration,
  getAuthTagValues,
  getBlobSize,
  getBlobType,
  getExtension,
  getHashFromURL,
  getMIMEType,
  getServersFromServerListEvent,
  hasBlob,
  isAuthExpired,
  iterateBlobs,
  listBlobs,
  mirrorBlob,
  normalizeServerTag,
  now,
  oneHour,
  parseBlossomURI,
  reportBlobs,
  uploadBlob
};
