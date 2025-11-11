"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useLoadingBar } from "@/contexts/LoadingBarContext";

const LoadingBar = dynamic(() => import("react-top-loading-bar"), { ssr: false });

const setupGlobalErrorHandling = (loadingBarRef) => {
    // Setup global error handling for the loading bar
    const handleError = () => loadingBarRef.current?.complete();
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    // Return cleanup function
    return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleError);
    };
};

export default function GlobalLoadingBar() {
    const { loadingBarRef, completeLoading } = useLoadingBar();
    const pathname = usePathname();

    useEffect(() => {
        const cleanupErrorHandling = setupGlobalErrorHandling(loadingBarRef);

        // Complete loading bar on pathname change after a short delay
        const timer = setTimeout(() => {
            completeLoading();
        }, 500);

        return () => {
            clearTimeout(timer);
            cleanupErrorHandling();
        };
    }, [pathname, completeLoading, loadingBarRef]);

    return <LoadingBar color="#D62035" ref={loadingBarRef} height={3} />;
}

