"use client";
import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Footer } from "../components/layout";
import Breadcrumb from "../components/pages/shared/Breadcrumb";
import { useSearchParams } from "next/navigation";
import { BASE_URL } from "../../config";
import { fetchWithErrorHandling, parseJsonWithErrorHandling } from "../utils/networkError";

// Lazy load heavy checkout components
const OrderSummary = dynamic(() => import("../components/pages/checkout/OrderSummary"), {
    loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const OrderPreview = dynamic(() => import("../components/pages/checkout/OrderPreview"), {
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const PaymentOptions = dynamic(() => import("../components/pages/checkout/PaymentOptions"), {
    loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded-lg" />
});

export default function Checkoutpage() {
    // Load PayPal SDK only on checkout page, lazily
    // useEffect(() => {
    //     const PAYPAL_SRC = "https://www.paypal.com/sdk/js?client-id=AUIFR9LLNIH-7E1_0B7GtYOG8t6X4JYAV5QDvgJ2VWbPhgURq1worV2_06uH8RxdptKPtshYah0bhgXN";
    //     const hasScript = Array.from(document.scripts).some((s) => s.src?.startsWith("https://www.paypal.com/sdk/js"));
    //     if (!hasScript) {
    //         const script = document.createElement("script");
    //         script.src = PAYPAL_SRC;
    //         script.async = true;
    //         script.defer = true;
    //         document.body.appendChild(script);
    //     }
    // }, []);
    const [step, setStep] = useState("details"); // "details" or "preview"
    const [orderData, setOrderData] = useState(null);

    // Breadcrumb states
    const [breadcrumbTitle, setBreadcrumbTitle] = useState(null);
    const [breadcrumbCategory, setBreadcrumbCategory] = useState(null);
    const [reportId, setReportId] = useState(null);
    const [category, setCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);

    // Report data for header
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get report ID from URL parameters
    const searchParams = useSearchParams();
    const urlReportId = searchParams?.get("id");

    // Transform API data to match component's expected format (same as ReportDetails)
    const transformReport = (apiData) => {
        // Transform availableIn to availableFormats with icon mapping (exactly like ReportDetails)
        const availableFormats = apiData.availableIn
            ? apiData.availableIn
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
            : ["/icons/Publish-Formate3.svg"];

        return {
            id: apiData._id,
            _id: apiData._id,
            image: apiData.image || "/images/default-report-image.webp",
            title: apiData.reportTitle,
            reportTitle: apiData.reportTitle,
            reportSubTitle: apiData.reportSubTitle,
            reportCode: apiData.reportNo ?? "",
            pages: apiData.pages,
            publishDate: apiData.publishDate,
            availableIn: apiData.availableIn,
            availableFormats: availableFormats,
            singleUserPrice: apiData.singleUserPrice,
            businessPrice: apiData.businessPrice,
            entrepreneurPrice: apiData.entrepreneurPrice,
            reportOverview: apiData.reportOverview || "Report overview not available.",
            tableOfContent: apiData.tableOfContent,
            researchMethodology: apiData.researchMethodology,
            similarReports: [],
            // Author fields - check multiple possible field names
            author: apiData.author,
            authorName: apiData.authorName,
            createdBy: apiData.createdBy,
            writtenBy: apiData.writtenBy,
            researcher: apiData.researcher,
            sco: apiData,
        };
    };

    // Fetch dynamic report data from API
    useEffect(() => {
        const fetchReportData = async () => {
            let currentReportId = urlReportId;

            // If no URL parameter, try localStorage as fallback
            if (!currentReportId) {
                const savedReportData = localStorage.getItem("currentReportData");
                if (savedReportData) {
                    try {
                        const parsedData = JSON.parse(savedReportData);
                        currentReportId = parsedData._id || parsedData.id;
                    } catch (e) {
                        console.error("Error parsing saved report data:", e);
                    }
                }
            }

            if (!currentReportId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetchWithErrorHandling(`${BASE_URL}/web/getReportById?reportId=${currentReportId}`);
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

                const transformedReport = transformReport(data.data);
                setReportData(transformedReport);
                setReportId(transformedReport._id);

                // Update localStorage with fresh data
                localStorage.setItem("currentReportData", JSON.stringify(transformedReport));

                // Set breadcrumb and category data
                const sco = transformedReport.sco || {};
                if (sco.categoryId) {
                    setCategory(sco.categoryId);
                }
                if (sco.subCategoryId) {
                    setSubCategory(sco.subCategoryId);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching report data:", err);
                setError("Failed to load report data");
                setLoading(false);
            }
        };

        fetchReportData();
    }, [urlReportId]);

    // Load breadcrumb data from localStorage
    useEffect(() => {
        const title = localStorage.getItem("reportBreadcrumbTitle");
        const categoryName = localStorage.getItem("reportBreadcrumbCategory");

        if (title) setBreadcrumbTitle(title);
        if (categoryName) setBreadcrumbCategory(categoryName);
    }, []);

    // Calculate code number exactly like ReportHeader
    const codeNumber = useMemo(() => {
        if (!reportData) return "";
        const reportCode = reportData.reportCode;
        // Same logic as ReportHeader
        if (reportData?.sco?.subCategoryId?.code) {
            return `${reportData?.sco?.subCategoryId?.code}${reportCode}`;
        } else if (reportData?.sco?.categoryId?.code) {
            return `${reportData?.sco?.categoryId?.code}${reportCode}`;
        }
        return reportCode; // Fallback
    }, [reportData?.reportCode, reportData?.sco?.categoryId?.code, reportData?.sco?.subCategoryId?.code]);

    const handleProceedToCheckout = (data) => {
        setOrderData(data);
        setStep("preview");
    };

    const handleEditBilling = () => setStep("details");
    const handleEditCart = () => setStep("details");

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Report</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="bg-sky-900 text-white px-6 py-2 rounded hover:bg-sky-800 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const formatsMap = ["/icons/Publish-Formate3.svg", "/icons/Publish-Formate1.svg", "/icons/Publish-Formate2.svg"];

    return (
        <div className="flex flex-col min-h-screenc ">
            {/* Breadcrumb */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm text-gray-500">
                <div className="w-[98%] sm:w-full md:w-full lg:w-[84.5%] mx-auto">
                    <Breadcrumb
                        items={[
                            { label: "Reports", href: "/report-store" },
                            ...(category
                                ? [
                                      {
                                          label: category.name,
                                          href: `/report-store/${category.url}`,
                                      },
                                  ]
                                : []),
                            ...(subCategory
                                ? [
                                      {
                                          label: subCategory.name,
                                          href: `/report-store/${category?.url}/${subCategory.url}`,
                                      },
                                  ]
                                : []),
                            ...(breadcrumbTitle && reportId
                                ? [
                                      {
                                          label: breadcrumbTitle.length > 20 ? `${breadcrumbTitle.slice(0, 20)}...` : breadcrumbTitle,
                                          href: `/report-details?reportId=${reportId}`,
                                      },
                                  ]
                                : []),
                            { label: "Checkout", href: "/checkout" },
                        ]}
                    />
                </div>
            </div>

            {/* Report Header Section */}
            {reportData && (
                <header className="w-[100%] bg-white ">
                    <div className="w-[100%] flex justify-center sm:w-[100%] md:w-[100%] lg:w-[85.1%] mx-auto px-4 sm:px-6 lg:px-8 pl-5">
                        <div className="flex-1 w-full sm:min-w-0">
                            <h1
                                style={{ fontWeight: "600" }}
                                className="font-medium text-zinc-900 text-sm sm:text-[18px] md:text-[18px] lg:text-[18px] xl:text-[18px] leading-[160%] text-zinc-900 "
                            >
                                {reportData.title}
                            </h1>
                        </div>
                    </div>
                </header>
            )}

            {/* Main Checkout Content */}
            <div className="flex-1 mx-auto w-[86%]">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {step === "details" && (
                        <div className="w-[full]">
                            <OrderSummary
                                onProceed={handleProceedToCheckout}
                                initialBillingInfo={orderData?.billingInfo}
                                initialCartItems={orderData?.cartItems}
                            />
                        </div>
                    )}

                    {step === "preview" && orderData && (
                        // <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-[100%]">
                        //     <div className="w-[100%] md:[50%] flex-1">
                        //         <OrderPreview
                        //             billingInfo={orderData.billingInfo}
                        //             cartItems={orderData.cartItems}
                        //             orderSummary={orderData.orderSummary}
                        //             onEditBilling={handleEditBilling}
                        //             onEditCart={handleEditCart}
                        //         />
                        //     </div>
                        //     <div className="w-[100%] md:[50%] lg:flex-shrink-0">
                        //         <PaymentOptions orderData={orderData} />
                        //     </div>
                        // </div>
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
                            <div className="w-full lg:w-1/2 flex-1">
                                <OrderPreview
                                    billingInfo={orderData.billingInfo}
                                    cartItems={orderData.cartItems}
                                    orderSummary={orderData.orderSummary}
                                    onEditBilling={handleEditBilling}
                                    onEditCart={handleEditCart}
                                />
                            </div>

                            <div className="w-full lg:w-1/2 lg:flex-shrink-0">
                                <PaymentOptions orderData={orderData} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
