import { isStatusInclude } from "@/utils/axiosInstance";
import UniversalSEO from "@/utils/seo/universalSEO";
import { usePathname } from "next/navigation";
import React, { useMemo, Suspense } from "react";
import { BASE_URL } from "../../../../../config";
import dynamic from "next/dynamic";

// Dynamic imports for better code splitting
const ReportStorePage = dynamic(() => import("@/page-components").then(mod => ({ default: mod.ReportStorePage })), {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
    ssr: true
});

const FeaturedBlogs = dynamic(() => import("@/components/pages/blog/sections/FeaturedBlogs"), {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
    ssr: true
});

const Index = ({ seoData, pageData, error, timestamp }) => {
    const pathname = usePathname();
    const decodedPath = decodeURIComponent(pathname);
    const pageType = decodedPath?.split("/")?.[1] ?? "";
    const pageSlug = decodedPath?.split("/")?.[2] ?? "";
    const pageSubSlug = decodedPath?.split("/")?.[3] ?? "";

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

        if (pageData && pageType === "report-store") {
            return (
                <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                    <ReportStorePage
                        reportData={pageData}
                        loadingData={false}
                        urlData={{
                            type: pageType === "report-store" ? "report" : pageType === "blog" ? "blogs" : pageType,
                            categoryUrl: pageSlug,
                            subcategoryUrl: pageSubSlug,
                        }}
                    />
                </Suspense>
            );
        }

        if (pageData && pageType === "blogs") {
            return (
                <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                    <FeaturedBlogs blogsData={pageData} />
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
    }, [pageType, pageData, error, pageSlug, pageSubSlug]);

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
    const { locale, slug, sub_slug } = params;
    
    // Set aggressive cache headers for edge caching
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.setHeader('CDN-Cache-Control', 'max-age=300');
    
    try {
        const type = locale === "report-store" ? "report" : locale === "blog" ? "blog" : locale;

        // Fast parallel API calls with short timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

        const [primaryRes, categoryRes] = await Promise.allSettled([
            fetch(`${BASE_URL}/web/getDataByURL?type=${type}&url=${sub_slug || slug}`, {
                signal: controller.signal,
                headers: { 'Content-Type': 'application/json' }
            }),
            fetch(`${BASE_URL}/web/getDataByCategoryAndSubcategory?type=${type}&categoryUrl=${slug}&subcategoryUrl=${sub_slug || ""}`, {
                signal: controller.signal,
                headers: { 'Content-Type': 'application/json' }
            })
        ]);
        
        clearTimeout(timeoutId);
        
        // Process primary API response
        let seoItem = null;
        let pageData = null;

        if (primaryRes.status === 'fulfilled' && primaryRes.value.ok) {
            const data = await primaryRes.value.json();
            if (data?.status === 200 && data?.data) {
                seoItem = data.data;
                pageData = data.data;
            }
        }

        // Process category API response
        if (categoryRes.status === 'fulfilled' && categoryRes.value.ok) {
            const catData = await categoryRes.value.json();
            if (catData?.status === 200 && catData?.data) {
                if (!pageData) {
                    pageData = catData.data;
                }
                if (!seoItem) {
                    seoItem = {
                        seoTitle: catData?.data?.[0]?.subCategoryId?.name,
                        metaDescription: catData?.data?.[0]?.subCategoryId?.description,
                        ogTitle: catData?.data?.[0]?.subCategoryId?.name,
                        ogDescription: catData?.data?.[0]?.subCategoryId?.description,
                    };
                }
            }
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
                pageData: pageData,
                error: null,
                timestamp: Date.now()
            }
        };
    } catch (err) {
        console.error("SSR Error:", err.message);
        
        return {
            props: {
                seoData: {
                    seoTitle: "Reports & Blogs - Kaiso Research",
                    metaDescription: "Explore our comprehensive research reports and blogs covering industries, markets, and insights.",
                    ogTitle: "Reports & Blogs - Kaiso Research",
                    ogDescription: "Explore our comprehensive research reports and blogs covering industries, markets, and insights.",
                    author: "Reports & Blogs - Kaiso Research",
                },
                pageData: null,
                error: err.message,
                timestamp: Date.now()
            }
        };
    }
}

export default Index;