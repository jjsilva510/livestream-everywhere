import { AbstractSimplePool } from './abstract-pool.ts';
import type { Event, EventTemplate } from './core.ts';
import { RelayInformation } from './nip11.ts';
/**
 * Represents a NIP29 group.
 */
export type Group = {
    relay: string;
    metadata: GroupMetadata;
    admins?: GroupAdmin[];
    members?: GroupMember[];
    reference: GroupReference;
};
/**
 * Represents the metadata for a NIP29 group.
 */
export type GroupMetadata = {
    id: string;
    pubkey: string;
    name?: string;
    picture?: string;
    banner?: string;
    about?: string;
    isPrivate?: boolean;
    isRestricted?: boolean;
    isHidden?: boolean;
    isClosed?: boolean;
    hasLiveKit?: boolean;
    supportedKinds?: string[];
    parent?: string;
    children?: string[];
};
/**
 * Represents a NIP29 group reference.
 */
export type GroupReference = {
    id: string;
    host: string;
};
/**
 * Represents a NIP29 group member.
 */
export type GroupMember = {
    pubkey: string;
    label?: string;
};
/**
 * Represents a NIP29 group admin.
 */
export type GroupAdmin = {
    pubkey: string;
    label?: string;
    permissions: GroupAdminPermission[];
};
/**
 * Represents the permissions that a NIP29 group admin can have.
 */
export declare enum GroupAdminPermission {
    /** @deprecated use PutUser instead */
    AddUser = "add-user",
    EditMetadata = "edit-metadata",
    DeleteEvent = "delete-event",
    RemoveUser = "remove-user",
    /** @deprecated removed from NIP */
    AddPermission = "add-permission",
    /** @deprecated removed from NIP */
    RemovePermission = "remove-permission",
    /** @deprecated removed from NIP */
    EditGroupStatus = "edit-group-status",
    PutUser = "put-user",
    CreateGroup = "create-group",
    DeleteGroup = "delete-group",
    CreateInvite = "create-invite",
    UpdatePinList = "update-pin-list"
}
/**
 * Generates a group metadata event template.
 *
 * @param group - The group object.
 * @returns An event template with the generated group metadata that can be signed later.
 */
export declare function generateGroupMetadataEventTemplate(group: Group): EventTemplate;
/**
 * Validates a group metadata event.
 *
 * @param event - The event to validate.
 * @returns A boolean indicating whether the event is valid.
 */
export declare function validateGroupMetadataEvent(event: Event): boolean;
/**
 * Generates an event template for group admins.
 *
 * @param group - The group object.
 * @param admins - An array of group admins.
 * @returns The generated event template with the group admins that can be signed later.
 */
export declare function generateGroupAdminsEventTemplate(group: Group, admins: GroupAdmin[]): EventTemplate;
/**
 * Validates a group admins event.
 *
 * @param event - The event to validate.
 * @returns True if the event is valid, false otherwise.
 */
export declare function validateGroupAdminsEvent(event: Event): boolean;
/**
 * Generates an event template for a group with its members.
 *
 * @param group - The group object.
 * @param members - An array of group members.
 * @returns The generated event template with the group members that can be signed later.
 */
export declare function generateGroupMembersEventTemplate(group: Group, members: GroupMember[]): EventTemplate;
/**
 * Validates a group members event.
 *
 * @param event - The event to validate.
 * @returns Returns `true` if the event is a valid group members event, `false` otherwise.
 */
export declare function validateGroupMembersEvent(event: Event): boolean;
/**
 * Returns the normalized relay URL based on the provided group reference.
 *
 * @param groupReference - The group reference object containing the host.
 * @returns The normalized relay URL.
 */
export declare function getNormalizedRelayURLByGroupReference(groupReference: GroupReference): string;
/**
 * Fetches relay information by group reference.
 *
 * @param groupReference The group reference.
 * @returns A promise that resolves to the relay information.
 */
export declare function fetchRelayInformationByGroupReference(groupReference: GroupReference): Promise<RelayInformation>;
/**
 * Fetches the group metadata event from the specified pool.
 * If the normalizedRelayURL is not provided, it will be obtained using the groupReference.
 * If the relayInformation is not provided, it will be fetched using the normalizedRelayURL.
 *
 * @param {Object} options - The options object.
 * @param {AbstractSimplePool} options.pool - The pool to fetch the group metadata event from.
 * @param {GroupReference} options.groupReference - The reference to the group.
 * @param {string} [options.normalizedRelayURL] - The normalized URL of the relay.
 * @param {RelayInformation} [options.relayInformation] - The relay information object.
 * @returns {Promise<Event>} The group metadata event that can be parsed later to get the group metadata object.
 * @throws {Error} If the group is not found on the specified relay.
 */
export declare function fetchGroupMetadataEvent({ pool, groupReference, relayInformation, normalizedRelayURL, }: {
    pool: AbstractSimplePool;
    groupReference: GroupReference;
    normalizedRelayURL?: string;
    relayInformation?: RelayInformation;
}): Promise<Event>;
/**
 * Parses a group metadata event and returns the corresponding GroupMetadata object.
 *
 * @param event - The event to parse.
 * @returns The parsed GroupMetadata object.
 * @throws An error if the group metadata event is invalid.
 */
export declare function parseGroupMetadataEvent(event: Event): GroupMetadata;
/**
 * Fetches the group admins event from the specified pool.
 * If the normalizedRelayURL is not provided, it will be obtained from the groupReference.
 * If the relayInformation is not provided, it will be fetched using the normalizedRelayURL.
 *
 * @param {Object} options - The options object.
 * @param {AbstractSimplePool} options.pool - The pool to fetch the group admins event from.
 * @param {GroupReference} options.groupReference - The reference to the group.
 * @param {string} [options.normalizedRelayURL] - The normalized relay URL.
 * @param {RelayInformation} [options.relayInformation] - The relay information.
 * @returns {Promise<Event>} The group admins event that can be parsed later to get the group admins object.
 * @throws {Error} If the group admins event is not found on the specified relay.
 */
export declare function fetchGroupAdminsEvent({ pool, groupReference, relayInformation, normalizedRelayURL, }: {
    pool: AbstractSimplePool;
    groupReference: GroupReference;
    normalizedRelayURL?: string;
    relayInformation?: RelayInformation;
}): Promise<Event>;
/**
 * Parses a group admins event and returns an array of GroupAdmin objects.
 *
 * @param event - The event to parse.
 * @returns An array of GroupAdmin objects.
 * @throws Throws an error if the group admins event is invalid.
 */
export declare function parseGroupAdminsEvent(event: Event): GroupAdmin[];
/**
 * Fetches the group members event from the specified relay.
 * If the normalizedRelayURL is not provided, it will be obtained using the groupReference.
 * If the relayInformation is not provided, it will be fetched using the normalizedRelayURL.
 *
 * @param {Object} options - The options object.
 * @param {AbstractSimplePool} options.pool - The pool object.
 * @param {GroupReference} options.groupReference - The group reference object.
 * @param {string} [options.normalizedRelayURL] - The normalized relay URL.
 * @param {RelayInformation} [options.relayInformation] - The relay information object.
 * @returns {Promise<Event>} The group members event that can be parsed later to get the group members object.
 * @throws {Error} If the group members event is not found.
 */
export declare function fetchGroupMembersEvent({ pool, groupReference, relayInformation, normalizedRelayURL, }: {
    pool: AbstractSimplePool;
    groupReference: GroupReference;
    normalizedRelayURL?: string;
    relayInformation?: RelayInformation;
}): Promise<Event>;
/**
 * Fetches the group roles event from the specified pool.
 *
 * @param {Object} options - The options object.
 * @param {AbstractSimplePool} options.pool - The pool object.
 * @param {GroupReference} options.groupReference - The group reference object.
 * @param {string} [options.normalizedRelayURL] - The normalized relay URL.
 * @param {RelayInformation} [options.relayInformation] - The relay information object.
 * @returns {Promise<Event>} The group roles event that can be parsed later to get the group roles object.
 * @throws {Error} If the group roles event is not found.
 */
export declare function fetchGroupRolesEvent({ pool, groupReference, relayInformation, normalizedRelayURL, }: {
    pool: AbstractSimplePool;
    groupReference: GroupReference;
    normalizedRelayURL?: string;
    relayInformation?: RelayInformation;
}): Promise<Event>;
/**
 * Fetches the group livekit participants event from the specified pool.
 *
 * @param {Object} options - The options object.
 * @param {AbstractSimplePool} options.pool - The pool object.
 * @param {GroupReference} options.groupReference - The group reference object.
 * @param {string} [options.normalizedRelayURL] - The normalized relay URL.
 * @param {RelayInformation} [options.relayInformation] - The relay information object.
 * @returns {Promise<Event>} The group livekit participants event that can be parsed later to get the participants.
 * @throws {Error} If the group livekit participants event is not found.
 */
export declare function fetchGroupLivekitParticipantsEvent({ pool, groupReference, relayInformation, normalizedRelayURL, }: {
    pool: AbstractSimplePool;
    groupReference: GroupReference;
    normalizedRelayURL?: string;
    relayInformation?: RelayInformation;
}): Promise<Event>;
/**
 * Fetches the group pinned events event from the specified pool.
 *
 * @param {Object} options - The options object.
 * @param {AbstractSimplePool} options.pool - The pool object.
 * @param {GroupReference} options.groupReference - The group reference object.
 * @param {string} [options.normalizedRelayURL] - The normalized relay URL.
 * @param {RelayInformation} [options.relayInformation] - The relay information object.
 * @returns {Promise<Event>} The group pinned events event that can be parsed later to get the pinned events.
 * @throws {Error} If the group pinned events event is not found.
 */
export declare function fetchGroupPinnedEventsEvent({ pool, groupReference, relayInformation, normalizedRelayURL, }: {
    pool: AbstractSimplePool;
    groupReference: GroupReference;
    normalizedRelayURL?: string;
    relayInformation?: RelayInformation;
}): Promise<Event>;
/**
 * Parses a group members event and returns an array of GroupMember objects.
 * @param event - The event to parse.
 * @returns An array of GroupMember objects.
 * @throws Throws an error if the group members event is invalid.
 */
export declare function parseGroupMembersEvent(event: Event): GroupMember[];
/**
 * Represents a NIP29 group role.
 */
export type GroupRole = {
    name: string;
    description?: string;
};
/**
 * Generates an event template for the roles supported by a group.
 *
 * @param group - The group object.
 * @param roles - An array of group roles.
 * @returns The generated event template with the group roles that can be signed later.
 */
export declare function generateGroupRolesEventTemplate(group: Group, roles: GroupRole[]): EventTemplate;
/**
 * Validates a group roles event.
 *
 * @param event - The event to validate.
 * @returns True if the event is a valid group roles event, false otherwise.
 */
export declare function validateGroupRolesEvent(event: Event): boolean;
/**
 * Parses a group roles event and returns an array of GroupRole objects.
 *
 * @param event - The event to parse.
 * @returns An array of GroupRole objects.
 * @throws Throws an error if the group roles event is invalid.
 */
export declare function parseGroupRolesEvent(event: Event): GroupRole[];
/**
 * Generates an event template for the livekit participants of a group.
 *
 * @param group - The group object.
 * @param participants - An array of pubkeys currently live in the group's AV rooms.
 * @returns The generated event template with the livekit participants that can be signed later.
 */
export declare function generateGroupLivekitParticipantsEventTemplate(group: Group, participants: string[]): EventTemplate;
/**
 * Validates a group livekit participants event.
 *
 * @param event - The event to validate.
 * @returns True if the event is a valid group livekit participants event, false otherwise.
 */
export declare function validateGroupLivekitParticipantsEvent(event: Event): boolean;
/**
 * Parses a group livekit participants event and returns an array of participant pubkeys.
 *
 * @param event - The event to parse.
 * @returns An array of participant pubkeys.
 * @throws Throws an error if the group livekit participants event is invalid.
 */
export declare function parseGroupLivekitParticipantsEvent(event: Event): string[];
/**
 * Represents a reference to a pinned event in a NIP29 group.
 */
export type GroupPinnedEvent = {
    type: 'e' | 'a';
    value: string;
};
/**
 * Generates an event template for the events pinned in a group.
 *
 * @param group - The group object.
 * @param pinnedEvents - An array of references to pinned events, in display order.
 * @returns The generated event template with the pinned events that can be signed later.
 */
export declare function generateGroupPinnedEventsEventTemplate(group: Group, pinnedEvents: GroupPinnedEvent[]): EventTemplate;
/**
 * Validates a group pinned events event.
 *
 * @param event - The event to validate.
 * @returns True if the event is a valid group pinned events event, false otherwise.
 */
export declare function validateGroupPinnedEventsEvent(event: Event): boolean;
/**
 * Parses a group pinned events event and returns an array of GroupPinnedEvent objects.
 *
 * @param event - The event to parse.
 * @returns An array of GroupPinnedEvent objects.
 * @throws Throws an error if the group pinned events event is invalid.
 */
export declare function parseGroupPinnedEventsEvent(event: Event): GroupPinnedEvent[];
/**
 * Generates a `put-user` (kind:9000) moderation event template.
 *
 * @param groupId - The id of the group.
 * @param pubkey - The pubkey of the user to add or update.
 * @param roles - Optional roles to assign to the user.
 * @param reason - Optional reason for the action.
 * @param previous - Optional timeline references.
 * @returns The generated event template that can be signed later.
 */
export declare function generatePutUserEventTemplate(groupId: string, pubkey: string, roles?: string[], reason?: string, previous?: string[]): EventTemplate;
/**
 * Generates a `remove-user` (kind:9001) moderation event template.
 *
 * @param groupId - The id of the group.
 * @param pubkey - The pubkey of the user to remove.
 * @param reason - Optional reason for the action.
 * @param previous - Optional timeline references.
 * @returns The generated event template that can be signed later.
 */
export declare function generateRemoveUserEventTemplate(groupId: string, pubkey: string, reason?: string, previous?: string[]): EventTemplate;
/**
 * Generates an `edit-metadata` (kind:9002) moderation event template carrying
 * all the metadata fields of the group.
 *
 * @param group - The group object with the updated metadata.
 * @param reason - Optional reason for the action.
 * @param previous - Optional timeline references.
 * @returns The generated event template that can be signed later.
 */
export declare function generateEditGroupMetadataEventTemplate(group: Group, reason?: string, previous?: string[]): EventTemplate;
/**
 * Generates a `delete-event` (kind:9005) moderation event template.
 *
 * @param groupId - The id of the group.
 * @param eventId - The id of the event to delete.
 * @param reason - Optional reason for the action.
 * @param previous - Optional timeline references.
 * @returns The generated event template that can be signed later.
 */
export declare function generateDeleteEventEventTemplate(groupId: string, eventId: string, reason?: string, previous?: string[]): EventTemplate;
/**
 * Generates a `create-group` (kind:9007) moderation event template.
 *
 * @param groupId - The id of the group to create.
 * @param reason - Optional reason for the action.
 * @param previous - Optional timeline references.
 * @returns The generated event template that can be signed later.
 */
export declare function generateCreateGroupEventTemplate(groupId: string, reason?: string, previous?: string[]): EventTemplate;
/**
 * Generates a `delete-group` (kind:9008) moderation event template.
 *
 * @param groupId - The id of the group to delete.
 * @param reason - Optional reason for the action.
 * @param previous - Optional timeline references.
 * @returns The generated event template that can be signed later.
 */
export declare function generateDeleteGroupEventTemplate(groupId: string, reason?: string, previous?: string[]): EventTemplate;
/**
 * Generates a `create-invite` (kind:9009) moderation event template.
 *
 * @param groupId - The id of the group.
 * @param code - An arbitrary invite code.
 * @param reason - Optional reason for the action.
 * @param previous - Optional timeline references.
 * @returns The generated event template that can be signed later.
 */
export declare function generateCreateInviteEventTemplate(groupId: string, code: string, reason?: string, previous?: string[]): EventTemplate;
/**
 * Generates an `update-pin-list` (kind:9010) moderation event template.
 *
 * @param groupId - The id of the group.
 * @param pinnedEvents - The full ordered list of pinned events.
 * @param reason - Optional reason for the action.
 * @param previous - Optional timeline references.
 * @returns The generated event template that can be signed later.
 */
export declare function generateUpdatePinListEventTemplate(groupId: string, pinnedEvents: GroupPinnedEvent[], reason?: string, previous?: string[]): EventTemplate;
/**
 * Generates a group join request (kind:9021) event template.
 *
 * @param groupId - The id of the group.
 * @param inviteCode - Optional invite code to be preauthorized by the relay.
 * @param reason - Optional reason for the request.
 * @param previous - Optional timeline references.
 * @returns The generated event template that can be signed later.
 */
export declare function generateGroupJoinRequestEventTemplate(groupId: string, inviteCode?: string, reason?: string, previous?: string[]): EventTemplate;
/**
 * Generates a group leave request (kind:9022) event template.
 *
 * @param groupId - The id of the group.
 * @param reason - Optional reason for the request.
 * @param previous - Optional timeline references.
 * @returns The generated event template that can be signed later.
 */
export declare function generateGroupLeaveRequestEventTemplate(groupId: string, reason?: string, previous?: string[]): EventTemplate;
/**
 * Fetches and parses the group metadata event, group admins event, and group members event from the specified pool.
 * If the normalized relay URL is not provided, it will be obtained using the group reference.
 * If the relay information is not provided, it will be fetched using the normalized relay URL.
 *
 * @param {Object} options - The options for loading the group.
 * @param {AbstractSimplePool} options.pool - The pool to load the group from.
 * @param {GroupReference} options.groupReference - The reference of the group to load.
 * @param {string} [options.normalizedRelayURL] - The normalized URL of the relay to use.
 * @param {RelayInformation} [options.relayInformation] - The relay information to use.
 * @returns {Promise<Group>} A promise that resolves to the loaded group.
 */
export declare function loadGroup({ pool, groupReference, normalizedRelayURL, relayInformation, }: {
    pool: AbstractSimplePool;
    groupReference: GroupReference;
    normalizedRelayURL?: string;
    relayInformation?: RelayInformation;
}): Promise<Group>;
/**
 * Loads a group from the specified pool using the provided group code.
 *
 * @param {AbstractSimplePool} pool - The pool to load the group from.
 * @param {string} code - The code representing the group.
 * @returns {Promise<Group>} - A promise that resolves to the loaded group.
 * @throws {Error} - If the group code is invalid.
 */
export declare function loadGroupFromCode(pool: AbstractSimplePool, code: string): Promise<Group>;
/**
 * Parses a group code and returns a GroupReference object.
 *
 * @param code The group code to parse.
 * @returns A GroupReference object if the code is valid, otherwise null.
 */
export declare function parseGroupCode(code: string): null | GroupReference;
/**
 * Encodes a group reference into a string.
 *
 * @param gr - The group reference to encode.
 * @returns The encoded group reference as a string.
 */
export declare function encodeGroupReference(gr: GroupReference): string;
/**
 * Subscribes to relay groups metadata events and calls the provided event handler function
 * when an event is received.
 *
 * @param {Object} options - The options for subscribing to relay groups metadata events.
 * @param {AbstractSimplePool} options.pool - The pool to subscribe to.
 * @param {string} options.relayURL - The URL of the relay.
 * @param {Function} options.onError - The error handler function.
 * @param {Function} options.onEvent - The event handler function.
 * @param {Function} [options.onConnect] - The connect handler function.
 * @returns {Function} - A function to close the subscription
 */
export declare function subscribeRelayGroupsMetadataEvents({ pool, relayURL, onError, onEvent, onConnect, }: {
    pool: AbstractSimplePool;
    relayURL: string;
    onError: (err: Error) => void;
    onEvent: (event: Event) => void;
    onConnect?: () => void;
}): () => void;
