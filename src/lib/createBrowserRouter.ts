import { NavigateEvent } from './WindowOverride';

type Route = {
    path: string,
    component: JSX.Element;
    loader?: () => Promise<any> | any;
}

export type Routes = Route[];

const noop = () => undefined;

// Code from https://developer.chrome.com/docs/web-platform/navigation-api/#deciding-how-to-handle-a-navigation
function shouldNotIntercept(navigationEvent: NavigateEvent) {
    return (
        !navigationEvent.canIntercept ||
        // If this is just a hashChange,
        // just let the browser handle scrolling to the content.
        navigationEvent.hashChange ||
        // If this is a download,
        // let the browser perform the download.
        navigationEvent.downloadRequest ||
        // If this is a form submission,
        // let that go to the server.
        navigationEvent.formData
    );
}

export type RouterState = {
    // In reality should put the location.
    // With dynamic parameters, but not handle in this
    // example of implementation.
    pathname: string;
    matchingRoute: Route | null;
    loaderData: any;
    initialized: boolean;
    navigationInProgress: boolean;
}

type RouterStateSubscriber = (newState: RouterState) => void;

function getMatchingRoute(routes: Routes, pathname: string) {
    return routes.find(route => route.path === pathname) ?? null;
}

/** 
* This function will create the browser router state
* It has to be called outside of any component.
*/
export default function createBrowserRouter({ routes }: { routes: Routes }) {
    const initialPathname = window.location.pathname;
    let subscribers: RouterStateSubscriber[] = [];

    // Simpler matching method.
    // This does not handle nested routing but not the subject of the article.
    // See my `React router v6` implem article for that.
    const initialMatchingRoute = getMatchingRoute(routes, initialPathname);

    const subscribe = (subscriber: RouterStateSubscriber) => {
        subscribers.push(subscriber);

        // unsubscribe callback
        return () => {
            subscribers = subscribers.filter(sub => sub !== subscriber);
        }
    }

    let state: RouterState = {
        pathname: initialPathname,
        matchingRoute: initialMatchingRoute,
        loaderData: undefined,
        initialized: !initialMatchingRoute?.loader,
        navigationInProgress: false,
    }

    const updateState = (newState: Partial<RouterState>) => {
        state = { ...state, ...newState };

        // Notify to all the subscribers of the changes
        subscribers.forEach(subscriber => subscriber(state));
    }

    const completeNavigation = async (url: string) => {
        const { pathname } = new URL(url);

        const newMatchingRoute = getMatchingRoute(routes, pathname);

        const data = (await newMatchingRoute?.loader?.() ?? noop());

        updateState({
            pathname,
            loaderData: data,
            matchingRoute: newMatchingRoute,
            initialized: true,
            navigationInProgress: false,
        });
    }

    const listener = (event: NavigateEvent) => {
        if (shouldNotIntercept(event)) {
            return;
        }

        event.intercept({
            async handler() {
                updateState({
                    navigationInProgress: true,
                })

                await completeNavigation(event.destination.url);
            }
        })
    }

    // Add our interceptor
    window.navigation.addEventListener('navigate', listener);

    // Simulate a navigation for the first pathname.
    completeNavigation(window.location.href);

    const navigate = (url: string,
        { replaceMode = false, info }: { replaceMode?: boolean, info?: any } = {}
    ) => {
        window.navigation.navigate(url, { history: replaceMode ? 'replace' : 'push', info });
    }

    const registerBlockingRoute = ({
        shouldPrompt,
        customPromptBeforeLeaveModal,
        message = 'Are you sure you want to leave? You will lose unsaved changes'
    }: {
        shouldPrompt: () => boolean,
        customPromptBeforeLeaveModal: () => Promise<boolean>,
        message?: string
    }) => {
        const insideAppListener = async (event: NavigateEvent) => {
            // We do not intercept the navigation if:
            // - we should not
            // - if the navigation has already been catched `forceNavigate` in the `info`
            // - we do not should prompt
            if (!shouldNotIntercept(event) && !event.info?.forceNavigate && shouldPrompt()) {
                event.preventDefault();
                const shouldContinue = await customPromptBeforeLeaveModal();

                // If the user wants to continue the navigation
                // and consequently loses the form data
                // let's do this
                if (shouldContinue) {
                    window.navigation.navigate(
                        event.destination.url,
                        {
                            history: 'push',
                            state: event.destination.state,
                            info: { forceNavigate: true, ...event.info },
                        }
                    );
                }
            }
        }

        window.navigation.addEventListener('navigate', insideAppListener);

        const outsideAppListener = (event: BeforeUnloadEvent) => {
            if (shouldPrompt()) {
                event.preventDefault();
                return event.returnValue = message;
            }
        }

        // Add event listener, for:
        // - reload of page
        // - going to other origin
        // - closing tab
        window.addEventListener('beforeunload', outsideAppListener);

        // Return unregister callback
        return () => {
            window.navigation.removeEventListener('navigate', insideAppListener);
            window.removeEventListener('beforeunload', outsideAppListener);
        }
    }

    return { get state() { return state; }, subscribe, navigate, registerBlockingRoute };
}

