import { useGetGlobalSearchDataQuery } from "@/api/home";
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

const Index = ({ seoData, pageData, error, timestamp }) => {
    const [searchData, setSearchData] = useState();

    const pathname = usePathname();
    const { redirect } = useRouteRedirect();
    const decodedPath = decodeURIComponent(pathname);
    const pageType = decodedPath?.split("/")?.[1] ?? "";
    const pathNameArray = pathname?.split("/");
    const searchParams = useSearchParams();
    const getSearchText = searchParams?.get("search");

    const memoizedParams = useMemo(() => ({ search: getSearchText }), [getSearchText]);

    // Only fetch search data client-side
    const { data: getGlobalSearchRes, error: globalSearchError } = useGetGlobalSearchDataQuery(
        memoizedParams, 
        { 
            skip: !getSearchText,
            refetchOnMountOrArgChange: 60,
            refetchOnFocus: false
        }
    );

    useEffect(() => {
        if (isStatusInclude(getGlobalSearchRes?.status)) {
            setSearchData(getGlobalSearchRes?.data?.allReports);
        }
    }, [getGlobalSearchRes, getSearchText]);

    // Memoized render logic for better performance
    const renderContent = useMemo(() => {
        if (error) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️ Error Loading Content</div>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

        if (pathNameArray?.length <= 2 && pathNameArray?.[1] === "report-store") {
            return (
                <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                    <ReportStorePageDynamic
                        reportData={getSearchText ? searchData : pageData}
                        loadingData={false} // Data is already loaded
                        urlData={{ type: pageType }}
                        searchParams={searchParams?.get("search")}
                        isErrorData={false}
                        isSuccessData={true}
                    />
                </Suspense>
            );
        }

        if (pathNameArray?.length <= 2 && pathNameArray?.[1] === "blog") {
            return (
                <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                    <FeaturedBlogsDynamic
                        blogData={getSearchText ? searchData : pageData}
                        loadingData={false} // Data is already loaded
                        urlData={{ type: pageType }}
                        searchParams={searchParams?.get("search")}
                        isErrorData={false}
                        isSuccessData={true}
                    />
                </Suspense>
            );
        }

        // Default fallback UI
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading content...</p>
                </div>
            </div>
        );
    }, [pathNameArray, getSearchText, searchData, pageData, error, pageType, searchParams]);

    return (
        <>
            <UniversalSEO seoData={seoData} />
            {renderContent}
            {/* Debug info in development */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs rounded">
                    SSR: {timestamp ? new Date(timestamp).toLocaleTimeString() : 'N/A'}
                </div>
            )}
        </>
    );
};

// Server-Side Rendering with Edge Caching
export async function getServerSideProps({ params, req, res }) {
    const { locale } = params || {};
    
    // Set aggressive cache headers for edge caching
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.setHeader('CDN-Cache-Control', 'max-age=300');
    
    try {
        // Fast parallel API calls with short timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
        
        const [navbarRes, categoryRes] = await Promise.allSettled([
            fetch(`${BASE_URL}/web/getNavbar`, {
                signal: controller.signal,
                headers: { 'Content-Type': 'application/json' }
            }),
            fetch(`${BASE_URL}/web/getDataByCategoryAndSubcategory?type=${locale === "report-store" ? "report" : locale === "blog" ? "blogs" : locale}`, {
                signal: controller.signal,
                headers: { 'Content-Type': 'application/json' }
            })
        ]);
        
        clearTimeout(timeoutId);
        
        // Process navbar data
        let seoData = null;
        if (navbarRes.status === 'fulfilled' && navbarRes.value.ok) {
            const navbarData = await navbarRes.value.json();
            const seoItem = locale === "report-store" 
                ? navbarData?.data?.find((item) => item?.name === "Report Store")?.siteMenu?.find((sub) => sub?.url === "report-store") 
                : {};

            seoData = {
                seoTitle: seoItem?.seoTitle || "Kaiso Research - Reports & Blogs",
                metaDescription: seoItem?.metaDescription || "Explore our comprehensive research reports, blogs, and insights across industries and markets.",
                ogTitle: seoItem?.seoTitle || "Kaiso Research - Reports & Blogs",
                ogDescription: seoItem?.metaDescription || "Explore our comprehensive research reports, blogs, and insights across industries and markets.",
            };
        }

        // Process category data
        let pageData = null;
        if (categoryRes.status === 'fulfilled' && categoryRes.value.ok) {
            const categoryResult = await categoryRes.value.json();
            if (isStatusInclude(categoryResult?.status)) {
                pageData = categoryResult.data;
            }
        }

        return {
            props: {
                seoData: seoData || {
                    seoTitle: "Kaiso Research - Reports & Blogs",
                    metaDescription: "Explore our comprehensive research reports, blogs, and insights across industries and markets.",
                    ogTitle: "Kaiso Research - Reports & Blogs",
                    ogDescription: "Explore our comprehensive research reports, blogs, and insights across industries and markets.",
                },
                pageData: pageData,
                error: null,
                timestamp: Date.now()
            }
        };
    } catch (error) {
        console.error('SSR Error:', error.message);
        
        return {
            props: {
                seoData: {
                    seoTitle: "Kaiso Research - Reports & Blogs",
                    metaDescription: "Explore our comprehensive research reports, blogs, and insights across industries and markets.",
                    ogTitle: "Kaiso Research - Reports & Blogs",
                    ogDescription: "Explore our comprehensive research reports, blogs, and insights across industries and markets.",
                },
                pageData: null,
                error: error.message,
                timestamp: Date.now()
            }
        };
    }
}

export default Index;
