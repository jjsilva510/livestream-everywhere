import { NostrEvent } from './core.ts';
import { AddressPointer, EventPointer, ProfilePointer } from './nip19.ts';
export type Block = {
    type: 'text';
    text: string;
    start: number;
    end: number;
} | {
    type: 'reference';
    pointer: ProfilePointer | AddressPointer | EventPointer;
    start: number;
    end: number;
} | {
    type: 'url';
    url: string;
    start: number;
    end: number;
} | {
    type: 'relay';
    url: string;
    start: number;
    end: number;
} | {
    type: 'image';
    url: string;
    start: number;
    end: number;
} | {
    type: 'video';
    url: string;
    start: number;
    end: number;
} | {
    type: 'audio';
    url: string;
    start: number;
    end: number;
} | {
    type: 'emoji';
    shortcode: string;
    url: string;
    start: number;
    end: number;
} | {
    type: 'hashtag';
    value: string;
    start: number;
    end: number;
};
export declare function parse(content: string | NostrEvent): Iterable<Block>;
