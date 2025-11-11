"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import OtherInquiryForm from "../../../shared/OtherInquiryForm";
import Footer from "../../../layout/Footer";
import InquireBeforeBuySidemenu from "../../inquiry-before-buy/InquireBeforeBuySidemenu";

export default function CustomReportForm() {
    const searchParams = useSearchParams();

    // Get report info from URL parameters
    const reportCode = searchParams.get("reportCode") || "Unknown Report";
    const reportTitle = searchParams.get("reportTitle") || "Unknown Title";
    const reportId = searchParams.get("reportId") || "Unknown id";
    const url = searchParams.get("url") || "Unknown id";

    // Decode URL parameters in case they contain special characters
    const decodedReportCode = decodeURIComponent(reportCode);
    const decodedReportTitle = decodeURIComponent(reportTitle);

    // Create page name for the form
    const pageName = `${decodedReportCode}. ${decodedReportTitle}`;
    console.log("reportId", reportId);
    return (
        <div className="min-h-screen">
            {/* Title Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <h1 className="text-md sm:text-md font-semibold">{reportTitle}</h1>
            </div>

            {/* Form + Sidebar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row gap-8">
                {/* Form Section */}
                <div className="w-full mt-13 lg:w-2/3">
                    <OtherInquiryForm
                        title="Request Custom Report"
                        type="Need Customization"
                        isOpen={true}
                        buttonText="Submit Custom Report Request"
                        successMessage="Your custom report request has been submitted successfully! Our team will contact you soon."
                        pageName={pageName}
                        isExpandedView={true}
                    />
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-1/3 mt-4 lg:mt-12">
                    <InquireBeforeBuySidemenu reportId={reportId} url={url} />
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
