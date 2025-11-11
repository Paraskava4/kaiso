"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useSearchParams, notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { useGetDataByCategoryAndSubcategoryQuery } from "@/api/home";
import { isStatusInclude, isStatusIncludeError } from "@/utils/validation/response";

const ReportStorePage = dynamic(
    () =>
        import("@/page-components").then((m) => ({
            default: m.ReportStorePage,
        })),
    { ssr: true }
);

const FeaturedBlogs = dynamic(() => import("@/components/pages/blog/sections/FeaturedBlogs"), { ssr: true });

export default function LocalePageClient({ params }) {
    const [slugData, setSlugData] = useState();
    const pathname = usePathname();
    const decodedPath = decodeURIComponent(pathname);
    const pageType = decodedPath?.split("/")?.[1] ?? "";
    const pageSlug = decodedPath?.split("/")?.[2] ?? "";
    const pageSubSlug = decodedPath?.split("/")?.[3] ?? "";

    const {
        data: getUrlData,
        error,
        isLoading: loadingData,
    } = useGetDataByCategoryAndSubcategoryQuery(
        { type: pageType === "report-store" ? "report" : pageType === "blog" ? "blogs" : pageType, categoryUrl: pageSlug, subcategoryUrl: pageSubSlug },
        { skip: !pageType || !pageSlug || !pageSubSlug, refetchOnMountOrArgChange: true }
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
                    <ReportStorePage
                        reportData={slugData}
                        loadingData={loadingData}
                        urlData={{
                            type: pageType === "report-store" ? "report" : pageType === "blog" ? "blogs" : pageType,
                            categoryUrl: pageSlug,
                            subcategoryUrl: pageSubSlug,
                        }}
                    />
                );
            }
            if (pageType === "blogs") {
                return <FeaturedBlogs blogsData={slugData} />;
            }
        } else {
            if (isStatusIncludeError(error?.status) && pageType === "report-store") {
                return (
                    <ReportStorePage
                        reportData={slugData}
                        loadingData={loadingData}
                        urlData={{ type: pageType, categoryUrl: pageSlug, subcategoryUrl: pageSubSlug }}
                    />
                );
            } else if (isStatusIncludeError(error?.status) && pageType === "blogs") {
                return <FeaturedBlogs blogsData={slugData} />;
            }
        }
        
        // If no data found and error occurred, show 404
        if (isStatusIncludeError(error?.status) && !slugData) {
            notFound();
        }
        
        return null;
    }, [pageType, slugData, error]);

    return <>{component}</>;
}
