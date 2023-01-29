import { useCallback } from "react";

export default function useNavigate() {
    return useCallback(
        (url: string,
            { replaceMode = false, info }: { replaceMode?: boolean, info?: any } = {}
        ) => {
            window.navigation.navigate(url, { history: replaceMode ? 'replace' : 'push', info });
        }, []);
}

