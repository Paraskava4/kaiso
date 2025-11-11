import { useGetDataByCategoryAndSubcategoryQuery, useGetGlobalSearchDataQuery } from "@/api/home";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { ReportStorePage } from "@/page-components";
import { isStatusInclude } from "@/utils/axiosInstance";
import UniversalSEO from "@/utils/seo/universalSEO";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useMemo, Suspense } from "react";
import { BASE_URL } from "../../../config";
import FeaturedBlogs from "@/components/pages/blog/sections/FeaturedBlogs";
import dynamic from "next/dynamic";

// Dynamic imports for better code splitting
const ReportStorePageDynamic = dynamic(() => import("@/page-components").then(mod => ({ default: mod.ReportStorePage })), {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
    ssr: true
});

const FeaturedBlogsDynamic = dynamic(() => import("@/components/pages/blog/sections/FeaturedBlogs"), {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
    ssr: true
});

const Index = ({ seoData, initialData }) => {
    const [slugCategoryData, setCategorySlugData] = useState(initialData?.categoryData);
    const [searchData, setSearchData] = useState();

    const pathname = usePathname();
    const { redirect } = useRouteRedirect();
    const decodedPath = decodeURIComponent(pathname);
    const pageType = decodedPath?.split("/")?.[1] ?? "";
    const pathNameArray = pathname?.split("/");
    const searchParams = useSearchParams();
    const getSearchText = searchParams?.get("search");

    // Memoize expensive computations
    const memoizedPageType = useMemo(() => {
        return pageType === "report-store" ? "report" : pageType === "blog" ? "blogs" : pageType;
    }, [pageType]);

    const memoizedParams = useMemo(() => ({ search: getSearchText }), [getSearchText]);

    // Only fetch if we don't have initial data or if it's a search query
    const shouldFetch = !initialData?.categoryData || getSearchText;
    
    const {
        data: getCategoryUrlData,
        error: categoryError,
        isLoading: loadingData,
        isFetching: isFetchingData,
        isError: isErrorData,
        isSuccess: isSuccessData,
    } = useGetDataByCategoryAndSubcategoryQuery(
        { type: memoizedPageType },
        { 
            skip: !pageType || !shouldFetch,
            // Enhanced caching
            refetchOnMountOrArgChange: 300, // 5 minutes
            refetchOnFocus: false,
            refetchOnReconnect: true
        }
    );

    const { data: getGlobalSearchRes, error: globalSearchError } = useGetGlobalSearchDataQuery(
        memoizedParams, 
        { 
            skip: !getSearchText,
            // Enhanced caching for search
            refetchOnMountOrArgChange: 60, // 1 minute for search
            refetchOnFocus: false
        }
    );

    useEffect(() => {
        if (isStatusInclude(getCategoryUrlData?.status)) {
            setCategorySlugData(getCategoryUrlData?.data);
        }
    }, [getCategoryUrlData]);

    useEffect(() => {
        if (isStatusInclude(getGlobalSearchRes?.status)) {
            setSearchData(getGlobalSearchRes?.data?.allReports);
            // setCategorySlugData(getGlobalSearchRes?.data);
        }
    }, [getGlobalSearchRes, getSearchText]);

    console.log("pathNameArray", pathNameArray);

    // Handle redirects in useEffect
    // useEffect(() => {
    //     if (pathNameArray?.length <= 2) {
    //         if (pathNameArray?.[1] !== "blog") {
    //             redirect(`/`);
    //         } else if (pathNameArray?.[1] !== "report-store") {
    //             redirect(`/`);
    //         }
    //     }
    // }, [pathname, redirect]);

    // Memoized render logic for better performance
    const renderContent = useMemo(() => {
        // Use initial data if available, otherwise use fetched data
        const displayData = slugCategoryData || initialData?.categoryData;
        const isLoading = loadingData || isFetchingData;
        
        if (pathNameArray?.length <= 2 && pathNameArray?.[1] === "report-store") {
            return (
                <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                    <ReportStorePageDynamic
                        reportData={getSearchText ? searchData : displayData}
                        loadingData={isLoading && !displayData}
                        urlData={{ type: pageType }}
                        searchParams={searchParams?.get("search")}
                        isErrorData={isErrorData || categoryError}
                        isSuccessData={isSuccessData || !!displayData}
                    />
                </Suspense>
            );
        }

        if (pathNameArray?.length <= 2 && pathNameArray?.[1] === "blog") {
            return (
                <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                    <FeaturedBlogsDynamic
                        blogData={getSearchText ? searchData : displayData}
                        loadingData={isLoading && !displayData}
                        urlData={{ type: pageType }}
                        searchParams={searchParams?.get("search")}
                        isErrorData={isErrorData || categoryError}
                        isSuccessData={isSuccessData || !!displayData}
                    />
                </Suspense>
            );
        }

        // Default fallback UI with loading state
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading content...</p>
                </div>
            </div>
        );
    }, [pathNameArray, getSearchText, searchData, slugCategoryData, initialData?.categoryData, loadingData, isFetchingData, pageType, searchParams, isErrorData, categoryError, isSuccessData]);

    return (
        <>
            <UniversalSEO seoData={seoData} />
            {renderContent}
        </>
    );
};

// Enhanced static generation with fallback
export async function getStaticPaths() {
    // Pre-generate common paths for better performance
    const commonPaths = [
        { params: { locale: 'report-store' } },
        { params: { locale: 'blog' } },
    ];

    return {
        paths: commonPaths,
        fallback: 'blocking', // Enable ISR for dynamic routes
    };
}

export async function getStaticProps({ params }) {
    const { locale } = params || {};
    
    try {
        // Create AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        // Fetch both navbar and category data in parallel
        const [navbarRes, categoryRes] = await Promise.allSettled([
            fetch(`${BASE_URL}/web/getNavbar`, {
                next: { revalidate: 3600 }, // Cache for 1 hour
                signal: controller.signal,
                headers: { 'Content-Type': 'application/json' }
            }),
            fetch(`${BASE_URL}/web/getDataByCategoryAndSubcategory?type=${locale === "report-store" ? "report" : locale === "blog" ? "blogs" : locale}`, {
                next: { revalidate: 1800 }, // Cache for 30 minutes
                signal: controller.signal,
                headers: { 'Content-Type': 'application/json' }
            })
        ]);
        
        clearTimeout(timeoutId);
        
        // Process navbar data
        let seoData = null;
        if (navbarRes.status === 'fulfilled' && navbarRes.value.ok) {
            seoData = await navbarRes.value.json();
        }
        
        // Process category data
        let categoryData = null;
        if (categoryRes.status === 'fulfilled' && categoryRes.value.ok) {
            const categoryResult = await categoryRes.value.json();
            if (isStatusInclude(categoryResult?.status)) {
                categoryData = categoryResult.data;
            }
        }
        
        const seoItem = locale === "report-store" 
            ? seoData?.data?.find((item) => item?.name === "Report Store")?.siteMenu?.find((sub) => sub?.url === "report-store") 
            : {};

        return {
            props: {
                seoData: {
                    seoTitle: seoItem?.seoTitle || "Kaiso Research - Reports & Blogs",
                    metaDescription: seoItem?.metaDescription || "Explore our comprehensive research reports, blogs, and insights across industries and markets.",
                    ogTitle: seoItem?.seoTitle || "Kaiso Research - Reports & Blogs",
                    ogDescription: seoItem?.metaDescription || "Explore our comprehensive research reports, blogs, and insights across industries and markets.",
                },
                initialData: {
                    categoryData: categoryData
                }
            },
            revalidate: 1800, // Revalidate every 30 minutes
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error.message);
        
        // Return fallback props on error
        return {
            props: {
                seoData: {
                    seoTitle: "Kaiso Research - Reports & Blogs",
                    metaDescription: "Explore our comprehensive research reports, blogs, and insights across industries and markets.",
                    ogTitle: "Kaiso Research - Reports & Blogs",
                    ogDescription: "Explore our comprehensive research reports, blogs, and insights across industries and markets.",
                },
                initialData: {
                    categoryData: null
                }
            },
            revalidate: 60, // Shorter revalidate on error
        };
    }
}

export default Index;
