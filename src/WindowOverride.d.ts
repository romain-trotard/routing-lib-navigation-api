type NavigationHistoryBehavior = "auto" | "push" | "replace";

interface NavigationOptions {
    info?: any;
}

interface NavigationHistoryEntry extends EventTarget {
    readonly url?: string;
    readonly key: string;
    readonly id: string;
    readonly index: number;
    readonly sameDocument: boolean;
    getState(): any;
    ondispose: ((this: NavigationHistoryEntry, ev: Event) => any) | null;
}

interface NavigationTransition {
    // readonly navigationType: NavigationType;
    readonly from: NavigationHistoryEntry;
    readonly finished: Promise<undefined>;
}

interface NavigationResult {
    committed: Promise<NavigationHistoryEntry>;
    finished: Promise<NavigationHistoryEntry>;
}

interface NavigationNavigateOptions extends NavigationOptions {
    state?: any;
    history?: NavigationHistoryBehavior;
}

interface NavigationReloadOptions extends NavigationOptions {
    state: any;
}

interface NavigationUpdateCurrentEntryOptions {
    state: any;
}

export interface NavigateEvent extends Event {
    canIntercept: boolean;
    destination: {
        url: string;
    };
    intercept: (options: { handler: () => void }) => void;
}

interface NavigationEventHanldersMap {
    navigate: NavigateEvent;
}

/** Like History, allows manipulation of the browser session history, that is the pages visited in the tab or frame that the current page is loaded in. */
interface Navigation extends EventTarget {
    entries(): Array<NavigationHistoryEntry>;
    readonly currentEntry?: NavigationHistoryEntry;
    updateCurrentEntry(options: NavigationUpdateCurrentEntryOptions): undefined;
    readonly transition?: NavigationTransition;
    readonly canGoBack: boolean;
    readonly canGoForward: boolean;
    navigate(url: string, options?: NavigationNavigateOptions): NavigationResult;
    reload(options?: NavigationReloadOptions): NavigationResult;
    traverseTo(key: string, options?: NavigationOptions): NavigationResult;
    back(options?: NavigationOptions): NavigationResult;
    forward(options?: NavigationOptions): NavigationResult;
    addEventListener<K extends keyof NavigationEventHanldersMap>(type: K, listener: (this: GlobalEventHandlers, ev: NavigationEventHandlersMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof NavigationEventHandlersMap>(type: K, listener: (this: GlobalEventHandlers, ev: NavigationEventHandlersMap[K]) => any, options?: boolean | EventListenerOptions): void;
    onnavigate: ((this: Navigation, ev: NavigateEvent) => any) | null;
    onnavigatesuccess: ((this: Navigation, ev: Event) => any) | null;
    onnavigateerror: ((this: Navigation, ev: Event) => any) | null;
    oncurrententrychange: ((this: Navigation, ev: Event) => any) | null;
}

declare var Navigation: {
    prototype: Navigation;
    new(): Navigation;
};

declare global {
    interface Window {
        readonly navigation: Navigation;
    }
}

export { };

