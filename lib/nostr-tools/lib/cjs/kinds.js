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
  Date: () => Date,
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
module.exports = __toCommonJS(kinds_exports);

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
var Date = 31922;
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
