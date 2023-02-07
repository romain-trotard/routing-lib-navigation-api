import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useRouterContext } from "./RouterProvider";


function useEffectEvent(cb: Function) {
    const cbRef = useRef(cb);

    useLayoutEffect(() => {
        cbRef.current = cb;
    });

    return useCallback(() => {
        return cbRef.current.apply(undefined, arguments);
    }, []);
}

export default function usePrompt({
    when,
    promptUser,
    message = 'Are you sure you want to leave? You will lose unsaved changes',
}: { message?: string, when: boolean, promptUser: () => Promise<boolean> }) {
    const { registerBlockingRoute } = useRouterContext();
    const shouldPrompt = useEffectEvent(() => when);
    const promptUserEffectEvent = useEffectEvent(promptUser);

    useEffect(() => {
        return registerBlockingRoute({
            customPromptBeforeLeaveModal: promptUserEffectEvent,
            message: message,
            shouldPrompt,
        });
    }, [registerBlockingRoute, shouldPrompt]);
}

