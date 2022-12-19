import { ReactNode } from "react";
import Navigation from "./Navigation";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div>
            <Navigation />
            {children}
        </div>
    )
}
