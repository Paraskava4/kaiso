"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Footer } from "@/components";
import InquireBeforeBuyHeader from "@/components/pages/inquiry-before-buy/InquireBeforeBuyHeader";
import InquireBeforeBuySidemenu from "@/components/pages/inquiry-before-buy/InquireBeforeBuySidemenu";
import { mockReports } from "@/data/mockReports";
import Breadcrumb from "@/components/pages/shared/Breadcrumb";
import InquiryForm from "@/components/forms/InquiryForm";

const InquireBeforeBuy = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [report, setReport] = useState(null);
    const [breadcrumbTitle, setBreadcrumbTitle] = useState("");
    const [breadcrumbCategory, setBreadcrumbCategory] = useState("");

    // Set SEO metadata for Inquiry Before Buy page - no fallback text (no API data available for inquiry)
    // Inquiry page doesn't have specific API data, so no SEO metadata will be set

    useEffect(() => {
        // Load title and category from localStorage
        const storedTitle = localStorage.getItem("reportBreadcrumbTitle");
        const storedCategory = localStorage.getItem("reportBreadcrumbCategory");

        if (storedTitle) setBreadcrumbTitle(storedTitle);
        if (storedCategory && storedCategory !== "null") setBreadcrumbCategory(storedCategory);

        // Load report data
        try {
            const storedReport = localStorage.getItem("inquiryReport");
            if (storedReport) {
                const parsedReport = JSON.parse(storedReport);
                if (parsedReport && parsedReport.id && String(parsedReport.id) === String(id)) {
                    setReport(parsedReport);
                    return;
                }
            }
        } catch (error) {
            console.error("Error loading report:", error);
        }

        // Fallback if report not found in localStorage
        const fallback = mockReports.find((r) => String(r.id) === String(id));
        setReport(fallback || null);
    }, [id]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Breadcrumb */}
            <div className="w-full py-4 sm:pt-6 text-[12px] font-[500] text-gray-500">
                <div className="max-w-[80%] mx-auto">
                    <Breadcrumb
                        items={[
                            { label: "Reports", href: "/report-store" },
                            ...(breadcrumbCategory
                                ? [
                                      {
                                          label: breadcrumbCategory,
                                          href: `/report-store/${breadcrumbCategory.toLowerCase().replace(/\s+/g, "-")}`,
                                      },
                                  ]
                                : []),
                            ...(breadcrumbTitle
                                ? [
                                      {
                                          label: breadcrumbTitle.length > 20 ? `${breadcrumbTitle.slice(0, 20)}...` : breadcrumbTitle,
                                          href: "#",
                                      },
                                  ]
                                : []),
                        ]}
                    />
                </div>
            </div>

            <InquireBeforeBuyHeader report={report} />

            <section className="flex-1 w-full">
                <div className="max-w-[84.4%] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                        <div className="w-full lg:flex-1">
                            <InquiryForm />
                        </div>
                        <div className="w-full lg:w-[400px] lg:flex-shrink-0">
                            <InquireBeforeBuySidemenu report={report} />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default InquireBeforeBuy;
