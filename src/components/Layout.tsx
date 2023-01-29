import { ReactNode } from "react";
import { Spinner } from '@chakra-ui/react';
import useNavigationInProgress from "../lib/useNavigationInProgress";
import Navigation from "./Navigation";

export default function Layout({ children }: { children: ReactNode }) {
    const navigationInProgress = useNavigationInProgress();

    return (
        <div>
            <Navigation />
            {navigationInProgress && <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <Spinner />
            </div>}
            {children}
        </div>
    )
}
