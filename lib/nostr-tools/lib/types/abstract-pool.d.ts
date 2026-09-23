import { AbstractRelay as AbstractRelay, SubscriptionParams, type AbstractRelayConstructorOptions } from './abstract-relay.ts';
import type { Event, EventTemplate, VerifiedEvent } from './core.ts';
import { type Filter } from './filter.ts';
import { type CountManyDirective } from './nip45.ts';
export type SubCloser = {
    close: (reason?: string) => void;
};
export type AbstractPoolConstructorOptions = AbstractRelayConstructorOptions & {
    automaticallyAuth?: (relayURL: string) => null | ((event: EventTemplate) => Promise<VerifiedEvent>);
    onRelayConnectionFailure?: (url: string) => void;
    onRelayConnectionSuccess?: (url: string) => void;
    allowConnectingToRelay?: (url: string, operation: ['read', Filter[]] | ['write', Event]) => boolean;
    maxWaitForConnection: number;
};
export type SubscribeManyParams = Omit<SubscriptionParams, 'onclose'> & {
    maxWait?: number;
    abort?: AbortSignal;
    onclose?: (reasons: {
        url: string;
        reason: string;
    }[]) => void;
    onauth?: (event: EventTemplate) => Promise<VerifiedEvent>;
    id?: string;
    label?: string;
};
export declare class AbstractSimplePool {
    protected relays: Map<string, AbstractRelay>;
    seenOn: Map<string, Set<AbstractRelay>>;
    trackRelays: boolean;
    verifyEvent: (event: Event, url: string) => boolean;
    enablePing: boolean | undefined;
    enableReconnect: boolean;
    idleTimeout: number;
    automaticallyAuth?: (relayURL: string) => null | ((event: EventTemplate) => Promise<VerifiedEvent>);
    onRelayConnectionFailure?: (url: string) => void;
    onRelayConnectionSuccess?: (url: string) => void;
    allowConnectingToRelay?: (url: string, operation: ['read', Filter[]] | ['write', Event]) => boolean;
    maxWaitForConnection: number;
    private _WebSocket?;
    constructor(opts: AbstractPoolConstructorOptions);
    ensureRelay(url: string, params?: {
        connectionTimeout?: number;
        abort?: AbortSignal;
    }): Promise<AbstractRelay>;
    close(relays: string[]): void;
    subscribe(relays: string[], filter: Filter, params: SubscribeManyParams): SubCloser;
    subscribeMany(relays: string[], filter: Filter, params: SubscribeManyParams): SubCloser;
    subscribeMap(requests: {
        url: string;
        filter: Filter;
    }[], params: SubscribeManyParams): SubCloser;
    subscribeEose(relays: string[], filter: Filter, params: Pick<SubscribeManyParams, 'label' | 'id' | 'onevent' | 'oninvalidevent' | 'onclose' | 'maxWait' | 'onauth'>): SubCloser;
    subscribeManyEose(relays: string[], filter: Filter, params: Pick<SubscribeManyParams, 'label' | 'id' | 'onevent' | 'oninvalidevent' | 'onclose' | 'maxWait' | 'onauth'>): SubCloser;
    querySync(relays: string[], filter: Filter, params?: Pick<SubscribeManyParams, 'label' | 'id' | 'maxWait'>): Promise<Event[]>;
    get(relays: string[], filter: Filter, params?: Pick<SubscribeManyParams, 'label' | 'id' | 'maxWait'>): Promise<Event | null>;
    countMany(relays: string[], target: string, directive: CountManyDirective, params?: {
        id?: string | null;
        maxWait?: number;
        abort?: AbortSignal;
    }): Promise<{
        count: number;
        hll?: string;
    }>;
    publish(relays: string[], event: Event, params?: {
        onauth?: (evt: EventTemplate) => Promise<VerifiedEvent>;
        maxWait?: number;
        abort?: AbortSignal;
    }): Promise<string>[];
    listConnectionStatus(): Map<string, boolean>;
    destroy(): void;
    pruneIdleRelays(idleThresholdMs?: number): string[];
}
