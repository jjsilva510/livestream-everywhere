import { AbstractRelay, type AbstractRelayConstructorOptions } from './abstract-relay.ts';
export declare function useWebSocketImplementation(websocketImplementation: any): void;
export declare class Relay extends AbstractRelay {
    constructor(url: string, options?: Pick<AbstractRelayConstructorOptions, 'enablePing' | 'enableReconnect' | 'idleTimeout'>);
    static connect(url: string, options?: Pick<AbstractRelayConstructorOptions, 'enablePing' | 'enableReconnect' | 'idleTimeout'> & Parameters<AbstractRelay['connect']>[0]): Promise<Relay>;
}
export type RelayRecord = Record<string, {
    read: boolean;
    write: boolean;
}>;
export * from './abstract-relay.ts';
