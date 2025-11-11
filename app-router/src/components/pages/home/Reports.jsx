"use client";
import React, { useState, useEffect } from "react";
import ReportsHeader from "./ReportsHeader";
import ReportsList from "./ReportsList";
import Image from "next/image";

const Reports = ({ reportsData, isLoading }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 426);
        };

        handleResize(); // Set initial value
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <section className="reports-section relative">
            {/* Background image - hidden on mobile */}
            {!isMobile && (
                <div className="reports-background absolute inset-0 visible md::hidden">
                    <Image src="/images/Reports-bg.webp" alt="" fill className="object-cover" priority quality={100} sizes="100vw" />
                </div>
            )}
            {/* Content container */}
            <div className="reports-content relative z-10">
                <ReportsHeader />
                <ReportsList reportsData={reportsData} isLoading={isLoading} />
            </div>
        </section>
    );
};

export default Reports;
