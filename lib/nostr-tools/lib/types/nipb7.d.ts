import type { EventTemplate } from './core.ts';
import type { Signer } from './signer.ts';
export type BlobDescriptor = {
    url: string;
    sha256: string;
    size: number;
    type: string;
    uploaded: number;
};
export type UploadType = Blob | File | Buffer;
export type SignedEvent = EventTemplate & {
    id: string;
    sig: string;
    pubkey: string;
};
export type AuthEventOptions = {
    blobs?: string | string[];
    servers?: string | string[];
    message?: string;
    expiration?: number;
};
export declare function getBlobSize(blob: UploadType): number;
export declare function getBlobType(blob: UploadType): string | undefined;
export declare function computeBlobSha256(blob: UploadType): Promise<string>;
export declare function encodeAuthorizationHeader(event: SignedEvent): string;
export declare function now(): number;
export declare function oneHour(): number;
export declare function getAuthTagValues(auth: SignedEvent, tagName: string): string[];
export declare function getAuthExpiration(auth: SignedEvent): number | undefined;
export declare function isAuthExpired(auth: SignedEvent, timestamp?: number): boolean;
export declare function normalizeServerTag(server: string | URL): string;
export declare function areServersEqual(a: string | URL, b: string | URL): boolean;
export declare function createAuthEvent(signer: (draft: EventTemplate) => Promise<SignedEvent>, type: 'upload' | 'list' | 'delete' | 'get' | 'media', options?: AuthEventOptions): Promise<SignedEvent>;
export type UploadAuthOptions = Omit<AuthEventOptions, 'blobs'> & {
    type?: 'upload' | 'media';
};
export declare function createUploadAuth(signer: (draft: EventTemplate) => Promise<SignedEvent>, blobs: string | string[], options?: UploadAuthOptions): Promise<SignedEvent>;
export type DownloadAuthOptions = Omit<AuthEventOptions, 'blobs' | 'servers'>;
export declare function createDownloadAuth(signer: (draft: EventTemplate) => Promise<SignedEvent>, hash: string, options?: DownloadAuthOptions): Promise<SignedEvent>;
export type MirrorAuthOptions = Omit<AuthEventOptions, 'blobs'>;
export declare function createMirrorAuth(signer: (draft: EventTemplate) => Promise<SignedEvent>, hash: string, options?: MirrorAuthOptions): Promise<SignedEvent>;
export type ListAuthOptions = Omit<AuthEventOptions, 'blobs'>;
export declare function createListAuth(signer: (draft: EventTemplate) => Promise<SignedEvent>, options?: ListAuthOptions): Promise<SignedEvent>;
export type DeleteAuthOptions = Omit<AuthEventOptions, 'blobs'>;
export declare function createDeleteAuth(signer: (draft: EventTemplate) => Promise<SignedEvent>, hash: string, options?: DeleteAuthOptions): Promise<SignedEvent>;
export type BlossomURI = {
    sha256: string;
    ext: string;
    servers: string[];
    authors: string[];
    size?: number;
};
export declare function parseBlossomURI(uri: string): BlossomURI;
export declare function buildBlossomURI(options: BlossomURI): string;
export declare function blossomURIToURL(uri: string | BlossomURI): URL;
export declare function blossomURIFromURL(url: URL): BlossomURI;
export declare function getExtension(mimetype: string): string;
export declare function getMIMEType(ext: string): string;
export declare function getServersFromServerListEvent(event: {
    tags: string[][];
}): URL[];
export declare function getHashFromURL(url: string | URL): string | null;
export type UploadOptions = {
    signal?: AbortSignal;
    auth?: SignedEvent | boolean;
    timeout?: number;
    onAuth?: (server: string, sha256: string) => Promise<SignedEvent>;
};
export declare function uploadBlob(server: string, blob: Blob | File, opts?: UploadOptions): Promise<BlobDescriptor>;
export type DownloadOptions = {
    signal?: AbortSignal;
    auth?: SignedEvent | boolean;
    timeout?: number;
    onAuth?: (server: string, sha256: string) => Promise<SignedEvent>;
};
export declare function downloadBlob(server: string, hash: string, opts?: DownloadOptions): Promise<Response>;
export type ListOptions = {
    signal?: AbortSignal;
    auth?: SignedEvent | boolean;
    timeout?: number;
    onAuth?: (server: string) => Promise<SignedEvent>;
    cursor?: string;
    limit?: number;
    since?: number;
    until?: number;
};
export declare function listBlobs(server: string, pubkey: string, opts?: ListOptions): Promise<BlobDescriptor[]>;
export declare function iterateBlobs(server: string, pubkey: string, opts?: ListOptions): AsyncGenerator<BlobDescriptor[], void, void>;
export type DeleteOptions = {
    signal?: AbortSignal;
    auth?: SignedEvent | boolean;
    timeout?: number;
    onAuth?: (server: string, sha256: string) => Promise<SignedEvent>;
};
export declare function deleteBlob(server: string, hash: string, opts?: DeleteOptions): Promise<boolean>;
export type HasBlobOptions = {
    signal?: AbortSignal;
    timeout?: number;
};
export declare function hasBlob(server: string, hash: string, opts?: HasBlobOptions): Promise<boolean>;
export type MirrorOptions = {
    signal?: AbortSignal;
    auth?: SignedEvent | boolean;
    timeout?: number;
    onAuth?: (server: string, sha256: string) => Promise<SignedEvent>;
};
export declare function mirrorBlob(server: string, blob: BlobDescriptor, opts?: MirrorOptions): Promise<BlobDescriptor>;
export type ReportOptions = {
    signal?: AbortSignal;
    timeout?: number;
    onError?: (server: string, error: Error) => void;
};
export declare function reportBlobs(servers: Iterable<string>, report: SignedEvent, opts?: ReportOptions): Promise<Map<string, boolean>>;
export declare class BlossomClient {
    private signer;
    private mediaserver;
    constructor(mediaserver: string, signer: Signer);
    getMediaServer(): string;
    private authorizationHeader;
    private httpCall;
    uploadBlob(file: Blob | File, contentType?: string): Promise<BlobDescriptor>;
    uploadFile(file: File): Promise<BlobDescriptor>;
    download(hash: string): Promise<ArrayBuffer>;
    downloadAsBlob(hash: string): Promise<Blob>;
    list(): Promise<BlobDescriptor[]>;
    delete(hash: string): Promise<void>;
    check(hash: string): Promise<void>;
    mirror(remoteBlobURL: string): Promise<BlobDescriptor>;
}
