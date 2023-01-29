import React from 'react';
import { useContext } from 'react';
import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { NavigateEvent } from './WindowOverride';

const LoaderDadaContext = React.createContext(undefined);

const noop = () => undefined;

export const useLoaderData = <T extends any = any,>() => useContext(LoaderDadaContext) as T;

type Route = {
    path: string,
    component: JSX.Element;
    loader?: () => Promise<any> | any;
}

export type Routes = Route[];

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

export default function Router({ routes: userRoutes }: { routes: Routes }) {
    const [loaderData, setLoaderData] = useState(undefined);
    const [currentUrl, setCurrentUrl] = useState<string | undefined>(undefined);
    const routesRef = useRef(userRoutes);

    useLayoutEffect(() => {
        routesRef.current = userRoutes;
    });

    useEffect(() => {
        const processUrl = async (url: string) => {
            const routes = routesRef.current;
            const { pathname } = new URL(url);

            const matchingRoute = routes.find(route => route.path === pathname);

            const data = (await matchingRoute?.loader?.() ?? noop());

            setLoaderData(data);
            setCurrentUrl(pathname);
        }

        const listener = (event: NavigateEvent) => {
            if (shouldNotIntercept(event)) {
                return;
            }

            event.intercept({
                async handler() {
                    await processUrl(event.destination.url);
                }
            })
        }

        // Process the url like calling loaderData at first render
        processUrl(window.location.href);

        window.navigation.addEventListener('navigate', listener);

        return () => {
            window.navigation.removeEventListener('navigate', listener);
        };
    }, [])

    const matchingRoute = useMemo(() => {
        return routesRef.current.find(route => route.path === currentUrl);
    }, [currentUrl])

    if (currentUrl === undefined) {
        return <p>Loading...</p>
    }


    return (
        <LoaderDadaContext.Provider value={loaderData}>
            {matchingRoute?.component}
        </LoaderDadaContext.Provider>
    );
}

