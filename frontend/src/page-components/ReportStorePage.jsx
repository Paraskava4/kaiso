"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Footer from "../components/layout/Footer";
import { UrlFilter } from "../components/pages/report-Store/Filter";
import { ReportsListProps } from "../components/pages/report-Store/ReportsList";
import Breadcrumb from "../components/pages/shared/Breadcrumb";
import { BASE_URL } from "../../config";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import { useButtonNames } from "../hooks/useButtonNames";
import { useClientOnly } from "../hooks/useClientOnly";
// import { useNavbarSEO } from "@/utils/hooks/useMetadata";
import { CircularProgress } from "@mui/material";

const ReportStorePage = (props) => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedName, setSelectedName] = useState(null);
    const [categories, setCategories] = useState([]);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    // This new flag is the key!
    const [isDynamic, setIsDynamic] = useState(false);

    // Desktop detection for responsive behavior
    const [isDesktop, setIsDesktop] = useState(false);
    const isClient = useClientOnly();

    const reportData = props?.reportData;
    const urlData = props?.urlData;
    const searchParams = props?.searchParams;
    const loadingData = props?.loadingData;
    const isErrorData = props?.isErrorData;
    const isSuccessData = props?.isSuccessData;

    // Get pathname for SEO logic
    const pathname = usePathname();
    const decodedPath = decodeURIComponent(pathname);
    const pageType = decodedPath?.split("/")?.[1] ?? "";
    const pageSlug = decodedPath?.split("/")?.[2] ?? "";

    // Dynamic SEO based on API data structure
    let seoMainPage = "Report Store";
    let seoSubPage = "Report Store";

    // Check if reportData has categoryId - this indicates it's an industry page
    if (reportData && Array.isArray(reportData) && reportData.length > 0) {
        // Check the first item in reportData array for categoryId
        const firstItem = reportData[0];
        if (firstItem?.categoryId && firstItem.categoryId !== null) {
            seoMainPage = "Industries";
            // Use the category name from API data
            seoSubPage = firstItem.categoryId.name || firstItem.name || "Industry";
        }
    } else if (reportData && reportData.categoryId && reportData.categoryId !== null) {
        // Handle single object case
        seoMainPage = "Industries";
        seoSubPage = reportData.categoryId.name || reportData.name || "Industry";
    }

    // useNavbarSEO(seoMainPage, seoSubPage);

    // Fetch button names
    const { buttonNames, loading: buttonLoading, error: buttonError } = useButtonNames();

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/web/categoryAndSubcategory?type=Report`);
                const result = await response.json();
                if (result.data && result.data.reportCategories) {
                    setCategories(result.data.reportCategories);
                }
            } catch {
                toast.error("Failed to fetch categories. Please try again later.", {
                    duration: 5000,
                    style: { background: "#ef4444", color: "#fff" },
                });
            }
        };
        fetchCategories();
    }, []);

    // Parse category/subcategory from URL
    useEffect(() => {
        if (categories.length === 0) return;
        const { category, subcategory } = router.query;

        if (category) {
            const categoryFromUrl = category
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            const matchingCategory = categories.find(
                (cat) =>
                    cat.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[&]/g, "and")
                        .replace(/[^a-z0-9-]/g, "") === category || cat.name === categoryFromUrl
            );
            if (matchingCategory) {
                setSelectedName(categoryFromUrl);
                setSelectedCategory(matchingCategory._id);
            }
        } else if (subcategory) {
            const subcategoryFromUrl = subcategory
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            let matchingSubCategory = null;
            let parentCategory = null;
            for (const cat of categories) {
                if (cat.subCategories) {
                    const subCat = cat.subCategories.find(
                        (sub) =>
                            sub.name
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                                .replace(/[&]/g, "and")
                                .replace(/[^a-z0-9-]/g, "") === subcategory || sub.name === subcategoryFromUrl
                    );
                    if (subCat) {
                        matchingSubCategory = subCat;
                        parentCategory = cat;
                        break;
                    }
                }
            }
            if (matchingSubCategory && parentCategory) {
                setSelectedCategory(parentCategory._id);
                setSelectedSubCategory(matchingSubCategory._id);
                setSelectedName(subcategoryFromUrl);
            }
        } else {
            setSelectedCategory(null);
            setSelectedSubCategory(null);
            setSelectedName(null);
        }
        // Reset to props data on URL param change (SSR->props)
        setIsDynamic(false);
    }, [router.query, categories]);

    // Reset to "API All" when Clear All
    const handleShowAllReports = () => {
        setSelectedCategory(null);
        setSelectedSubCategory(null);
        setSelectedName(null);
        setIsDynamic(true);
        localStorage.removeItem("reportBreadcrumbCategory");
        localStorage.removeItem("reportBreadcrumbTitle");
        router.push("/report-store");
    };

    // When any filter is used, switch live API mode
    const handleCategoryChange = (catId) => {
        setSelectedCategory(catId);
        setSelectedSubCategory(null);
        setIsDynamic(true);
    };
    const handleSubCategoryChange = (subCatId) => {
        setSelectedSubCategory(subCatId);
        setIsDynamic(true);
    };
    const handleNameChange = (name) => setSelectedName(name);

    // Desktop detection for responsive behavior
    useEffect(() => {
        if (!isClient) return;

        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
        };

        handleResize(); // Set initial value
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isClient]);

    const pageSubSlug = decodedPath?.split("/")?.[3] ?? "";

    const codeNumber = useMemo(() => {
        if (pageType && !pageSlug && !pageSubSlug) {
            return `report-store`;
        } else if (pageType && pageSlug && !pageSubSlug) {
            return `report-store/${pageSlug}`;
        } else if (pageType && pageSlug && pageSubSlug) {
            return `report-store/${pageSlug}/${pageSubSlug}`;
        }
        return `report-store`;
    }, [pageType, pageSlug, pageSubSlug]);

    return (
        <div className="flex flex-col min-h-screen bg-[#ffffff]">
            <main className="flex-1 w-full">
                <div className="max-w-[85%] max-w-1440-95p max-w-1366-98p max-w-1024-98p max-w-900-1200-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="pt-4 ms-1 pb-2">
                        <Breadcrumb
                            items={[
                                { label: "Reports-store", href: "/report-store", onClick: handleShowAllReports },
                                ...(codeNumber
                                    ? codeNumber
                                          .split("/")
                                          .filter(Boolean)
                                          .slice(1) // skip 'report' because you already added 'Reports'
                                          .map((segment, index, arr) => {
                                              const href = `/report-store/${arr.slice(0, index + 1).join("/")}`;
                                              return {
                                                  label: segment.charAt(0).toUpperCase() + segment.slice(1),
                                                  href,
                                              };
                                          })
                                    : []),
                                ...(selectedName
                                    ? [
                                          {
                                              label: selectedName,
                                              href: `/report-store/${selectedName.toLowerCase().replace(/\s+/g, "-")}`,
                                          },
                                      ]
                                    : []),
                            ]}
                        />
                        {/* {codeNumber ? (
                            <Breadcrumb
                                items={[
                                    { label: "Reports", href: "/report-store", onClick: handleShowAllReports },
                                    ...(selectedName ? [{ label: selectedName, href: `/report-store/${selectedName.toLowerCase().replace(/\s+/g, "-")}` }] : []),
                                ]}
                            />
                        ) : (
                            <Breadcrumb
                                items={[
                                    { label: "Reports", href: "/report-store", onClick: handleShowAllReports },
                                    ...(selectedName ? [{ label: selectedName, href: `/report-store/${selectedName.toLowerCase().replace(/\s+/g, "-")}` }] : []),
                                ]}
                            />
                        )} */}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 pb-6">
                        {/* Desktop Filter - Simple CSS Sticky Implementation */}
                        <div className="hidden lg:block lg:w-[300px] lg:flex-shrink-0">
                            <div
                                className="w-full p-4 bg-[#ffffff] rounded-lg shadow"
                                style={{
                                    position: "sticky",
                                    top: "120px",
                                    width: "inherit",
                                    maxWidth: "inherit",
                                    zIndex: 10,
                                }}
                            >
                                <UrlFilter urlData={urlData} searchParams={searchParams} />
                            </div>
                        </div>
                        {/* Alternative implementation for different filter types
                            {urlData?.type === "report" ? (
                                <div className="hidden lg:flex lg:w-[300px] lg:flex-shrink-0">
                                    <div
                                        className="w-full p-4 bg-[#F9F8F4] rounded-lg shadow"
                                        style={{
                                            position: "sticky",
                                            top: "120px",
                                            alignSelf: "flex-start",
                                            width: "inherit",
                                            maxWidth: "inherit",
                                            zIndex: 10
                                        }}
                                    >
                                        <UrlFilter urlData={urlData} />
                                    </div>
                                </div>
                            ) : (
                                <div className="hidden lg:flex lg:w-[300px] lg:flex-shrink-0">
                                    <div
                                        className="w-full p-4 bg-[#F9F8F4] rounded-lg shadow"
                                        style={{
                                            position: "sticky",
                                            top: "120px",
                                            alignSelf: "flex-start",
                                            width: "inherit",
                                            maxWidth: "inherit",
                                            zIndex: 10
                                        }}
                                    >
                                        <Filter
                                            selectedCategory={selectedCategory}
                                            setSelectedCategory={handleCategoryChange}
                                            selectedSubCategory={selectedSubCategory}
                                            setSelectedSubCategory={handleSubCategoryChange}
                                            selectedName={selectedName}
                                            setSelectedName={handleNameChange}
                                        />
                                    </div>
                                </div>
                            )} */}

                        {/* Mobile Filter */}
                        <div className="lg:hidden mb-4">
                            <button
                                className="w-full flex items-center justify-between px-4 py-3 bg-[#ffffff] rounded-lg shadow text-zinc-900 font-medium hover:bg-[#F5F4F0] transition-colors"
                                onClick={() => setShowMobileFilter(!showMobileFilter)}
                            >
                                <span>Filters</span>
                                <svg
                                    className={`w-5 h-5 transition-transform ${showMobileFilter ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showMobileFilter && (
                                <div className="mt-4 p-4 bg-[#ffffff] rounded-lg shadow">
                                    <UrlFilter urlData={urlData} reportData={reportData} onFilterChange={() => setShowMobileFilter(false)} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            {loadingData ? (
                                <div className="flex justify-center py-12">
                                    <CircularProgress size={35} />
                                </div>
                            ) : isErrorData ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="text-zinc-400 text-4xl mb-4">📄</div>
                                        <p className="text-zinc-600 font-medium">Something went wrong</p>
                                        <p className="text-zinc-500 text-sm mt-1">Please try again later</p>
                                    </div>
                                </div>
                            ) : (
                                <ReportsListProps propsData={reportData} buttonNames={buttonNames} searchParams={searchParams} loadingData={loadingData} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ReportStorePage;
