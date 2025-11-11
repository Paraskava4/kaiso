"use client";
import { Provider, useSelector } from "react-redux";
import store from "@/redux/store";
import { createTheme, ThemeProvider } from "@mui/material";
import { poppins } from "@/utils/fonts";
import { AccessProvider } from "@/utils/constants/accessContext";
import HeaderClientWrapper from "./layout/HeaderClientWrapper";
import BrowserExtensionCleanup from "./layout/BrowserExtensionCleanup";
import LayoutHandler from "./layout/LayoutHandler";
import CreateReport from "./shared/modal/createReport";
import ImportReport from "./shared/modal/importReport";
import CreateArticle from "./shared/modal/createArticle";
import ImportArticle from "./shared/modal/importArticle";
import { memo, useEffect, useState } from "react";
import { LoadingBarProvider } from "@/contexts/LoadingBarContext";
import GlobalLoadingBar from "@/components/LoadingBar";
import TawkToChat from "./shared/LiveChat/TawkToChat";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { useRouter } from "next/navigation";

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

export default function ClientProviders({ children }) {
    const router = useRouter();

    const [showChat, setShowChat] = useState(() => {
        // Default to true (show chatbot) unless it's an admin route
        if (typeof window === "undefined") return true; // Default for SSR
        const isHiddenRoute = router.asPath?.startsWith("/admin") || router.asPath?.startsWith("/dashboard") || router.asPath?.startsWith("/auth");
        return !isHiddenRoute;
    });
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

    return (
        <LoadingBarProvider>
            <GoogleAnalytics />
            <GlobalLoadingBar />
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <AccessProvider>
                        <BrowserExtensionCleanup />
                        <ModalHandler />
                        <LayoutHandler>{children}</LayoutHandler>
                        {showChat && chatReady && <TawkToChat />}
                    </AccessProvider>
                </ThemeProvider>
            </Provider>
        </LoadingBarProvider>
    );
}
