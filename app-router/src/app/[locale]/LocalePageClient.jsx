"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams, notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { useGetDataByCategoryAndSubcategoryQuery, useGetGlobalSearchDataQuery } from "@/api/home";
import { isStatusInclude } from "@/utils/validation/response";

const ReportStorePage = dynamic(
    () =>
        import("@/page-components").then((m) => ({
            default: m.ReportStorePage,
        })),
    { ssr: true }
);

const FeaturedBlogs = dynamic(() => import("@/components/pages/blog/sections/FeaturedBlogs"), { ssr: true });

export default function LocalePageClient({ params }) {
    const [slugCategoryData, setCategorySlugData] = useState();
    const [searchData, setSearchData] = useState();

    const pathname = usePathname();
    const { redirect } = useRouteRedirect();
    const decodedPath = decodeURIComponent(pathname);
    const pageType = decodedPath?.split("/")?.[1] ?? "";
    const pathNameArray = pathname?.split("/");
    const searchParams = useSearchParams();
    const getSearchText = searchParams?.get("search");

    const queryParams = { search: getSearchText };

    const {
        data: getCategoryUrlData,
        error: categoryError,
        isLoading: loadingData,
        isFetching: isFetchingData,
        isError: isErrorData,
        isSuccess: isSuccessData,
    } = useGetDataByCategoryAndSubcategoryQuery(
        {
            type: pageType === "report-store" ? "report" : pageType === "blog" ? "blogs" : pageType,
        },
        { skip: !pageType }
    );

    const { data: getGlobalSearchRes, error: globalSearchError } = useGetGlobalSearchDataQuery(queryParams, { skip: !getSearchText });

    useEffect(() => {
        if (isStatusInclude(getCategoryUrlData?.status)) {
            setCategorySlugData(getCategoryUrlData?.data);
        }
    }, [getCategoryUrlData]);

    useEffect(() => {
        if (isStatusInclude(getGlobalSearchRes?.status)) {
            setSearchData(getGlobalSearchRes?.data?.allReports);
        }
    }, [getGlobalSearchRes, getSearchText]);

    // ===== RENDER LOGIC =====

    if (pathNameArray?.length <= 2 && pathNameArray?.[1] === "report-store") {
        return (
            <ReportStorePage
                reportData={getSearchText ? searchData : slugCategoryData}
                loadingData={loadingData || isFetchingData}
                urlData={{ type: pageType }}
                searchParams={getSearchText}
                isErrorData={isErrorData || categoryError}
                isSuccessData={isSuccessData}
            />
        );
    }

    if (pathNameArray?.length <= 2 && pathNameArray?.[1] === "blog") {
        return (
            <FeaturedBlogs
                blogData={getSearchText ? searchData : slugCategoryData}
                loadingData={loadingData || isFetchingData}
                urlData={{ type: pageType }}
                searchParams={getSearchText}
                isErrorData={isErrorData || categoryError}
                isSuccessData={isSuccessData}
            />
        );
    }

    // If URL doesn't match expected patterns, show 404
    notFound();
}
