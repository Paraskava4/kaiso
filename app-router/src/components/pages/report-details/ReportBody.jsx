"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Lazy load heavy report components
const ReportOverview = dynamic(() => import("./components/ReportOverview"), {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const MarketResearchWidget = dynamic(() => import("./components/MarketResearchWidget"), {
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});


export default function ReportBody({ report }) {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 930);
        };

        handleResize(); // Set initial value
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="w-full bg-[#ffffff]" data-section="report-body">
            {/* Responsive container with 86% width */}
            <div className="w-[80%] mx-auto mt-4 2xl:max-w-[83.5%]">
                {/* Conditional layout based on screen size */}
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start w-full">
                    {/* Main Report Content */}
                    <div
                        className="w-full lg:flex-1 lg:max-w-[75%] xl:max-w-[78%] 2xl:max-w-[80%]"
                        style={{
                            fontSize: "clamp(13px, 2.5vw, 15px)",
                            letterSpacing: "clamp(0.2px, 0.1vw, 0.3px)",
                        }}
                    >
                        <ReportOverview report={report} />
                    </div>

                    {/* Right Sidebar */}
                    <aside
                        className="w-full lg:w-[25%] xl:w-[22%] 2xl:w-[20%] min-w-[260px] max-w-[100%]"
                        style={{ position: "sticky", top: "80px", marginBottom:"20px", zIndex: 0 }}
                    >
                        <MarketResearchWidget report={report} similarReports={report?.similarReports || []} />
                    </aside>
                </div>
            </div>
        </div>
    );
}
