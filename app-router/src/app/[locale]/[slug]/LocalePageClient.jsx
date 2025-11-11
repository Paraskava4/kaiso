"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useSearchParams, notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { useGetDataByCategoryAndSubcategoryQuery, useGetGlobalSearchDataQuery, useGetUrlToDataQuery } from "@/api/home";
import { isStatusInclude, isStatusIncludeError } from "@/utils/validation/response";
import BlogDetail from "@/app/blogDetails/page";
import ReportDetailsPage from "@/app/report-details/page";

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
    const [slugCategoryData, setCategorySlugData] = useState();

    const pathname = usePathname();
    const decodedPath = decodeURIComponent(pathname);
    const pageType = decodedPath?.split("/")?.[1] ?? "";
    const pageSlug = decodedPath?.split("/")?.[2] ?? "";

    // Primary query
    const { data: getUrlData, error } = useGetUrlToDataQuery(
        { type: pageType === "report-store" ? "report" : pageType === "blog" ? "blogs" : pageType, url: pageSlug },
        { skip: !pageType || !pageSlug, refetchOnMountOrArgChange: true }
    );

    // Fallback/category query
    const {
        data: getCategoryUrlData,
        error: categoryError,
        isLoading: loadingData,
        isFetching: isFetchingData,
        isError: isErrorData,
        isSuccess: isSuccessData,
    } = useGetDataByCategoryAndSubcategoryQuery(
        { type: pageType === "report-store" ? "report" : pageType === "blog" ? "blogs" : pageType, categoryUrl: pageSlug },
        { skip: !pageType || !pageSlug }
    );

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
                return <ReportDetailsPage reportData={slugData} />;
            }
            if (pageType === "blog") {
                return <BlogDetail slugData={slugData} />;
            }
        }

        console.log("slugData", slugData);

        // 2. Main query errors, fallback/category is successful
        if (isStatusIncludeError(error?.status) && isStatusInclude(getCategoryUrlData?.status) && slugCategoryData && pageType === "report-store") {
            return (
                <ReportStorePage
                    reportData={slugCategoryData}
                    loadingData={loadingData || isFetchingData}
                    urlData={{ type: pageType, categoryUrl: pageSlug }}
                    isErrorData={isErrorData || categoryError}
                    isSuccessData={isSuccessData}
                />
            );
        }

        if (isStatusIncludeError(error?.status) && isStatusInclude(getCategoryUrlData?.status) && slugCategoryData && pageType === "blog") {
            return <FeaturedBlogs blogsData={slugCategoryData} />;
        }

        // 3. Both queries error for "report" or "blogs"
        //   if (isStatusIncludeError(error?.status) && pageType === "report") {
        //         return <ReportStorePage reportData={slugData} urlData={{ type: pageType, categoryUrl: pageSlug, subcategoryUrl: pageSubSlug }} />
        //     } else if (isStatusIncludeError(error?.status) && pageType === "blogs") {
        //         return <FeaturedBlogs blogsData={slugData} />
        //     }
        if (isStatusIncludeError(error?.status) && pageType === "report-store") {
            return (
                <ReportStorePage
                    reportData={slugCategoryData}
                    loadingData={loadingData || isFetchingData}
                    urlData={{ type: pageType, categoryUrl: pageSlug }}
                    isErrorData={isErrorData || categoryError}
                    isSuccessData={isSuccessData}
                />
            );
        } else if (isStatusIncludeError(categoryError?.status) && pageType === "blog") {
            return <FeaturedBlogs blogsData={slugCategoryData} />;
        }
        
        // 4. If both queries failed and no data found, show 404
        if (isStatusIncludeError(error?.status) && isStatusIncludeError(categoryError?.status)) {
            notFound();
        }
        
        // Otherwise, could show loader/null
        return null;
    }, [pageType, slugData, slugCategoryData, getUrlData, getCategoryUrlData, error, categoryError]);

    return <>{component}</>;
}
