import { useEffect, useMemo, useState, Suspense } from "react";
import { useGetDataByCategoryAndSubcategoryQuery } from "@/api/home";
import { isStatusInclude, isStatusIncludeError } from "@/utils/axiosInstance";
import { usePathname } from "next/navigation";
import { BASE_URL } from "../../../../../config";
import UniversalSEO from "@/utils/seo/universalSEO";
import dynamic from "next/dynamic";

// Dynamic imports for better code splitting and performance
const ReportStorePage = dynamic(() => import("@/page-components").then(mod => ({ default: mod.ReportStorePage })), {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
    ssr: true
});

const FeaturedBlogs = dynamic(() => import("@/components/pages/blog/sections/FeaturedBlogs"), {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
    ssr: true
});

const Index = ({ seoData }) => {
    const [slugData, setSlugData] = useState();
    const pathname = usePathname();
    const decodedPath = decodeURIComponent(pathname);
    const pageType = decodedPath?.split("/")?.[1] ?? "";
    const pageSlug = decodedPath?.split("/")?.[2] ?? "";
    const pageSubSlug = decodedPath?.split("/")?.[3] ?? "";

    // Memoize query parameters for better performance
    const memoizedQueryParams = useMemo(() => ({
        type: pageType === "report-store" ? "report" : pageType === "blog" ? "blogs" : pageType,
        categoryUrl: pageSlug,
        subcategoryUrl: pageSubSlug
    }), [pageType, pageSlug, pageSubSlug]);

    const {
        data: getUrlData,
        error,
        isLoading: loadingData,
    } = useGetDataByCategoryAndSubcategoryQuery(
        memoizedQueryParams,
        { 
            skip: !pageType || !pageSlug || !pageSubSlug, 
            refetchOnMountOrArgChange: 300, // 5 minutes
            refetchOnFocus: false,
            refetchOnReconnect: true
        }
    );

    useEffect(() => {
        if (isStatusInclude(getUrlData?.status)) {
            setSlugData(getUrlData?.data);
        }
    }, [getUrlData]);

    // Use useMemo to decide which component to render
    const component = useMemo(() => {
        if (!isStatusIncludeError(error?.status)) {
            if (pageType === "report-store") {
                return (
                    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                        <ReportStorePage
                            reportData={slugData}
                            loadingData={loadingData}
                            urlData={{
                                type: pageType === "report-store" ? "report" : pageType === "blog" ? "blogs" : pageType,
                                categoryUrl: pageSlug,
                                subcategoryUrl: pageSubSlug,
                            }}
                        />
                    </Suspense>
                );
            }
            if (pageType === "blogs") {
                return (
                    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                        <FeaturedBlogs blogsData={slugData} />
                    </Suspense>
                );
            }
        } else {
            if (isStatusIncludeError(error?.status) && pageType === "report-store") {
                return (
                    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                        <ReportStorePage
                            reportData={slugData}
                            loadingData={loadingData}
                            urlData={{ type: pageType, categoryUrl: pageSlug, subcategoryUrl: pageSubSlug }}
                        />
                    </Suspense>
                );
            } else if (isStatusIncludeError(error?.status) && pageType === "blogs") {
                return (
                    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                        <FeaturedBlogs blogsData={slugData} />
                    </Suspense>
                );
            }
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
    }, [pageType, slugData, error, loadingData, pageSlug, pageSubSlug]);

    return (
        <>
            <UniversalSEO seoData={seoData} />
            {component}
        </>
    );
};

// Enhanced static generation with ISR for subcategory routes
export async function getStaticPaths() {
    // Pre-generate common subcategory paths for better performance
    const commonPaths = [
        { params: { locale: 'report-store', slug: 'technology', sub_slug: 'ai-ml' } },
        { params: { locale: 'report-store', slug: 'technology', sub_slug: 'blockchain' } },
        { params: { locale: 'report-store', slug: 'healthcare', sub_slug: 'pharmaceuticals' } },
        { params: { locale: 'report-store', slug: 'healthcare', sub_slug: 'medical-devices' } },
        { params: { locale: 'blog', slug: 'industry-insights', sub_slug: 'trends' } },
        { params: { locale: 'blog', slug: 'market-analysis', sub_slug: 'forecasts' } },
    ];

    return {
        paths: commonPaths,
        fallback: 'blocking', // Enable ISR for dynamic routes
    };
}

export async function getStaticProps({ params }) {
    const { locale, slug, sub_slug } = params;
    
    let seoItem = null;

    try {
        const type = locale === "report-store" ? "report" : locale === "blog" ? "blog" : locale;

        // Create AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 second timeout

        // 1. Try primary SEO API with caching
        const res = await fetch(`${BASE_URL}/web/getDataByURL?type=${type}&url=${sub_slug || slug}`, {
            next: { revalidate: 1800 }, // Cache for 30 minutes
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        clearTimeout(timeoutId);
        
        if (res.ok) {
            const data = await res.json();
            if (data?.status === 200 && data?.data) {
                seoItem = data.data;
            }
        }

        if (!seoItem) {
            // 2. Fallback: category/subcategory API with timeout
            const catController = new AbortController();
            const catTimeoutId = setTimeout(() => catController.abort(), 4000); // 4 second timeout
            
            const catRes = await fetch(`${BASE_URL}/web/getDataByCategoryAndSubcategory?type=${type}&categoryUrl=${slug}&subcategoryUrl=${sub_slug || ""}`, {
                next: { revalidate: 1800 }, // Cache for 30 minutes
                signal: catController.signal,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            clearTimeout(catTimeoutId);
            
            if (catRes.ok) {
                const catData = await catRes.json();
                if (catData?.status === 200 && catData?.data) {
                    seoItem = {
                        seoTitle: catData?.data?.[0]?.subCategoryId?.name,
                        metaDescription: catData?.data?.[0]?.subCategoryId?.description,
                        ogTitle: catData?.data?.[0]?.subCategoryId?.name,
                        ogDescription: catData?.data?.[0]?.subCategoryId?.description,
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
        },
        revalidate: 1800, // Revalidate every 30 minutes
    };
}

export default Index;
