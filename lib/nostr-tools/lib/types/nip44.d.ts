export declare function getConversationKey(privkeyA: Uint8Array, pubkeyB: string): Uint8Array;
declare function calcPaddedLen(len: number): number;
declare function pad(plaintext: string): Uint8Array;
declare function unpad(padded: Uint8Array): string;
export declare function encrypt(plaintext: string, conversationKey: Uint8Array, nonce?: Uint8Array): string;
/** Callers should validate payload size before calling to prevent DoS from oversized inputs. */
export declare function decrypt(payload: string, conversationKey: Uint8Array): string;
export declare const v2: {
    utils: {
        getConversationKey: typeof getConversationKey;
        calcPaddedLen: typeof calcPaddedLen;
        pad: typeof pad;
        unpad: typeof unpad;
    };
    encrypt: typeof encrypt;
    decrypt: typeof decrypt;
};
export {};
