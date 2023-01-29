import { useRouterDataContext } from "./RouterProvider";

export default function useNavigationInProgress() {
    const { navigationInProgress } = useRouterDataContext();

    return navigationInProgress;
}

