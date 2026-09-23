import { Filter } from './filter.ts';
export type WebAddressPointer = {
    filter: Filter;
    relays?: string[];
};
/**
 * NIP-AD regex. Matches a web URL with a path that may have a Nostr counterpart.
 *
 * - 0: full match
 * - 1: domain
 * - 2: path
 */
export declare const AD_REGEX: RegExp;
export declare const isWebAddress: (value?: string | null) => value is string;
export declare function useFetchImplementation(fetchImplementation: unknown): void;
export declare function queryWebAddress(url: string): Promise<WebAddressPointer | null>;
