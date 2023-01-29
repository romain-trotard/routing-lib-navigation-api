import { useRouterContext } from "./RouterProvider";

export default function useNavigate() {
    const { navigate } = useRouterContext();

    return navigate;
}

