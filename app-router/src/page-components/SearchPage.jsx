"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Footer } from "../components/layout";
import { SearchHeader, FilterTabs, SearchResultCard } from "../components/search";
import { useGetGlobalSearchDataQuery } from "@/api/home";
import { isStatusInclude } from "@/utils/axiosInstance";
import { isValidArray } from "@/utils/validation/array";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";

const SearchPage = () => {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("allData");
    const [searchTerm, setSearchTerm] = useState("");
    const [globalSearchData, setGlobalSearchData] = useState();
    const { redirect } = useRouteRedirect();

    // Set SEO metadata for Search page - no fallback text (no API data available for search)
    // Search page doesn't have specific API data, so no SEO metadata will be set

    const router = useRouter();

    const params = { search: searchTerm };
    const { data: getGlobalSearchRes } = useGetGlobalSearchDataQuery(params, { skip: !params?.search });

    // Get search term from URL parameters
    useEffect(() => {
        const queryParam = searchParams.get("q");
        if (queryParam) {
            setSearchTerm(queryParam);
        } else {
            setSearchTerm("Green Energy"); // Default search term
        }
    }, [searchParams]);

    const handleSearchChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab?.value);
    };

    // const handleReadMore = (resultId) => {
    // };
    const handleReadMore = (id) => {
        if (id?.type === "Blog" || id?.type === "News Article") {
            redirect(`blog/${id?._id}`);
        } else {
            redirect(`report-details?reportId=${id?._id}`);
        }
    };

    useEffect(() => {
        if (!isStatusInclude(getGlobalSearchRes?.status)) return;
        setGlobalSearchData(getGlobalSearchRes?.data);
    }, [getGlobalSearchRes]);

    const getDisplayData = () => {
        if (activeTab === "allData") {
            const allReports = isValidArray(globalSearchData?.allReports) ? globalSearchData.allReports : [];
            const blogs = isValidArray(globalSearchData?.blogs) ? globalSearchData.blogs : [];
            const articles = isValidArray(globalSearchData?.articles) ? globalSearchData.articles : [];
            return [...allReports, ...blogs, ...articles];
        }
        return isValidArray(globalSearchData?.[activeTab]) ? globalSearchData[activeTab] : [];
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 bg-white flex justify-center search-page-main">
                <div className="xs:!w-[80%] sm:!w-[80%] md:!w-[80%] lg:!w-[81%] xl:!w-[81%] search-page-container mx-auto">
                    <SearchHeader searchTerm={searchTerm} onSearchChange={handleSearchChange} onClear={handleClearSearch} />
                    <div className="search-filter-spacing">
                        <FilterTabs
                            activeTab={activeTab}
                            resultCount={isValidArray(getDisplayData()) ? getDisplayData().length : 0}
                            onTabChange={handleTabChange}
                        />
                    </div>

                    <div className="flex flex-col items-center search-results-spacing ">
                        {isValidArray(getDisplayData()) &&
                            getDisplayData()?.map((reactItem, index) => {
                                return (
                                    <React.Fragment key={index + 1}>
                                        <SearchResultCard
                                            publishDate={reactItem?.publishDate}
                                            category={reactItem?.categoryId?.name}
                                            sector={reactItem?.sector}
                                            title={reactItem?.reportTitle || reactItem?.blogTitle}
                                            description={reactItem?.subCategoryId?.name}
                                            onReadMore={() => handleReadMore(reactItem)}
                                        />
                                    </React.Fragment>
                                );
                            })}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SearchPage;
