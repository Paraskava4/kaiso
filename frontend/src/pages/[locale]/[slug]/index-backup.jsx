import { useEffect, useMemo, useState, Suspense } from "react";
import { useGetUrlToDataQuery, useGetDataByCategoryAndSubcategoryQuery } from "@/api/home";
import { isStatusInclude, isStatusIncludeError } from "@/utils/axiosInstance";
import { usePathname } from "next/navigation";
import { BASE_URL } from "../../../../config";
import UniversalSEO from "@/utils/seo/universalSEO";
import dynamic from "next/dynamic";

// Dynamic imports for better code splitting and performance
const ReportDetailsPage = dynamic(() => import("@/pages/report-details"), {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
    ssr: true,
});

const ReportStorePage = dynamic(() => import("@/page-components").then((mod) => ({ default: mod.ReportStorePage })), {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
    ssr: true,
});

const FeaturedBlogs = dynamic(() => import("@/components/pages/blog/sections/FeaturedBlogs"), {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
    ssr: true,
});

const BlogDetail = dynamic(() => import("@/pages/blogDetails"), {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
    ssr: true,
});

const Index = ({ seoData, initialData }) => {
    const [slugData, setSlugData] = useState(initialData?.slugData);
    const [slugCategoryData, setCategorySlugData] = useState(initialData?.categoryData);

    const pathname = usePathname();
    const decodedPath = decodeURIComponent(pathname);
    const pageType = decodedPath?.split("/")?.[1] ?? "";
    const pageSlug = decodedPath?.split("/")?.[2] ?? "";

    // Memoize query parameters for better performance
    const memoizedQueryParams = useMemo(
        () => ({
            type: pageType === "report-store" ? "report" : pageType === "blog" ? "blogs" : pageType,
            url: pageSlug,
        }),
        [pageType, pageSlug]
    );

    const memoizedCategoryParams = useMemo(
        () => ({
            type: pageType === "report-store" ? "report" : pageType === "blog" ? "blogs" : pageType,
            categoryUrl: pageSlug,
        }),
        [pageType, pageSlug]
    );

    // Only fetch if we don't have initial data
    const shouldFetch = !initialData?.slugData && !initialData?.categoryData;

    // Primary query with enhanced caching
    const { data: getUrlData, error } = useGetUrlToDataQuery(memoizedQueryParams, {
        skip: !pageType || !pageSlug || !shouldFetch,
        refetchOnMountOrArgChange: 300, // 5 minutes
        refetchOnFocus: false,
        refetchOnReconnect: true,
    });

    // Fallback/category query with enhanced caching
    const {
        data: getCategoryUrlData,
        error: categoryError,
        isLoading: loadingData,
        isFetching: isFetchingData,
        isError: isErrorData,
        isSuccess: isSuccessData,
    } = useGetDataByCategoryAndSubcategoryQuery(memoizedCategoryParams, {
        skip: !pageType || !pageSlug || !shouldFetch,
        refetchOnMountOrArgChange: 300, // 5 minutes
        refetchOnFocus: false,
    });

    useEffect(() => {
        if (isStatusInclude(getUrlData?.status)) {
            setSlugData(getUrlData?.data);
        }
    }, [getUrlData]);

    useEffect(() => {
        if (isStatusInclude(getCategoryUrlData?.status)) {
            setCategorySlugData(getCategoryUrlData?.data);
        }
    }, [getCategoryUrlData]);

    const component = useMemo(() => {
        // 1. Success with main query
        if (isStatusInclude(getUrlData?.status) && slugData) {
            if (pageType === "report-store") {
                return (
                    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                        <ReportDetailsPage reportData={slugData} />
                    </Suspense>
                );
            }
            if (pageType === "blog") {
                return (
                    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                        <BlogDetail slugData={slugData} />
                    </Suspense>
                );
            }
        }

        // 2. Main query errors, fallback/category is successful
        if (isStatusIncludeError(error?.status) && isStatusInclude(getCategoryUrlData?.status) && slugCategoryData && pageType === "report-store") {
            return (
                <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                    <ReportStorePage
                        reportData={slugCategoryData}
                        loadingData={loadingData || isFetchingData}
                        urlData={{ type: pageType, categoryUrl: pageSlug }}
                        isErrorData={isErrorData || categoryError}
                        isSuccessData={isSuccessData}
                    />
                </Suspense>
            );
        }

        if (isStatusIncludeError(error?.status) && isStatusInclude(getCategoryUrlData?.status) && slugCategoryData && pageType === "blog") {
            return (
                <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                    <FeaturedBlogs blogsData={slugCategoryData} />
                </Suspense>
            );
        }

        if (isStatusIncludeError(error?.status) && pageType === "report-store") {
            return (
                <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                    <ReportStorePage
                        reportData={slugCategoryData}
                        loadingData={loadingData || isFetchingData}
                        urlData={{ type: pageType, categoryUrl: pageSlug }}
                        isErrorData={isErrorData || categoryError}
                        isSuccessData={isSuccessData}
                    />
                </Suspense>
            );
        } else if (isStatusIncludeError(categoryError?.status) && pageType === "blog") {
            return (
                <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                    <FeaturedBlogs blogsData={slugCategoryData} />
                </Suspense>
            );
        }

        // Loading state
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading content...</p>
                </div>
            </div>
        );
    }, [
        pageType,
        slugData,
        slugCategoryData,
        getUrlData,
        getCategoryUrlData,
        error,
        categoryError,
        loadingData,
        isFetchingData,
        pageSlug,
        isErrorData,
        isSuccessData,
    ]);

    return (
        <>
            <UniversalSEO seoData={seoData} />
            {component}
        </>
    );
};

export default Index;

// Enhanced static generation with ISR
export async function getStaticPaths() {
    // Pre-generate common paths for better performance
    const commonPaths = [
        { params: { locale: "report-store", slug: "technology" } },
        { params: { locale: "report-store", slug: "healthcare" } },
        { params: { locale: "report-store", slug: "finance" } },
        { params: { locale: "blog", slug: "industry-insights" } },
        { params: { locale: "blog", slug: "market-analysis" } },
    ];

    return {
        paths: commonPaths,
        fallback: "blocking", // Enable ISR for dynamic routes
    };
}

export async function getStaticProps({ params }) {
    const { locale, slug } = params;

    let seoItem = null;
    let slugData = null;
    let categoryData = null;

    try {
        // Decide API endpoint based on page type
        const type = locale === "report-store" ? "report" : locale === "blog" ? "blogs" : locale;

        // Create AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        // Fetch both primary and fallback data in parallel
        const [primaryRes, categoryRes] = await Promise.allSettled([
            fetch(`${BASE_URL}/web/getDataByURL?type=${type}&url=${slug}`, {
                next: { revalidate: 1800 }, // Cache for 30 minutes
                signal: controller.signal,
                headers: { "Content-Type": "application/json" },
            }),
            fetch(`${BASE_URL}/web/getDataByCategoryAndSubcategory?type=${type}&categoryUrl=${slug}`, {
                next: { revalidate: 1800 }, // Cache for 30 minutes
                signal: controller.signal,
                headers: { "Content-Type": "application/json" },
            }),
        ]);

        clearTimeout(timeoutId);

        // Process primary API response
        if (primaryRes.status === "fulfilled" && primaryRes.value.ok) {
            const data = await primaryRes.value.json();
            if (data?.status === 200 && data?.data) {
                seoItem = data.data;
                slugData = data.data;
            }
        }

        // Process category API response
        if (categoryRes.status === "fulfilled" && categoryRes.value.ok) {
            const catData = await categoryRes.value.json();
            if (catData?.status === 200 && catData?.data) {
                categoryData = catData.data;
                if (!seoItem) {
                    seoItem = {
                        seoTitle: catData?.data?.[0]?.categoryId?.name,
                        metaDescription: catData?.data?.[0]?.categoryId?.description,
                        ogTitle: catData?.data?.[0]?.categoryId?.name,
                        ogDescription: catData?.data?.[0]?.categoryId?.description,
                    };
                }
            }
        }
    } catch (err) {
        console.error("Error fetching SEO data:", err.message);
    }

    return {
        props: {
            seoData: {
                seoTitle: seoItem?.seoTitle || "Reports & Blogs - Kaiso Research",
                metaDescription: seoItem?.metaDescription || "Explore our comprehensive research reports and blogs covering industries, markets, and insights.",
                ogTitle: seoItem?.seoTitle || "Reports & Blogs - Kaiso Research",
                ogDescription: seoItem?.metaDescription || "Explore our comprehensive research reports and blogs covering industries, markets, and insights.",
                author: seoItem?.author || "Reports & Blogs - Kaiso Research",
            },
            initialData: {
                slugData: slugData,
                categoryData: categoryData,
            },
        },
        revalidate: 1800, // Revalidate every 30 minutes
    };
}
