"use client";
import { Footer } from "@/components";
import ReportBody from "@/components/pages/report-details/ReportBody";
import ReportHeader from "@/components/pages/report-details/ReportHeader";
import { fetchWithErrorHandling, parseJsonWithErrorHandling } from "@/utils/networkError";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { BASE_URL } from "../../../config";

function ReportDetailsPageInner(props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    // const reportId = searchParams?.get("reportId") || "";
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const reportData = props?.reportData || {};

    // Use canonical URL hook to ensure canonical URLs match current route
    // useCanonicalUrl();

    // Only apply metadata when we have actual report data to prevent conflicts with other pages
    // const hasReportSEO = report?.sco?.seoTitle || report?.sco?.metaDescription || report?.sco?.keywords;

    // Pass undefined when no report SEO data to prevent clearing other page metadata
    // useMetadata(
    //     hasReportSEO ? report?.sco?.seoTitle : undefined,
    //     hasReportSEO ? report?.sco?.metaDescription : undefined,
    //     hasReportSEO ? report?.sco?.keywords : undefined
    // );

    useEffect(() => {
        // If props.reportData is provided, skip fetch
        if (reportData) {
            setReport(transformReport(reportData));
            setLoading(false);
            return;
        }
        // if (!reportId) return;

        // const fetchReport = async () => {
        //     setLoading(true);
        //     setError(null);
        //     setReport(null);

        //     const response = await fetchWithErrorHandling(`${BASE_URL}/web/getReportById?reportId=${reportId}`);
        //     if (response?.error) {
        //         setError(response.message || "Failed to fetch report");
        //         setLoading(false);
        //         return;
        //     }
        //     const data = await parseJsonWithErrorHandling(response, "parsing report details response");
        //     if (!data || !data.data) {
        //         setError("Report not found");
        //         setLoading(false);
        //         return;
        //     }
        //     const transformedReport = transformReport(data.data);
        //     setReport(transformedReport);

        //     // Save to localStorage if needed
        //     localStorage.setItem("currentReportData", JSON.stringify(transformedReport));
        //     setLoading(false);
        // };

        // fetchReport();
    }, [reportData]);

    function transformReport(data) {
        // Handles both props.reportData and API data
        return {
            id: data._id,
            _id: data._id,
            image: data.image || "/images/default-report-image.webp",
            title: data.reportTitle,
            reportTitle: data.reportTitle,
            reportSubTitle: data.reportSubTitle,
            reportCode: data.reportNo ?? "",
            pages: data.pages,
            publishDate: data.publishDate,
            availableIn: data.availableIn,
            singleUserPrice: data.singleUserPrice,
            businessPrice: data.businessPrice,
            entrepreneurPrice: data.entrepreneurPrice,
            reportOverview: data.reportOverview || "Report overview not available.",
            tableOfContent: data.tableOfContent,
            researchMethodology: data.researchMethodology,
            availableFormats: data.availableIn
                ? data.availableIn
                      .split(", ")
                      .map((format) => {
                          const formatsMap = {
                              Pdf: "/icons/Publish-Formate3.svg",
                              Excel: "/icons/Publish-Formate1.svg",
                              Word: "/icons/Publish-Formate2.svg",
                          };
                          return formatsMap[format.trim()] || "/icons/Publish-Formate3.svg";
                      })
                      .filter(Boolean)
                : ["/icons/Publish-Formate3.svg"],
            similarReports: [],
            // Author fields - check multiple possible field names
            author: data.author,
            authorName: data.authorName,
            createdBy: data.createdBy,
            writtenBy: data.writtenBy,
            researcher: data.researcher,
            sco: data,
        };
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-900 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading report details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Report</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button onClick={() => router.back()} className="bg-sky-900 text-white px-6 py-2 rounded hover:bg-sky-800 transition-colors">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📄</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h1>
                    <p className="text-gray-600 mb-4">The requested report could not be found.</p>
                    <button onClick={() => redirect("report-store")} className="bg-sky-900 text-white px-6 py-2 rounded hover:bg-sky-800 transition-colors">
                        Browse Reports
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen max-w-[100%] mx-auto bg-white flex flex-col justify-between">
            <ReportHeader report={report} />
            <ReportBody report={report} />
            {/* <ContactUs /> */}
            <Footer />
        </main>
    );
}

export default function ReportDetailsPage(props) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading report details...</div>}>
            <ReportDetailsPageInner {...props} />
        </Suspense>
    );
}
