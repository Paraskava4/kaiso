
"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import SampleReportForm from "../../../forms/SampleReportForm";
import { usePathname, useSearchParams, useRouter, useParams } from "next/navigation";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

import { BASE_URL } from "../../../../../config";
import { useButtonNames } from "../../../../hooks/useButtonNames";
import { getLocalStorage, getSessionStorage, setSessionStorage } from "@/utils/localStorage";
import useHash from "@/utils/hooks/useHash";

const ReportOverview = (reportData) => {
    const pathname = usePathname();
    const [report, setReport] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [showForm, setShowForm] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const searchParams = useSearchParams();
    const params = useParams();
    const router = useRouter();

    const contentRef = useRef(null);
    const tabRefs = useRef({});

    // Get hash from URL
    const getHash = () => {
        return window.location.hash.replace("#", "") || getLocalStorage("persistedHash") || "overview";
    };


    // Custom hook to handle hash-based redirect
    const redirect = (hash) => {
        window.location.hash = hash;
    };

    // Fetch button names
    const { buttonNames, loading: buttonLoading, error: buttonError } = useButtonNames();

    // Fetch report data on mount
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await fetch(`${BASE_URL}/web/getReport`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();
                if (result.data && result.data.length > 0) {
                    setReport(result.data[0]);
                } else {
                    console.error("No report data found");
                }
            } catch (error) {
                console.error("Failed to fetch report:", error);
            }
        };

        fetchReport();
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return; // Skip on server

        const storedHash = getSessionStorage("persistedHash");
        if (storedHash && ["overview", "toc", "methodology", "sample", "#overview", "#toc", "#methodology", "#sample"].includes(storedHash)) {
            if (storedHash === "sample") {
                setShowForm(true);
                setActiveTab("overview"); // Fallback for renderContent
            } else {
                setShowForm(false);
                setActiveTab(storedHash);
            }
            if (!window.location.hash) {
                window.location.hash = storedHash;
            }
        }
    }, []);

    // Animate content when activeTab or showForm changes
    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
        }
    }, [activeTab, showForm]);

    // Handle hash changes
    useEffect(() => {
        const handleHashChange = () => {
            const tabName = getHash();
            if (tabName === "sample") {
                setShowForm(true);
                setActiveTab("overview"); // fallback so renderContent works
            } else if (tabName) {
                setShowForm(false);
                setActiveTab(tabName);
            } else {
                setShowForm(false);
                setActiveTab("overview");
            }
        };

        // Initial hash check
        handleHashChange();

        // Listen for hash changes
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const tabs = [
        { id: "overview", label: "Report Overview", shortLabel: "Overview", icon: "📊" },
        { id: "toc", label: "Table of Contents", shortLabel: "Contents", icon: "📋" },
        { id: "methodology", label: "Methodology", shortLabel: "Research", icon: "🔬" },
        { id: "sample", label: "Request Sample", shortLabel: "Sample", icon: "📄" },
    ];

    const handleTabClick = (tabId) => {
        redirect(tabId);
        setSessionStorage("persistedHash", tabId);
        setShowMobileMenu(false); // close dropdown on mobile
    };

    const cleanHtmlReportOverview = DOMPurify.sanitize(reportData?.report?.reportOverview);
    const cleanHtmlTableOfContent = DOMPurify.sanitize(reportData?.report?.tableOfContent);
    const cleanHtmlResearchMethodology = DOMPurify.sanitize(reportData?.report?.researchMethodology ?? report?.researchMethodology);

    // Memoize parsed HTML to avoid re-parsing on every render
    const parsedOverview = useMemo(() => (cleanHtmlReportOverview ? parse(cleanHtmlReportOverview) : null), [cleanHtmlReportOverview]);
    const parsedToc = useMemo(() => (cleanHtmlTableOfContent ? parse(cleanHtmlTableOfContent) : null), [cleanHtmlTableOfContent]);
    const parsedMethodology = useMemo(() => (cleanHtmlResearchMethodology ? parse(cleanHtmlResearchMethodology) : null), [cleanHtmlResearchMethodology]);

    const LoadingSkeleton = () => (
        <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
    );

    const renderContent = () => {
        if (showForm) return <SampleReportForm reportData={reportData} />

        switch (activeTab) {
            case "overview":
                if (parsedOverview) return <div className="ql-editor prose">{parsedOverview}</div>;
                return <LoadingSkeleton />;
            case "toc":
                if (parsedToc) return <div className="ql-editor prose">{parsedToc}</div>;
                return <>Not available...</>;
            case "methodology":
                if (parsedMethodology) return <div className="ql-editor prose">{parsedMethodology}</div>;
                // Show skeleton while waiting for methodology (may arrive from fallback fetch)
                return <LoadingSkeleton />;
            default:
                return null;
        }
    };

    const TabNavigation = () => (
        <>
            {/* Desktop */}
            <nav className="hidden xl:flex relative gap-4 items-end w-full" style={{ fontSize: "14px" }}>
                {tabs.slice(0, 3).map((tab) => (
                    <button
                        key={tab.id}
                        ref={(el) => (tabRefs.current[tab.id] = el)}
                        onClick={() => handleTabClick(tab.id)}
                        className={`flex relative gap-2.5 justify-center items-center cursor-pointer px-0 py-3 flex-1 rounded-t-lg transition-all text-md
              ${activeTab === tab.id && !showForm ? "bg-white border-x border-t border-zinc-600 border-b-0" : "border-b border-transparent"}`}
                    >
                        <span className={`${activeTab === tab.id && !showForm ? "text-sky-900 font-medium text-sm" : "text-zinc-700"}`}>{tab.label}</span>
                    </button>
                ))}
            </nav>

            {/* Large Tablet */}
            <nav className="hidden lg:flex xl:hidden relative gap-3 items-end w-full">
                {tabs.slice(0, 3).map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`flex relative gap-2 justify-center items-center cursor-pointer px-4 py-2.5 flex-1 rounded-t-lg transition-all text-sm
              ${activeTab === tab.id && !showForm ? "bg-white border-x border-t border-zinc-600 border-b-0" : "border-b border-transparent"}`}
                    >
                        <span className={`${activeTab === tab.id && !showForm ? "text-sky-900 font-medium text-sm" : "text-zinc-700"}`}>{tab.shortLabel}</span>
                    </button>
                ))}
            </nav>

            {/* Medium Tablet */}
            <nav className="hidden md:flex lg:hidden relative gap-2 items-end w-full">
                {tabs.slice(0, 3).map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`flex relative gap-1 justify-center items-center cursor-pointer px-3 py-2 flex-1 rounded-t-lg transition-all text-xs
              ${activeTab === tab.id && !showForm ? "bg-white border-x border-t border-zinc-600 border-b-0" : "border-b border-transparent"}`}
                    >
                        <span className={`${activeTab === tab.id && !showForm ? "text-sky-900 font-medium text-sm" : "text-zinc-700"}`}>{tab.shortLabel}</span>
                    </button>
                ))}
            </nav>

            {/* Small Tablet */}
            <nav className="hidden sm:flex md:hidden relative gap-1 items-end w-full">
                {tabs.slice(0, 3).map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`flex relative justify-center items-center cursor-pointer px-2 py-1.5 flex-1 rounded-t-lg transition-all text-xs
              ${activeTab === tab.id && !showForm ? "bg-white border-x border-t border-zinc-600 border-b-0" : "border-b border-transparent"}`}
                    >
                        <span className={`${activeTab === tab.id && !showForm ? "text-sky-900 font-medium text-sm" : "text-zinc-700"}`}>{tab.shortLabel}</span>
                    </button>
                ))}
            </nav>

            {/* Mobile */}
            <div className="sm:hidden relative">
                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="flex items-center justify-between w-full px-2 py-2 bg-white border border-zinc-300 rounded-lg text-xs"
                >
                    <span className="font-medium text-zinc-700 truncate">
                        {showForm ? "Request Sample" : tabs.find((tab) => tab.id === activeTab)?.shortLabel || "Menu"}
                    </span>
                    <div className="flex space-x-0.5 ml-2">
                        <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
                    </div>
                </button>
                {showMobileMenu && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-300 rounded-lg shadow-lg z-20">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                className={`w-full flex items-center px-2 py-2 text-left hover:bg-zinc-50 transition-colors text-xs
                  ${(activeTab === tab.id && !showForm) || (showForm && tab.id === "sample") ? "bg-blue-50 text-sky-900" : "text-zinc-700"}
                  ${index === 0 ? "rounded-t-lg" : ""} ${index === tabs.length - 1 ? "rounded-b-lg" : ""}`}
                            >
                                <span className="text-sm mr-2">{tab.icon}</span>
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );

    const SampleRequestButton = () => (
        <>
            <button
                onClick={() => handleTabClick("sample")}
                className="hidden xl:flex relative gap-2.5 justify-center items-center px-5 py-3 bg-[#5CB2DC] rounded-t-xl h-[49px] w-[280px] cursor-pointer"
            >
                <span className="text-[14px] font-semibold text-white">
                    {buttonNames?.requestButton || "Request a sample"}
                    {/* Request a sample */}
                </span>
            </button>
            <button
                onClick={() => handleTabClick("sample")}
                className="hidden lg:flex xl:hidden gap-2 justify-center items-center px-4 py-2.5 bg-[#5CB2DC] rounded-t-xl h-12 w-40"
            >
                <span className="text-base font-semibold text-white">{buttonNames?.requestButton?.split(" ").slice(0, 2).join(" ") || "Request Sample"}</span>
            </button>
            <button
                onClick={() => handleTabClick("sample")}
                className="hidden md:flex lg:hidden gap-1 justify-center items-center px-3 py-2 bg-[#5CB2DC] rounded-t-xl h-10 w-28"
            >
                <span className="text-sm font-semibold text-white">{buttonNames?.requestButton?.split(" ")[0] || "Sample"}</span>
            </button>
            <button
                onClick={() => handleTabClick("sample")}
                className="hidden sm:flex md:hidden justify-center items-center px-2 py-1.5 bg-[#5CB2DC] rounded-t-xl h-8 w-20"
            >
                <span className="text-xs font-semibold text-white">Sample</span>
            </button>
        </>
    );

    return (
        <div className="w-full bg-white rounded-lg shadow-sm" style={{ border: "1px solid lightgrey", marginTop: "-0.5%" }}>
            <header className="border-b border-zinc-300">
                <div className="px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 pt-2 sm:pt-3 md:pt-4 lg:pt-5 xl:pt-4 pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                        <div className="flex-1 min-w-0">
                            <TabNavigation />
                        </div>
                        <div className="w-full sm:w-auto">
                            <SampleRequestButton />
                        </div>
                    </div>
                </div>
            </header>
            <div ref={contentRef} className="px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-2 sm:py-3 md:py-4 lg:py-5 xl:py-6">
                <div className="prose prose-sm md:prose-base max-w-none">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ReportOverview;
