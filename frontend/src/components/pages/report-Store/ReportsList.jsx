"use client";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { Box, CircularProgress } from "@mui/material";
import { useGetCategoryAndSubcategoryQuery, useGetDataByCategoryQuery, useGetDataBySubCategoryQuery, useGetReportQuery } from "@/api/home.js";

const formatPrice = (price) => {
    if (!price) return "$0";
    const priceStr = String(price);
    return priceStr.startsWith("$") ? priceStr : `$${priceStr}`;
};

const ReportsHeader = ({ resultsCount, onSortChange, searchParams }) => (
    <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-3 w-full border-b-[0.5px] border-[rgba(67,70,75,0.30)]">
        <div className="text-xs font-medium text-red-600">
            {resultsCount} Result{resultsCount !== 1 ? "s" : ""}
        </div>
        <div className="text-[18px] font-[600]">{searchParams ? `Search result for "${searchParams}"` : "Report Store"}</div>
        <div className="flex flex-col sm:flex-row sm:gap-3 sm:items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-zinc-700 font-medium">
                Sort By:
            </label>
            <div className="relative">
                <select
                    id="sort-select"
                    className="appearance-none w-full sm:w-[200px] p-1.5 text-xs font-medium bg-white border border-zinc-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    aria-label="Sort reports by"
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    <option value="latest">Latest Publish</option>
                    <option value="price-low">Price: High to Low</option>
                    <option value="price-high">Price: Low to High</option>
                    <option value="name">Name A-Z</option>
                </select>
                <Image
                    width={20}
                    height={20}
                    src="/icons/DropDown-Icon.webp"
                    alt=""
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                    aria-hidden="true"
                />
            </div>
        </div>
    </header>
);

const PriceDisplay = ({ price, license }) => (
    <div className="flex flex-col items-start w-full text-sm mb-4">
        <div className="flex flex-wrap gap-1 items-center mx-auto">
            <span className="text-black text-xs">Price:</span>
            <span className="text-xm font-medium text-zinc-900">{price}</span>
        </div>
        <div className="flex gap-2 items-center mx-auto">
            <span className="text-black text-xs">License:</span>
            <span className="text-red-600 font-medium text-xs">{license}</span>
        </div>
    </div>
);

const ActionButtons = ({ id, report }) => {
    const router = useRouter();
    const handleBuyNow = useCallback(
        (e) => {
            e.stopPropagation();
            router.push(`/checkout?id=${id}`);
        },
        [id, router]
    );

    const handleRequestSample = useCallback(
        (e) => {
            e.stopPropagation();
            router.push(`/report-store/${report?.url}#sample`);
        },
        [report?.url, router]
    );

    return (
        <div className="w-full space-y-2">
            <button
                onClick={handleBuyNow}
                className="w-full px-4 py-1.5 text-xs font-medium text-white bg-sky-900 rounded-md hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                aria-label="Purchase this report"
            >
                Buy Now
            </button>
            <button
                onClick={handleRequestSample}
                className="w-full px-4 py-1.5 text-xs font-medium text-white bg-[#5CB2DC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                aria-label="Request a sample of this report"
            >
                Request a sample
            </button>
        </div>
    );
};

const ReportCard = React.memo(({ report, urlName }) => {
    const router = useRouter();
    const {
        image = "/images/default-report-image.webp",
        reportTitle,
        reportOverview,
        reportSubTitle,
        reportDescription,
        reportNo,
        pages,
        availableIn,
        businessPrice,
        _id,
    } = report;
    const pathname = usePathname();
    const decodedPath = decodeURIComponent(pathname);
    const [pageType, pageSlug, pageSubSlug] = decodedPath?.split("/")?.slice(1) ?? ["", "", ""];

    const price = formatPrice(businessPrice);
    const license = "Single User";

    const availableFormats = useMemo(() => {
        const formatsMap = { Pdf: "/icons/Publish-Formate3.svg", Excel: "/icons/Publish-Formate1.svg", Word: "/icons/Publish-Formate2.svg" };
        const formats = Array.isArray(availableIn)
            ? availableIn
            : typeof availableIn === "string"
                ? availableIn.split(", ").map((f) => f.trim())
                : [availableIn].filter(Boolean);
        return formats.map((f) => formatsMap[f] || "/icons/Publish-Formate3.svg").filter(Boolean);
    }, [availableIn]);

    const handleCardClick = useCallback(() => {
        sessionStorage.removeItem("persistedHash");
        localStorage.setItem("reportBreadcrumbTitle", reportTitle);
        if (urlName && urlName !== "null") localStorage.setItem("reportBreadcrumbCategory", urlName);
        else localStorage.removeItem("reportBreadcrumbCategory");
        window.open(report?.url ? `/report-store/${report.url}` : `/report-details?reportId=${_id}`, "_blank");
    }, [reportTitle, urlName, report?.url, _id]);

    const codeNumber = useMemo(() => {
        if (report?.subCategoryId?.code) return `${report.subCategoryId.code}${reportNo}`;
        if (report?.categoryId?.code) return `${report.categoryId.code}${reportNo}`;
        return reportNo;
    }, [reportNo, report?.categoryId?.code, report?.subCategoryId?.code]);

    const cleanHtmlReportOverview = useMemo(() => {
        const sanitized = DOMPurify.sanitize(reportOverview, { ALLOWED_TAGS: ["p", "strong", "br"] });
        const doc = new DOMParser().parseFromString(sanitized, "text/html");
        return Array.from(doc.querySelectorAll("p")).find((p) => p.textContent.trim())?.innerHTML || "";
    }, [reportOverview]);

    const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getOverviewLength = useCallback(() => {
        const breakpoints = [
            [100, 200, 50],
            [201, 400, 80],
            [401, 768, 70],
            [769, 1024, 60],
            [1025, 1326, 70],
            [1327, 1440, 110],
            [1441, 1600, 120],
            [1601, 1700, 120],
        ];
        return breakpoints.find(([min, max]) => windowWidth >= min && windowWidth <= max)?.[2] || 130;
    }, [windowWidth]);

    return (
        <Box
            component="article"
            onClick={handleCardClick}
            className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-start p-2 w-full cursor-pointer bg-white rounded-lg"
            sx={{ "&:hover": { boxShadow: "1px 1px 13px -3px #919191" }, boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)" }}
        >
            <div className="w-full lg:w-auto flex justify-center lg:justify-start">
                <Image
                    src={image}
                    alt={`Report image for ${reportTitle}`}
                    className="object-contain aspect-[0.83] w-32 sm:w-28 max-w-full"
                    width={150}
                    height={180}
                    quality={65}
                    priority // 👈 ensures preload + fetchpriority=high
                />

            </div>
            <div className="flex-1 w-full lg:pr-6 lg:border-r lg:border-zinc-200">
                <p style={{ lineHeight: "130%" }} className="text-[15px] h-10 text-zinc-900 mb-2 font-[600] line-clamp-2">
                    {reportSubTitle || reportTitle}
                </p>
                <p style={{ lineHeight: "120%" }} className="text-[13px] h-8 text-[#323232] mb-2 font-[400] line-clamp-2">
                    {parse(reportDescription || cleanHtmlReportOverview)}
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3 text-xs text-zinc-700">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="mt-4 text-black">
                            <span style={{ fontWeight: "500" }}>Code:</span> {codeNumber}
                        </span>
                        <span className="mt-4 text-black">
                            <span style={{ fontWeight: "500" }}>Pages:</span> {pages}
                        </span>
                    </div>
                    <div className="flex flex-wrap mt-1 gap-2 mt-4">
                        <span className="text-black text-xs">
                            <span style={{ fontWeight: "500" }}>Available In:</span>
                        </span>
                        <div className="flex gap-2">
                            {availableFormats.map((format, index) => (
                                <Image
                                    key={index}
                                    src={format}
                                    width={20}
                                    height={20}
                                    alt={`Format ${index + 1}`}
                                    className="object-contain w-4 h-4"
                                    quality={75}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <aside className="w-full lg:w-[190px] mt-4 lg:mt-0">
                <PriceDisplay price={price} license={license} />
                <ActionButtons id={_id} report={report} />
            </aside>
        </Box>
    );
});

const ReportsList = ({ selectedCategory, selectedSubCategory, urlName }) => {
    const [sortBy, setSortBy] = useState("latest");
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Queries with pagination parameters
    const { data: reportData, isLoading: isReportLoading } = useGetReportQuery({ pageNo, pageSize }, {
        skip: !!(selectedCategory || selectedSubCategory),
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    const { data: subCategoryData, isLoading: isSubCategoryLoading } = useGetDataBySubCategoryQuery({ id: selectedSubCategory, pageNo, pageSize }, {
        skip: !selectedSubCategory,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    const { data: categoryData, isLoading: isCategoryLoading } = useGetDataByCategoryQuery({ id: selectedCategory, pageNo, pageSize }, {
        skip: !selectedCategory,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoryAndSubcategoryQuery(undefined, {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    const categories = categoriesData?.reportCategories || [];

    const rawReports = useMemo(() => {
        if (selectedSubCategory) return subCategoryData?.reports || [];
        if (selectedCategory) return categoryData?.reports || [];
        return reportData || [];
    }, [selectedCategory, selectedSubCategory, subCategoryData, categoryData, reportData]);

    const totalRecordCount = useMemo(() => {
        if (selectedSubCategory) return subCategoryData?.totalRecordCount || 0;
        if (selectedCategory) return categoryData?.totalRecordCount || 0;
        return reportData?.totalRecordCount || 0;
    }, [selectedCategory, selectedSubCategory, subCategoryData, categoryData, reportData]);

    const totalPages = Math.ceil(totalRecordCount / pageSize);

    const reports = useMemo(() => {
        let sorted = [...rawReports];
        if (sortBy === "latest") {
            sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        } else if (sortBy === "price-low") {
            sorted.sort((a, b) => (parseFloat(b.singleUserPrice || 0) || 0) - (parseFloat(a.singleUserPrice || 0) || 0));
        } else if (sortBy === "price-high") {
            sorted.sort((a, b) => (parseFloat(a.singleUserPrice || 0) || 0) - (parseFloat(b.singleUserPrice || 0) || 0));
        } else if (sortBy === "name") {
            sorted.sort((a, b) => a.reportTitle.localeCompare(b.reportTitle));
        }
        return sorted;
    }, [rawReports, sortBy]);

    const isLoading = isReportLoading || isSubCategoryLoading || isCategoryLoading || isCategoriesLoading;

    const handlePageChange = (event, value) => {
        setPageNo(value);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPageNo(1); // Reset to first page when page size changes
    };

    const handlePrevious = () => {
        if (pageNo > 1) {
            setPageNo(pageNo - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleNext = () => {
        if (pageNo < totalPages) {
            setPageNo(pageNo + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <main className="w-full" role="main" aria-label="Reports list">
            <ReportsHeader resultsCount={reports.length} onSortChange={setSortBy} categories={categories} />

            <section className="mt-6" aria-label="Report listings">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <CircularProgress size={32} color="primary" />
                        </div>
                    </div>
                ) : reports.length > 0 ? (
                    <div className="space-y-4">
                        {reports.map((report) => (
                            <ReportCard key={report._id} report={report} urlName={urlName} />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="text-zinc-400 text-4xl mb-4">📄</div>
                            <p className="text-zinc-600 font-medium">No reports found</p>
                            <p className="text-zinc-500 text-sm mt-1">Try adjusting your filters or search terms</p>
                        </div>
                    </div>
                )}
            </section>
            <div className="flex justify-center items-center gap-2 py-4 bg-gray-100">
                <span>List per Page:</span>
                <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="border rounded px-2 py-1"
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                </select>
                <button
                    onClick={handlePrevious}
                    className="px-4 py-1 bg-gray-300 rounded"
                    disabled={pageNo === 1}
                >
                    Previous
                </button>
                <span>{pageNo}</span>
                <span>{totalPages > 1 ? `of ${totalPages}` : ""}</span>
                <button
                    onClick={handleNext}
                    className="px-4 py-1 bg-green-600 text-white rounded"
                    disabled={pageNo === totalPages}
                >
                    Next
                </button>
            </div>
        </main>
    );
};

export const ReportsListProps = ({ propsData, searchParams, loadingData }) => {
    const [reports, setReports] = useState([]);
    const [sortBy, setSortBy] = useState("latest");
    const [showNoData, setShowNoData] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        let timer;

        if (!loadingData && reports.length === 0) {
            timer = setTimeout(() => {
                setShowNoData(true);
            }, 1000);
        } else {
            setShowNoData(false);
        }

        return () => clearTimeout(timer);
    }, [loadingData, reports]);

    useEffect(() => {
        if (propsData) setReports([...propsData].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    }, [propsData]);

    const totalPages = Math.ceil(reports.length / pageSize);
    const paginatedReports = useMemo(() => {
        const start = (pageNo - 1) * pageSize;
        const end = start + pageSize;
        return reports.slice(start, end);
    }, [reports, pageNo, pageSize]);

    const handleSortChange = useCallback(
        (value) => {
            setSortBy(value);
            const sortedReports = [...(reports || [])];
            if (value === "latest") {
                sortedReports.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            } else if (value === "price-low") {
                sortedReports.sort(
                    (a, b) =>
                        (parseFloat(String(b.singleUserPrice || 0).replace(/[$,]/g, "")) || 0) -
                        (parseFloat(String(a.singleUserPrice || 0).replace(/[$,]/g, "")) || 0)
                );
            } else if (value === "price-high") {
                sortedReports.sort(
                    (a, b) =>
                        (parseFloat(String(a.singleUserPrice || 0).replace(/[$,]/g, "")) || 0) -
                        (parseFloat(String(b.singleUserPrice || 0).replace(/[$,]/g, "")) || 0)
                );
            } else if (value === "name") {
                sortedReports.sort((a, b) => a.reportTitle.localeCompare(b.reportTitle));
            } else if (value.startsWith("category-")) {
                sortedReports.length = 0;
                sortedReports.push(...(propsData || []).filter((report) => report.categoryId === value.split("category-")[1]));
            } else if (value.startsWith("subcategory-")) {
                sortedReports.length = 0;
                sortedReports.push(...(propsData || []).filter((report) => report.subCategoryId === value.split("subcategory-")[1]));
            }
            setReports(sortedReports);
        },
        [reports, propsData]
    );

    const handlePageChange = (event, value) => {
        setPageNo(value);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPageNo(1); // Reset to first page when page size changes
    };

    const handlePrevious = () => {
        if (pageNo > 1) {
            setPageNo(pageNo - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleNext = () => {
        if (pageNo < totalPages) {
            setPageNo(pageNo + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <main className="w-full" role="main" aria-label="Reports list">
            <ReportsHeader resultsCount={reports?.length || 0} onSortChange={handleSortChange} searchParams={searchParams} />
            <section className="mt-6" aria-label="Report listings">
                {loadingData ? (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress size={32} color="primary" />
                    </Box>
                ) : paginatedReports.length === 0 && showNoData ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="text-zinc-400 text-4xl mb-4">📄</div>
                            <p className="text-zinc-600 font-medium">No reports found</p>
                            <p className="text-zinc-500 text-sm mt-1">Try adjusting your filters or search terms</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {paginatedReports?.map((report) => (
                            <ReportCard key={report._id} report={report} />
                        ))}
                    </div>
                )}
            </section>
            <div className="flex mt-2 flex-wrap justify-end md:justify-between items-center gap-3 md:gap-4 px-3 md:px-5 py-3 bg-white shadow rounded-lg text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-gray-600">List per Page:</span>
                    <select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevious}
                        disabled={pageNo === 1}
                        className={`px-3 py-1 rounded border text-sm transition ${pageNo === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        Previous
                    </button>

                    <div className="flex items-center gap-1 text-gray-700">
                        <span className="px-2 py-1 bg-gray-100 rounded">{pageNo}</span>
                        {totalPages > 1 && (
                            <span className="text-gray-500 text-xs">of {totalPages}</span>
                        )}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={pageNo === totalPages}
                        className={`px-6 py-1 rounded border text-sm transition ${pageNo === totalPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-[#054A6E] text-white border-[#054A6E] "
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>


        </main>
    );
};

export default ReportsList;