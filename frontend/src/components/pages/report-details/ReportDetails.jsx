// "use client";

// import React, { useState, useEffect } from "react";
// import { mockReports } from "../../../data/mockReports";
// import Footer from "../../layout/Footer";
// import ReportHeader from "./ReportHeader";
// import ContactUs from "../home/ContactUs";
// import ReportBody from "./ReportBody";
// import { BASE_URL } from "../../../../config";
// import { showErrorToast } from "../../../utils/api/toast";

// function ReportDetails({ id }) {
//     const [report, setReport] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Fetch report data from API
//     useEffect(() => {
//         const fetchReport = async () => {
//             try {
//                 setLoading(true);
//                 const response = await fetch(`${BASE_URL}/web/getReportById?reportId=${id}`, {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 });
//                 const result = await response.json();
//                 if (result.data) {
//                     setReport(result.data);
//                 } else {
//                     // Fallback to mock data if API fails
//                     const mockReport = mockReports.find((r) => String(r.id) === String(id));
//                     setReport(mockReport);
//                     showErrorToast("Failed to load report from API, using fallback data");
//                 }
//             } catch (error) {
//                 // Fallback to mock data if API fails
//                 const mockReport = mockReports.find((r) => String(r.id) === String(id));
//                 setReport(mockReport);
//                 showErrorToast("Failed to load report from API, using fallback data");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (id) {
//             fetchReport();
//         }
//     }, [id]);

//     if (loading) {
//         return <div className="p-10 text-center text-gray-600">Loading report...</div>
//     }

//     if (!report) {
//         return <div className="p-10 text-center text-red-600">Report not found.</div>
//     }

//     return (
//         <main className="min-h-screen bg-white flex flex-col justify-between">
//             {error && (
//                 <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mx-4 mt-4">
//                     {error}
//                 </div>
//             )}
//             <ReportHeader report={report} />
//             <ReportBody report={report} />
//             <ContactUs />
//             <Footer />
//         </main>
//     );
// }

// export default ReportDetails;
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import ReportHeader from "../components/pages/report-details/ReportHeader";
// import ReportBody from "../components/pages/report-details/ReportBody";
// import ContactUs from "../components/pages/home/ContactUs";
// import { Footer } from "../components/layout";
import { fetchWithErrorHandling, parseJsonWithErrorHandling } from "@/utils/networkError";
import { BASE_URL } from "../../../../config";
import ContactUs from "@/pages/contactus";
import ReportHeader from "./ReportHeader";
import { Footer } from "@/components";
import ReportBody from "./ReportBody";

function ReportDetailsPage() {
    const router = useRouter();
    const { reportId } = router.query;
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!reportId) return;

        const fetchReport = async () => {
            setLoading(true);
            setError(null);
            setReport(null);

            const response = await fetchWithErrorHandling(`${BASE_URL}/web/getReportById?reportId=${reportId}`);
            if (response?.error) {
                setError(response.message || "Failed to fetch report");
                setLoading(false);
                return;
            }
            const data = await parseJsonWithErrorHandling(response, "parsing report details response");
            if (!data || !data.data) {
                setError("Report not found");
                setLoading(false);
                return;
            }

            // Transform API data to match the component's expected format
            const transformedReport = {
                id: data.data._id,
                _id: data.data._id,
                image: data.data.image || "/images/default-report-image.webp",
                title: data.data.reportTitle,
                reportTitle: data.data.reportTitle,
                reportSubTitle: data.data.reportSubTitle,
                reportCode: data.data.reportNo,
                pages: data.data.pages,
                publishDate: data.data.publishDate,
                availableIn: data.data.availableIn,
                singleUserPrice: data.data.singleUserPrice,
                businessPrice: data.data.businessPrice,
                entrepreneurPrice: data.data.entrepreneurPrice,
                reportOverview: data.data.reportOverview || "Report overview not available.",
                tableOfContent: data.data.tableOfContent,
                researchMethodology: data.data.researchMethodology,
                availableFormats: data.data.availableIn
                    ? data.data.availableIn
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
                category: data.data.categoryId?.name || null,
                subCategory: data.data.subCategoryId?.name || null,
                similarReports: [],
            };

            setReport(transformedReport);

            // Save report data to localStorage for checkout process
            localStorage.setItem("currentReportData", JSON.stringify(transformedReport));
            console.log("Report data saved to localStorage for checkout:", transformedReport._id);

            setLoading(false);
        };

        fetchReport();
    }, [reportId]);

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
                    <button onClick={() => router.push("/report")} className="bg-sky-900 text-white px-6 py-2 rounded hover:bg-sky-800 transition-colors">
                        Browse Reports
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white flex flex-col justify-between">
            <ReportHeader report={report} />
            <ReportBody report={report} />
            <ContactUs pageName={`Report-Deatails (${report.reportCode || ""})`} />
            <Footer />
        </main>
    );
}

export default ReportDetailsPage;
