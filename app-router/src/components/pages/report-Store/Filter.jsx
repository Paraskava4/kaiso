"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BASE_URL } from "../../../../config";
import { fetchWithErrorHandling, parseJsonWithErrorHandling } from "../../../utils/networkError";
import { useGetCategoryAndSubcategoryQuery } from "@/api/home";
import { isStatusInclude } from "@/utils/axiosInstance";
import { isValidArray } from "@/utils/validation/array";
import { Button } from "@mui/material";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";

const Filter = ({ selectedCategory, setSelectedCategory, selectedSubCategory, setSelectedSubCategory, selectedName, setSelectedName, onClearAll }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedIndustries, setExpandedIndustries] = useState({});
    const [reportCategories, setReportCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetchWithErrorHandling(`${BASE_URL}/web/categoryAndSubcategory?type=Report`, {}, "fetching filter categories");
            if (response?.error) {
                setReportCategories([]);
                setExpandedIndustries({});
                return;
            }
            const data = await parseJsonWithErrorHandling(response, "parsing filter categories response");
            if (!data?.data?.reportCategories) {
                setReportCategories([]);
                setExpandedIndustries({});
                return;
            }
            setReportCategories(data.data.reportCategories || []);

            const initialExpanded = {};
            (data.data.reportCategories || []).forEach((cat) => {
                initialExpanded[cat.name] = false;
            });
            if (data.data.reportCategories && data.data.reportCategories.length > 0) {
                const firstCat = data.data.reportCategories[0];
                initialExpanded[firstCat.name] = true;
            }
            setExpandedIndustries(initialExpanded);
        };

        fetchCategories();
    }, []);

    // Effect to expand the selected category when it's set from URL or localStorage
    useEffect(() => {
        if (selectedCategory && reportCategories.length > 0) {
            const matchingCategory = reportCategories.find((cat) => cat.name === selectedCategory || cat._id === selectedCategory);
            if (matchingCategory) {
                setExpandedIndustries((prev) => ({
                    ...prev,
                    [matchingCategory.name]: true,
                }));
            }
        }
    }, [selectedCategory, reportCategories]);

    const toggleIndustry = (industry) =>
        setExpandedIndustries((prev) => ({
            ...prev,
            [industry]: !prev[industry],
        }));

    const clearAll = () => {
        setSearchTerm("");
        setSelectedCategory(null);
        setSelectedSubCategory(null);
        setSelectedName(null);
        setExpandedIndustries(Object.fromEntries(Object.keys(expandedIndustries).map((key) => [key, false])));

        // Call custom clear all handler if provided (for mobile)
        if (onClearAll) {
            onClearAll();
        }
    };

    const filterMatch = (text) => text.toLowerCase().includes(searchTerm.toLowerCase());

    const renderReportCategories = () => {
        const filtered = reportCategories.filter((cat) => filterMatch(cat.name) || cat.subCategories?.some((sub) => filterMatch(sub.name)));
        if (filtered.length === 0) return null;

        return filtered.map((cat) => renderIndustry(cat.name, cat.subCategories, cat._id));
    };

    const renderIndustry = (title, subCategories = [], catId) => {
        const isExpanded = expandedIndustries[title];
        const hasChildren = subCategories?.length > 0;

        const filteredSubs = subCategories?.filter((sub) => filterMatch(sub.name));

        const showChildren = hasChildren && isExpanded;

        return (
            <div key={title} className="w-full border-b border-zinc-300 last:border-b-0">
                <div
                    className={`flex justify-between items-center py-3 sm:py-2.5 text-sm sm:text-base font-medium text-zinc-700 cursor-pointer hover:bg-zinc-50 rounded-md transition-colors ${
                        selectedCategory === catId ? "text-[#d5003c]" : ""
                    }`}
                    onClick={() => {
                        if (hasChildren) {
                            toggleIndustry(title);
                            setSelectedName(title);
                            setSelectedCategory(catId);
                            setSelectedSubCategory(null);
                        } else {
                            setSelectedCategory(catId);
                            setSelectedName(title);
                            setSelectedSubCategory(null);
                        }
                    }}
                >
                    <span className="flex-1 pr-2">{title}</span>
                    {hasChildren && (
                        <Image
                            src={showChildren ? "/icons/Minus.webp" : "/icons/Add_Plus.webp"}
                            alt={showChildren ? "Collapse" : "Expand"}
                            className="w-5 h-5 flex-shrink-0"
                            width={100}
                            height={100}
                            quality={100}
                        />
                    )}
                </div>
                {showChildren && (
                    <div className="pl-4 pr-2 pb-2 space-y-1">
                        {filteredSubs?.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => setSelectedSubCategory(item._id)}
                                className={`py-2 px-2 cursor-pointer hover:bg-zinc-50 rounded-md transition-colors text-sm ${
                                    selectedSubCategory === item._id ? "font-medium text-[#d5003c]" : "text-zinc-700"
                                }`}
                            >
                                {item.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <nav className="w-full bg-[#ffffff]">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 font-medium mb-4">
                <h2 className="text-lg text-zinc-900">Filters</h2>
                <button onClick={clearAll} className="text-sm text-red-600 hover:opacity-80 self-start sm:self-auto transition-opacity">
                    Clear All
                </button>
            </header>

            <div className="flex gap-3 items-center px-2.5 py-3 bg-white border border-zinc-300 text-zinc-700 rounded-md mb-6">
                <Image src="/icons/search.webp" alt="Search" className="w-[22px] aspect-square flex-shrink-0" width={100} height={100} quality={100} />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none flex-1 text-sm sm:text-base"
                />
            </div>

            <div>
                <div className="text-base font-medium text-zinc-900 mb-3">
                    <h3>Industries</h3>
                </div>

                <div className="text-sm text-zinc-700 max-h-[400px] overflow-y-auto">{renderReportCategories()}</div>
            </div>

            {/* <div className="mt-6">
        <div
          className="flex justify-between items-center text-base font-medium text-zinc-900 cursor-pointer"
          onClick={() => console.log("Region toggle (future feature)")}
        >
          <h3>Region</h3>
          <Image
            src="/icons/Add_Plus.webp"
            alt=""
            className="w-5 aspect-square"
            width={100}
            height={100}
            quality={100}
          />
        </div>
      </div> */}
        </nav>
    );
};

export const UrlFilter = ({ urlData, reportData, onFilterChange, searchParams }) => {
    const [categoryAndSubCategory, setCategoryAndSubCategory] = useState([]);
    const [searchText, setSearchText] = useState(searchParams || "");
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [selected, setSelected] = useState({
        categoryId: null,
        subCategoryId: null,
    });

    const { redirect } = useRouteRedirect();
    const { data: getCategoryAndSubCategoryRes } = useGetCategoryAndSubcategoryQuery();

    // Filter categories based on search
    useEffect(() => {
        if (!isStatusInclude(getCategoryAndSubCategoryRes?.status)) return;

        let allCategories = getCategoryAndSubCategoryRes?.data?.reportCategories || [];
        // if (searchText) {
        //     allCategories = allCategories.filter((cat) => cat.name.toLowerCase().includes(searchText.toLowerCase()));
        // }
        setCategoryAndSubCategory(allCategories);
    }, [getCategoryAndSubCategoryRes, searchText]);

    // NEW: Preselect category/subcategory based on URL
    useEffect(() => {
        if (!isValidArray(categoryAndSubCategory) || !urlData?.categoryUrl) return;

        const matchedCategory = categoryAndSubCategory.find((cat) => cat.url === urlData.categoryUrl);
        if (matchedCategory) {
            setExpandedCategories([matchedCategory._id]); // Expand category
            if (urlData.subcategoryUrl && isValidArray(matchedCategory.subCategories)) {
                const matchedSubCategory = matchedCategory.subCategories.find((sub) => sub.url === urlData.subcategoryUrl);
                if (matchedSubCategory) {
                    setSelected({
                        categoryId: matchedCategory._id,
                        subCategoryId: matchedSubCategory._id,
                    });
                } else {
                    setSelected({ categoryId: matchedCategory._id, subCategoryId: null });
                }
            } else {
                setSelected({ categoryId: matchedCategory._id, subCategoryId: null });
            }
        }
    }, [categoryAndSubCategory, urlData]);

    const toggleCategory = (categoryId) => {
        setExpandedCategories((prev) => (prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]));
    };

    const clearAll = () => {
        setSearchText("");
        redirect("report-store");
        // Close mobile filter if callback provided
        if (onFilterChange) {
            onFilterChange();
        }
    };

    const handleOnClickCategory = (category) => {
        redirect(`report-store/${category.url}`);
        // Close mobile filter if callback provided
        if (onFilterChange) {
            onFilterChange();
        }
    };

    const handleOnClickSubCategory = (category, subCategory) => {
        redirect(`report-store/${category.url}/${subCategory.url}`);
        // Close mobile filter if callback provided
        if (onFilterChange) {
            onFilterChange();
        }
    };

    const onChangeSearchText = (text) => {
        // Ensure text is never null or undefined
        const safeText = text || "";

        if (safeText) {
            redirect(`report-store?search=${encodeURIComponent(safeText.trim())}`);
            setSearchText(safeText);
        } else {
            redirect(`report-store`);
            setSearchText("");
        }
    };

    return (
        <nav className="w-full bg-[#ffffff]">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 font-medium mb-4">
                <h2 className="text-sm text-zinc-900">Filters</h2>
                <button onClick={clearAll} className="text-xs text-red-600 hover:opacity-80 self-start sm:self-auto transition-opacity">
                    Clear All
                </button>
            </header>

            <div className="flex gap-3 items-center px-2.5 py-1.5 bg-white border border-zinc-300 text-zinc-700 rounded-md mb-6">
                <Image src="/icons/search.webp" alt="Search" className="w-[15px] aspect-square flex-shrink-0" width={100} height={100} quality={100} />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchText}
                    onChange={(e) => onChangeSearchText(e.target.value)}
                    className="bg-transparent border-none outline-none flex-1 text-xs sm:text-xs"
                />
            </div>

            <div>
                <div className="text-sm font-medium text-zinc-900 mb-3">
                    <h3>Industries</h3>
                </div>
                <div className="text-sm text-zinc-700 max-h-[400px] overflow-y-auto">
                    {isValidArray(categoryAndSubCategory) &&
                        categoryAndSubCategory.map((category) => {
                            const hasChildren = category.subCategories?.length > 0;
                            const showChildren = hasChildren && expandedCategories.includes(category._id);
                            console.log("category", selected?.categoryId);
                            console.log("selected", category?._id);
                            const isActiveCategory = selected?.categoryId === category?._id;

                            return (
                                <div key={category._id} className={`w-full border-b border-zinc-300 last:border-b-0`}>
                                    <div
                                        className={`flex justify-between items-center py-2 sm:py-2 text-[14px] font-medium cursor-pointer rounded-md transition-colors ${
                                            isActiveCategory ? "text-[#d5003c]" : "text-zinc-700"
                                        }`}
                                        onClick={() => handleOnClickCategory(category)}
                                    >
                                        <span
                                            className={`flex-1 pr-2 hover:text-[#d5003c] font-medium ${
                                                isActiveCategory ? "text-[#d5003c]" : "text-black"
                                            } text-[13px]`}
                                        >
                                            {category.name}
                                        </span>
                                        {hasChildren && (
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleCategory(category._id);
                                                }}
                                            >
                                                <Image
                                                    src={showChildren ? "/icons/Minus.webp" : "/icons/Add_Plus.webp"}
                                                    alt={showChildren ? "Collapse" : "Expand"}
                                                    className="w-5 h-5 flex-shrink-0"
                                                    width={100}
                                                    height={100}
                                                    quality={100}
                                                />
                                            </Button>
                                        )}
                                    </div>

                                    {showChildren && (
                                        <div className="pl-4 pr-2 pb-2 space-y-1">
                                            {category.subCategories?.map((sub) => {
                                                const isActiveSub = isActiveCategory && selected.subCategoryId === sub._id;
                                                return (
                                                    <div
                                                        key={sub._id}
                                                        className={`py-2 px-2 cursor-pointer rounded-md transition-colors hover:text-[#d5003c] text-[13px] ${
                                                            isActiveSub ? "text-[#d5003c]" : "text-zinc-700"
                                                        }`}
                                                        onClick={() => handleOnClickSubCategory(category, sub)}
                                                    >
                                                        {sub.name}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>
        </nav>
    );
};

export default Filter;
