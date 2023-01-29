import { useRouterDataContext } from './RouterProvider';

export default function useLoaderData<T>() {
    const state = useRouterDataContext();

    return state.loaderData as T;
}

