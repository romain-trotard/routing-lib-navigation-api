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
    location: string;
    matchingRoute: Route | null;
    loaderData: any;
    initialized: boolean;
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
        location: initialPathname,
        matchingRoute: initialMatchingRoute,
        loaderData: undefined,
        initialized: !initialMatchingRoute?.loader,
    }

    const updateState = (newState: Partial<RouterState>) => {
        state = { ...state, ...newState };

        subscribers.forEach(subscriber => subscriber(state));
    }

    const completeNavigation = async (url: string) => {
        const { pathname } = new URL(url);

        const matchingRoute = routes.find(route => route.path === pathname);

        const data = (await matchingRoute?.loader?.() ?? noop());

        const newMatchingRoute = getMatchingRoute(routes, pathname);

        updateState({ location: pathname, loaderData: data, matchingRoute: newMatchingRoute, initialized: true });
    }

    const listener = (event: NavigateEvent) => {
        if (shouldNotIntercept(event)) {
            return;
        }

        event.intercept({
            async handler() {
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

    return { get state() { return state; }, subscribe, navigate };
}

