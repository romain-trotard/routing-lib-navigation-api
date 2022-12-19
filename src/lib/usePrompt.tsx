import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { NavigateEvent } from "../WindowOverride";


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
    const shouldPrompt = useEffectEvent(() => when);
    const promptUserEffectEvent = useEffectEvent(promptUser);

    useEffect(() => {
        const listener = async (event: NavigateEvent) => {
            if (event.canIntercept && shouldPrompt() && !event.info?.forceNavigate) {
                event.preventDefault();
                const shouldContinue = await promptUserEffectEvent();

                if (shouldContinue) {
                    window.navigation.navigate(event.destination.url, {
                        history: 'push',
                        state: event.destination.state,
                        info: { forceNavigate: true, ...event.info },
                    });
                }
            }
        }

        window.navigation.addEventListener('navigate', listener);

        return () => {
            window.navigation.removeEventListener('navigate', listener);
        }
    }, [shouldPrompt, promptUserEffectEvent])

    // Add event listener, for:
    // - reload of page
    // - going to other origin
    // - closing tab
    useEffect(() => {
        const listener = (event: BeforeUnloadEvent) => {
            if (shouldPrompt()) {
                event.preventDefault();
                return event.returnValue = message;
            }
        }

        window.addEventListener('beforeunload', listener);

        return () => {
            window.removeEventListener('beforeunload', listener);
        }
    }, [shouldPrompt, message]);
}

