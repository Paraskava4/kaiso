// /src/admin/pages/index.jsx
"use client";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SitePagesPanel from "./SitePagesPanel";
import SiteMenuPanel from "./SiteMenuPanel";
import SEOEditorPanel from "./SEOEditorPanel";
import { setAllSiteData, setLoading, setError } from "../../../redux/pages/pagesSlice";
import { fetchAndProcessAllSiteData } from "../../../api/pages";
import { toast } from "react-hot-toast";

const Pages = () => {
    const dispatch = useDispatch();
    const pages = useSelector((state) => state.pages.pages);
    const menus = useSelector((state) => state.pages.menus);
    const loading = useSelector((state) => state.pages.loading);
    const error = useSelector((state) => state.pages.error);

    // Use ref to track if we've already attempted to load data to prevent infinite loops
    const hasAttemptedLoad = useRef(false);
    const hasLoggedError = useRef(false);

    // Add global error handler for unhandled promise rejections
    useEffect(() => {
        const handleUnhandledRejection = (event) => {
            // Prevent Next.js error panel for network-related errors
            if (
                event.reason?.response?.status === 404 ||
                event.reason?.code === "NETWORK_ERROR" ||
                event.reason?.message?.includes("Network Error") ||
                event.reason?.message?.includes("Failed to fetch")
            ) {
                event.preventDefault();
                console.error("Prevented unhandled promise rejection:", event.reason);
            }
        };

        window.addEventListener("unhandledrejection", handleUnhandledRejection);

        return () => {
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
    }, []);

    useEffect(() => {
        // Load all site data once when the component mounts
        // Only attempt if we haven't tried before and we don't have data and not currently loading
        if (!hasAttemptedLoad.current && pages.length === 0 && menus.length === 0 && !loading) {
            hasAttemptedLoad.current = true; // Mark that we've attempted to load

            const loadAllData = async () => {
                dispatch(setLoading(true));

                const result = await fetchAndProcessAllSiteData();

                if (result.success) {
                    const { pages: pagesData, menus: menusData, subMenus: subMenusData } = result.data;
                    dispatch(
                        setAllSiteData({
                            pages: pagesData,
                            menus: menusData,
                            subMenus: subMenusData,
                        })
                    );
                } else {
                    // Handle error result without throwing
                    if (!hasLoggedError.current) {
                        console.error("Failed to load site data:", result.error);
                        hasLoggedError.current = true;

                        // Show user-friendly toast message
                        if (result.error?.status === 404) {
                            toast.error("Network error: Unable to connect to server. Please check your connection and reload the page.");
                        } else if (result.error?.code === "NETWORK_ERROR" || result.error?.message?.includes("Network Error")) {
                            toast.error("Network error: Unable to connect to server. Please check your connection and reload the page.");
                        } else {
                            toast.error("Failed to load page data. Please reload the page to try again.");
                        }
                    }
                    dispatch(setError("Failed to load site data"));
                }

                dispatch(setLoading(false));
            };

            // Call the async function (no need for catch since we don't throw errors anymore)
            loadAllData();
        }
    }, [dispatch, pages.length, menus.length, loading]);

    // Manual retry function
    const handleRetry = () => {
        hasAttemptedLoad.current = false;
        hasLoggedError.current = false;
        dispatch(setError(null));

        const loadAllData = async () => {
            dispatch(setLoading(true));

            const result = await fetchAndProcessAllSiteData();

            if (result.success) {
                const { pages: pagesData, menus: menusData, subMenus: subMenusData } = result.data;
                dispatch(
                    setAllSiteData({
                        pages: pagesData,
                        menus: menusData,
                        subMenus: subMenusData,
                    })
                );
                toast.success("Page data loaded successfully!");
            } else {
                // Handle error result without throwing
                if (!hasLoggedError.current) {
                    console.error("Failed to load site data:", result.error);
                    hasLoggedError.current = true;

                    // Show user-friendly toast message
                    if (result.error?.status === 404) {
                        toast.error("Network error: Unable to connect to server. Please check your connection and try again.");
                    } else if (result.error?.code === "NETWORK_ERROR" || result.error?.message?.includes("Network Error")) {
                        toast.error("Network error: Unable to connect to server. Please check your connection and try again.");
                    } else {
                        toast.error("Failed to load page data. Please try again.");
                    }
                }
                dispatch(setError("Failed to load site data"));
            }

            dispatch(setLoading(false));
        };

        // Call the async function (no need for catch since we don't throw errors anymore)
        loadAllData();
    };

    return (
        <div className="flex min-h-screen">
            {error && (
                <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
                    <div className="flex items-center justify-between">
                        <span className="text-sm">{error}</span>
                        <button onClick={handleRetry} className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700" disabled={loading}>
                            {loading ? "Loading..." : "Retry"}
                        </button>
                    </div>
                </div>
            )}
            <main className="flex w-full">
                <SitePagesPanel />
                <SiteMenuPanel />
                <SEOEditorPanel />
            </main>
        </div>
    );
};

export default Pages;
