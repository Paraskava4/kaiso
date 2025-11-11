"use client";
import { usePathname } from "next/navigation";
import { HeaderLayout } from "./index.jsx";

export default function HeaderClientWrapper() {
    const pathname = usePathname();
    if (pathname?.startsWith("/admin")) return null;
    return <HeaderLayout />
}
