import type { Event } from './core.ts';
import type { AddressPointer, EventPointer, ProfilePointer } from './nip19.ts';
export type ExternalPointer = {
    value: string;
    hint?: string;
};
export declare function parse(event: Pick<Event, 'tags'>): {
    /**
     * Pointer to root scope.
     */
    root: EventPointer | AddressPointer | ExternalPointer | undefined;
    /**
     * Kind of root scope from `K` tag.
     */
    rootKind: number | string | undefined;
    /**
     * Pointer to parent item being replied to.
     */
    reply: EventPointer | AddressPointer | ExternalPointer | undefined;
    /**
     * Kind of parent item from `k` tag.
     */
    replyKind: number | string | undefined;
    /**
     * Reserved for extra referenced items.
     */
    mentions: (EventPointer | AddressPointer | ExternalPointer)[];
    /**
     * Pointers directly quoted with `q` tags.
     */
    quotes: (EventPointer | AddressPointer | ExternalPointer)[];
    /**
     * Root and parent authors.
     */
    profiles: ProfilePointer[];
};
