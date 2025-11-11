"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BASE_URL } from "../../../../../config";
import { useButtonNames } from "../../../../hooks/useButtonNames";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { isValidArray } from "@/utils/validation/array";

export default function MarketResearchWidget({ report, similarReports = [], onReportSelect }) {
    const router = useRouter();
    const [apiSimilarReports, setApiSimilarReports] = React.useState([]);
    const { redirect } = useRouteRedirect();

    // Fetch button names
    const { buttonNames, loading: buttonLoading, error: buttonError } = useButtonNames();

    const handleInquiryBeforeBuy = () => {
        if (report) {
            localStorage.setItem("inquiryReport", JSON.stringify(report));
        }
        redirect(`inquiry-before-buy?id=${report?.id || ""}`);
    };

    const handleFreeConsultation = () => {
        console.log("report>>>>>>>>>", report?._id);
        const reportInfo = {
            reportCode: report?.reportCode || report?.reportNo || "Unknown Report",
            reportTitle: report?.reportTitle || report?.title || "Unknown Title",
            reportId: report?._id || "",
        };

        // Create URL with report info as query parameters
        const queryParams = new URLSearchParams({
            reportCode: reportInfo.reportCode,
            reportTitle: reportInfo.reportTitle,
            reportId: reportInfo?.reportId || "",
            url: report?.sco?.url,
        });

        // Navigate to the new custom report form page
        redirect(`custom-report-form?${queryParams.toString()}`);
    };

    const handleRequestSample = () => {
        // First scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Set hash to show sample form
        window.location.hash = "sample";
        
        // Wait for scroll to complete, then scroll to the form section
        setTimeout(() => {
            const sampleSection = document.querySelector('[data-section="sample"]');
            if (sampleSection) {
                const headerOffset = 80; // Account for sticky header
                const elementPosition = sampleSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 300);
    };

    // Fetch similar reports from API
    React.useEffect(() => {
        const fetchSimilarReports = async () => {
            if (!report?.id && !report?._id) return;

            try {
                const reportId = report.id || report._id;

                const response = await fetch(`${BASE_URL}/web/getSimilarReport?reportId=${reportId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    // Log the response for debugging

                    // Extract similar reports with full data including IDs
                    let similarReportsData = [];

                    if (Array.isArray(data)) {
                        // Case 1: Response is an array of report objects
                        similarReportsData = data;
                    } else if (data && typeof data === "object") {
                        // Case 2: Response has nested structure
                        if (Array.isArray(data.data)) {
                            similarReportsData = data.data;
                        } else if (Array.isArray(data.similarReports)) {
                            similarReportsData = data.similarReports;
                        } else if (Array.isArray(data.reports)) {
                            similarReportsData = data.reports;
                        } else if (data.data && Array.isArray(data.data.similarReports)) {
                            similarReportsData = data.data.similarReports;
                        }
                    }

                    setApiSimilarReports(similarReportsData);
                } else {
                    console.error("Failed to fetch similar reports:", response.status);
                }
            } catch (error) {
                console.error("Error fetching similar reports:", error);
            }
        };

        // Only fetch if similarReports prop is empty
        if (similarReports.length === 0) {
            fetchSimilarReports();
        }
    }, [similarReports, report]);

    const handleReportClick = (reportItem) => {
        const reportId = typeof reportItem === "object" ? reportItem._id || reportItem.id : null;
        const reportUrl = typeof reportItem === "object" ? reportItem.url : null;
        const reportTitle = typeof reportItem === "string" ? reportItem : reportItem.reportTitle || reportItem.title || "Untitled Report";
        // const reportCategory = typeof reportItem === 'object' ? (reportItem.category || 'Uncategorized') : 'Uncategorized';

        // Store breadcrumb data in localStorage
        localStorage.setItem("reportBreadcrumbTitle", reportTitle);
        // localStorage.setItem("reportBreadcrumbCategory", reportCategory);

        if (reportUrl) {
            redirect(`report-store/${reportUrl}`);
            if (onReportSelect) {
                onReportSelect(reportItem);
            }
            return;
        }
        if (reportId) {
            redirect(`report-details?reportId=${reportId}`);
            if (onReportSelect) {
                onReportSelect(reportItem);
            }
        }
    };

    // Default similar reports from the screenshot
    const defaultSimilarReports = [
        "Global Orthopedic Digit Implants Market Size study",
        "Global Implants Market Size study",
        "Orthopedic Digit Implants Market Size",
        "Global Digit Implants Market study",
        "Global Orthopedic Market Size study",
        "Global Orthopedic Market Size study",
    ];

    return (
        <main className="w-full space-y-4">
            {/* GET A FREE SAMPLE Section */}
            <section className="flex flex-col justify-center items-start self-stretch bg-white border border-zinc-400">
                <header className="flex flex-col gap-4 justify-center items-start self-stretch px-5 py-2 bg-white max-sm:px-4 max-sm:py-3">
                    <div className="flex flex-col gap-2.5 items-start self-stretch">
                        <h2 className="text-sm font-medium text-sky-900 max-sm:text-sm">IDENTIFY GROWTH & OPPORTUNITY</h2>
                        <p className="self-stretch text-xs leading-6 text-zinc-700 max-sm:text-xs">
                            Gain actionable insights to capture market opportunities and stay ahead of the competition.
                        </p>
                    </div>
                </header>
                <div className="flex flex-col gap-2.5 justify-center items-center self-stretch px-5 py-2 bg-white border-zinc-700 border-opacity-30 max-sm:px-4 max-sm:py-3">
                    <button
                        className="flex gap-2.5 justify-center items-center self-stretch px-3 py-1 bg-sky-900 rounded-md cursor-pointer"
                        aria-label="Buy Now - Purchase the full market research report"
                        onClick={() => redirect(`checkout?id=${report?.id || ""}`)}
                    >
                        <span className="text-sm font-medium leading-6 text-center text-white max-sm:text-sm">Buy Now</span>
                        <Image
                            src="/icons/Righte-Arrow.svg"
                            alt="Arrow icon"
                            className="w-[22px] h-[18px] object-contain flex-shrink-0"
                            width={100}
                            height={100}
                            quality={100}
                        />
                    </button>
                    <button
                        className="gap-2.5 self-stretch px-5 py-1 text-sm font-medium leading-6 text-center text-white bg-red-600 rounded-md cursor-pointer max-sm:text-base"
                        aria-label="Inquiry before Buy - Contact us for more information before purchasing"
                        onClick={handleInquiryBeforeBuy}
                    >
                        Inquiry before Buy
                    </button>
                </div>
            </section>
            {/* Consultation Section */}
            <section className="bg-slate-900 rounded-lg p-4 sm:p-6">
                <article className="space-y-4">
                    <div className="space-y-3">
                        <div className=" rounded-xl">
                            <Image
                                src="/images/Report-Consultation.webp"
                                alt="Consultation"
                                className="object-cover w-full h-[140px]"
                                width={100}
                                height={100}
                                quality={100}
                            />
                        </div>
                        <h3 className="text-xs font-medium leading verra-6 text-blue-50">
                            Tailor this report to your exact business needs with our customization service.
                        </h3>
                    </div>
                    <button
                        className="w-full px-3 sm:px-3 py-1 text-sm font-medium text-zinc-900 bg-white hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
                        aria-label="Get a Free Consultation - Schedule a consultation with our experts"
                        onClick={handleFreeConsultation}
                    >
                        NEED A CUSTOM REPORT?
                    </button>
                </article>
            </section>

            {/* Similar Reports */}
            <section className="flex flex-col justify-center items-start w-full bg-white border border-zinc-300">
                <header className="w-full px-4 py-3 text-lg font-medium leading-7 bg-white border-b border-zinc-300 text-zinc-900 sm:px-5 sm:py-4 sm:text-lg">
                    Similar Reports
                </header>
                <nav aria-label="Similar market research reports" className="w-full">
                    <ul className="w-full divide-y divide-zinc-300">
                        {!isValidArray(apiSimilarReports.length) &&
                            apiSimilarReports
                                ?.slice(0, 6) // ✅ only take the first 6 reports
                                .map((reportItem, index) => {
                                    // Handle both string and object formats
                                    const reportTitle = typeof reportItem === "string" ? reportItem : reportItem.reportSubTitle || "Untitled Report";

                                    const reportId = typeof reportItem === "object" ? reportItem._id || reportItem.id : null;

                                    const displayTitle = reportTitle?.length > 75 ? `${reportTitle.slice(0, 75)}...` : reportTitle || "";

                                    return (
                                        <li key={index} className="w-full">
                                            <a
                                                href={reportId ? `/report-details/${reportId}` : "#"}
                                                className="block w-full px-3 text-sm font-medium text-zinc-600 hover:text-red-600 focus:bg-gray-50 focus:outline-none sm:px-2 sm:py-2 sm:text-xs"
                                                aria-label={`View ${reportTitle} report`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleReportClick(reportItem);
                                                }}
                                            >
                                                {displayTitle}
                                            </a>
                                        </li>
                                    );
                                })}
                    </ul>
                </nav>
            </section>
        </main>
    );
}
