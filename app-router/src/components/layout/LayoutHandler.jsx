"use client";
import { usePathname } from "next/navigation";
import ProtectedRoute from "./wrapper/protectedRoute";
import {  poppins } from "@/utils/fonts";
import HeaderClientWrapper from "./HeaderClientWrapper";

function LayoutHandler({ children }) {
    const pathname = usePathname() || "";
    const pathSegments = pathname.split("/").filter(Boolean);

    const isAuthProtected = pathname.startsWith("/admin");
    const isAuthPages = pathname.startsWith("/auth");

    if (isAuthProtected) {
        return (
            <ProtectedRoute>
                {children}
            </ProtectedRoute>
        );
    }

    if (isAuthPages) {
        return <>{children}</>
    }

    return (
        <div className={`${poppins.variable} ${poppins.className}`}>
            <HeaderClientWrapper />
            {children}
        </div>
    );
}

export default LayoutHandler;
