import "@/styles/globals.css";
import Head from "next/head";
import { useEffect, useRef, useState, memo } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Provider, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";

// Lazy load heavy components
const LayoutHandler = dynamic(() => import("@/components/layout/LayoutHandler"), { ssr: true });
const CreateReport = dynamic(() => import("@/components/shared/modal/createReport"), { ssr: false });
const ImportReport = dynamic(() => import("@/components/shared/modal/importReport"), { ssr: false });
const CreateArticle = dynamic(() => import("@/components/shared/modal/createArticle"), { ssr: false });
const ImportArticle = dynamic(() => import("@/components/shared/modal/importArticle"), { ssr: false });
const TawkToChat = dynamic(() => import("@/components/shared/LiveChat/TawkToChat"), { ssr: false });
const ServiceWorkerStatus = dynamic(() => import("@/components/shared/ServiceWorkerStatus"), { ssr: false });
// const MetaTags = dynamic(() => import("@/redux/meta/MetaTags"), { ssr: true });

// Import store and other utilities
import store from "@/redux/store";
import { setupGlobalErrorHandling } from "@/utils/networkError";
import { AccessProvider } from "@/utils/constants/accessContext";
import LoadingBar from "react-top-loading-bar";
import { useGetNavbarDataQuery } from "@/api/navbar";
import { isStatusInclude } from "@/utils/axiosInstance";

import { poppins } from "@/utils/fonts";
import UniversalSEO from "@/utils/seo/universalSEO";

// Service Worker registration
import { registerServiceWorker } from '@/utils/serviceWorker';

if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        registerServiceWorker();
    });
}

// Memoized ModalHandler for better performance
const ModalHandler = memo(() => {
    const modal = useSelector((state) => state?.modal);
    return (
        <>
            {modal?.createReport?.open && <CreateReport data={modal?.createReport} />}
            {modal?.importReport?.open && <ImportReport />}
            {modal?.createArticle?.open && <CreateArticle data={modal?.createArticle} />}
            {modal?.importArticle?.open && <ImportArticle />}
        </>
    );
});

ModalHandler.displayName = "ModalHandler";

// Memoized theme to prevent recreation on every render
const theme = createTheme({
    typography: {
        fontFamily: poppins.style.fontFamily,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                // Local @font-face in globals.css
            },
        },
    },
});

// Defer Toaster rendering until browser is idle to reduce initial work
const DeferredToaster = memo(() => {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        let idleId;
        const onIdle = () => setReady(true);
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            idleId = window.requestIdleCallback(onIdle, { timeout: 2000 });
        } else {
            const timeoutId = setTimeout(onIdle, 1200);
            idleId = { cancel: () => clearTimeout(timeoutId) };
        }
        return () => {
            if (idleId) {
                if (typeof idleId === "number" && window.cancelIdleCallback) {
                    window.cancelIdleCallback(idleId);
                } else if (idleId.cancel) {
                    idleId.cancel();
                }
            }
        };
    }, []);
    if (!ready) return null;
    return <Toaster position="top-right" reverseOrder={false} />
});

// Memoized MyApp component for better performance
const MyApp = memo(({ Component, pageProps, seoData }) => {
    const router = useRouter();
    const loadingBarRef = useRef(null);

    // Use canonical URL hook to ensure canonical URLs match current route
    // Temporarily disabled to fix reload loop
    // useCanonicalUrl();

    // Initialize Core Web Vitals reporting

    // Initialize showChat based on the initial route
    const [showChat, setShowChat] = useState(() => {
        // Default to true (show chatbot) unless it's an admin route
        if (typeof window === "undefined") return true; // Default for SSR
        const isHiddenRoute = router.asPath?.startsWith("/admin") || router.asPath?.startsWith("/dashboard") || router.asPath?.startsWith("/auth");
        return !isHiddenRoute;
    });

    // Defer chat mount until browser is idle (improves first render time)
    const [chatReady, setChatReady] = useState(false);
    useEffect(() => {
        if (!showChat) {
            setChatReady(false);
            return;
        }
        let idleId;
        const onIdle = () => setChatReady(true);
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            idleId = window.requestIdleCallback(onIdle, { timeout: 2000 });
        } else {
            // Fallback if requestIdleCallback is unavailable
            const timeoutId = setTimeout(onIdle, 1500);
            idleId = { cancel: () => clearTimeout(timeoutId) };
        }
        return () => {
            if (idleId) {
                if (typeof idleId === "number" && window.cancelIdleCallback) {
                    window.cancelIdleCallback(idleId);
                } else if (idleId.cancel) {
                    idleId.cancel();
                }
            }
        };
    }, [showChat]);

    // Defer MetaTags render until idle to trim initial work
    const [metaReady, setMetaReady] = useState(false);
    useEffect(() => {
        let idleId;
        const onIdle = () => setMetaReady(true);
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            idleId = window.requestIdleCallback(onIdle, { timeout: 2000 });
        } else {
            const timeoutId = setTimeout(onIdle, 1200);
            idleId = { cancel: () => clearTimeout(timeoutId) };
        }
        return () => {
            if (idleId) {
                if (typeof idleId === "number" && window.cancelIdleCallback) {
                    window.cancelIdleCallback(idleId);
                } else if (idleId.cancel) {
                    idleId.cancel();
                }
            }
        };
    }, []);

    // Loading bar setup and route change handling
    useEffect(() => {
        setupGlobalErrorHandling();

        const handleStart = () => loadingBarRef.current?.continuousStart();
        const handleComplete = () => loadingBarRef.current?.complete();

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleComplete);
        router.events.off("routeChangeError", handleComplete);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
        };
    }, [router]);

    // Update showChat when the route changes (temporarily disabled to prevent reload loops)
    // useEffect(() => {
    //     const isHiddenRoute = router.asPath?.startsWith("/admin") || router.asPath?.startsWith("/dashboard") || router.asPath?.startsWith("/auth");

    //     setShowChat(!isHiddenRoute);
    // }, [router.asPath]);

    const defaultSEO = {
        seoTitle: "Kaiso Research - Insights & Reports",
        metaDescription: "Discover industry insights, research reports, and data-driven analysis from Kaiso Research.",
        canonicalUrl: "https://kaiso.com", // fallback domain
    };

    return (
        <>
            <Provider store={store}>
                {/* {metaReady && <MetaTags />} */}
                {/* <UniversalSEO seoData={defaultSEO} /> */}
                <ThemeProvider theme={theme}>
                    <AccessProvider>
                        <LoadingBar color="#D62035" ref={loadingBarRef} height={3} />
                        <ModalHandler />
                        <LayoutHandler Component={Component} pageProps={pageProps} />
                        <DeferredToaster />
                        {/* Show chat only on user-facing pages, after idle */}
                        {showChat && chatReady && <TawkToChat />}
                        {/* Service Worker status (development only) */}
                        <ServiceWorkerStatus show={process.env.NODE_ENV === 'development'} />
                    </AccessProvider>
                </ThemeProvider>
            </Provider>
        </>
    );
});

// Set display name for debugging
MyApp.displayName = "MyApp";

export default MyApp;
