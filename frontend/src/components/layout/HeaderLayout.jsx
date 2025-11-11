"use client";

import SubHeader from "./SubHeader.jsx";
import Header from "./Header.jsx";
import { useScrollPosition, useClientOnly } from "../../hooks/useClientOnly";
import { HydrationSafe } from "../ui";
import { usePathname } from "next/navigation.js";

const HeaderLayout = () => {
    const isClient = useClientOnly();
    const scrollY = useScrollPosition();
    const isScrolled = isClient && scrollY > 0;
    const pathname = usePathname()?.split("/");

    // if (pathname?.startsWith("/auth")) return null;
    return (
        <HydrationSafe
            className="header-layout"
            fallback={
                <div className="header-layout">
                    <SubHeader />
                    <Header />
                </div>
            }
        >
            <SubHeader />
            <div className={`header-layout ${isScrolled ? "scrolled" : ""}`}>
                <Header searchPosition={isScrolled} />
            </div>
        </HydrationSafe>
    );
};

export default HeaderLayout;
