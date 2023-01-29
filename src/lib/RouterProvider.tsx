import React, { useContext, useMemo, useSyncExternalStore } from 'react';
import createBrowserRouter, { type RouterState } from './createBrowserRouter';

type RouterType = ReturnType<typeof createBrowserRouter>;

type RouterContextProps = Pick<RouterType, 'navigate' | 'registerBlockingRoute'>

const RouterContext = React.createContext<RouterContextProps | null>(null);
const RouterDataContext = React.createContext<RouterState | null>(null);

export const useRouterContext = () => {
    const contextValue = useContext(RouterContext);

    if (contextValue === null) {
        throw new Error('Should put a `RouterProvider` at the top of your application');
    }

    return contextValue;
}

export const useRouterDataContext = () => {
    const contextValue = useContext(RouterDataContext);

    if (contextValue === null) {
        throw new Error('Should put a `RouterProvider` at the top of your application');
    }

    return contextValue;
}

export default function RouterProvider({ router }: { router: RouterType }) {
    const state = useSyncExternalStore(router.subscribe, () => router.state, () => router.state);

    const routerContextValue = useMemo(() => ({
        navigate: router.navigate,
        registerBlockingRoute: router.registerBlockingRoute
    }), [router.navigate, router.registerBlockingRoute]);

    return (
        <RouterContext.Provider value={routerContextValue}>
            <RouterDataContext.Provider value={state}>
                {state.initialized ? state.matchingRoute?.component ?? null : <p>Loading the application</p>}
            </RouterDataContext.Provider>
        </RouterContext.Provider>
    )
}

