"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useWindowSize, useClientOnly } from "../../hooks/useClientOnly";
import Image from "next/image";
import { useGetGlobalSearchDataQuery } from "@/api/home";
import { isStatusInclude } from "@/utils/axiosInstance";
import { isValidArray } from "@/utils/validation/array";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { Box } from "@mui/material";

const SearchBox = ({ onExpandChange, isMobileLayout, isSearchExpanded, firstNavItemRef, headerPadding, ...props }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchBoxPosition, setSearchBoxPosition] = useState({ top: 0, left: 0, width: 0 });
    const [globalSearchData, setGlobalSearchData] = useState();
    const searchRef = useRef(null);
    const containerRef = useRef(null);
    const { redirect } = useRouteRedirect();

    const params = { search: searchValue };
    const { data: getGlobalSearchRes } = useGetGlobalSearchDataQuery(params, { skip: !searchValue });

    // Get window size for responsive calculations
    const isClient = useClientOnly();
    const { width: windowWidth } = useWindowSize();

    // Helper to parse px values to number
    const parsePx = (value) => {
        if (typeof value === "number") return value;
        if (!value) return 0;
        const parsed = parseFloat(String(value).replace("px", "").trim());
        return Number.isFinite(parsed) ? parsed : 0;
    };

    // Read current computed padding-right of .main-header so alignment tracks wrapper padding
    const getHeaderRightPaddingPx = () => {
        if (typeof window === "undefined") return 0;
        const headerEl = document.querySelector(".main-header");
        if (!headerEl) return 0;
        const computed = getComputedStyle(headerEl);
        return parsePx(computed.paddingRight);
    };

    // Search suggestions data
    const searchSuggestions = [
        {
            category: "Popular Search",
            items: ["Food Services and Hospitality", "Food Ingredients", "Software and Services", "Electric and Hybrid Vehicles", "Display Technologies"],
        },
    ];

    // Calculate search box position for portal (relative to viewport, not document)
    const updateSearchBoxPosition = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setSearchBoxPosition({
                top: 112,
                left: rect.left,
                width: rect.width,
            });
        }
    };

    // Helper to read --search-transition-duration from CSS and return milliseconds
    const getSearchTransitionMs = () => {
        if (typeof window === "undefined") return 500;
        const root = document.documentElement;
        const raw = getComputedStyle(root).getPropertyValue("--search-transition-duration").trim();
        if (!raw) return 500;
        if (raw.endsWith("ms")) return Number(parseFloat(raw));
        if (raw.endsWith("s")) return Number(parseFloat(raw) * 1000);
        const asNum = Number(parseFloat(raw));
        return Number.isFinite(asNum) ? asNum : 500;
    };

    // Handle search box click to expand
    const handleSearchClick = () => {
        if (!isExpanded) {
            setIsExpanded(true);
            onExpandChange?.(true);
            setTimeout(() => {
                updateSearchBoxPosition();
                setShowSuggestions(true);
                // Focus the input field after expansion
                if (searchRef.current) {
                    searchRef.current.focus();
                }
            }, getSearchTransitionMs());
        }
    };

    // Handle input field focus to show suggestions
    const handleInputFocus = () => {
        if (isExpanded) {
            updateSearchBoxPosition();
            setShowSuggestions(true);
        }
    };

    // Handle input field click - expand if not expanded, show suggestions if expanded
    const handleInputClick = (e) => {
        e.stopPropagation();

        if (!isExpanded) {
            // If not expanded, expand the search box (works on both desktop and mobile)
            setIsExpanded(true);
            onExpandChange?.(true);

            // Show suggestions after expansion animation (on both desktop and mobile)
            setTimeout(() => {
                updateSearchBoxPosition();
                setShowSuggestions(true);
                // Focus the input field after expansion
                if (searchRef.current) {
                    searchRef.current.focus();
                }
            }, getSearchTransitionMs());
        } else if (isExpanded) {
            // If already expanded, just show suggestions
            updateSearchBoxPosition();
            setShowSuggestions(true);
        }
    };

    // Handle search functionality
    const handleSearch = () => {
        if (searchValue.trim()) {
            // redirect(`search?q=${encodeURIComponent(searchValue.trim())}`);
            redirect(`report-store?search=${encodeURIComponent(searchValue.trim())}`);
            setShowSuggestions(false);
            // Clear the input immediately
            setSearchValue("");
            if (searchRef.current) {
                searchRef.current.value = "";
            }
            setTimeout(() => {
                setIsExpanded(false);
                onExpandChange?.(false);
            }, 200);
        }
    };

    // Handle Enter and Escape key press
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        } else if (e.key === "Escape") {
            // Close search box when Escape is pressed
            setShowSuggestions(false);
            // Clear the input immediately
            setSearchValue("");
            if (searchRef.current) {
                searchRef.current.value = "";
            }
            setTimeout(() => {
                setIsExpanded(false);
                onExpandChange?.(false);
            }, 200);
        }
    };

    // Handle close button click
    const handleCloseClick = (e) => {
        e.stopPropagation();
        setShowSuggestions(false);
        // Clear the input immediately
        setSearchValue("");
        if (searchRef.current) {
            searchRef.current.value = "";
        }

        // Close search box after suggestions hide
        setTimeout(() => {
            setIsExpanded(false);
            onExpandChange?.(false);
        }, 200);
    };

    // Handle click outside to close
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         // Check if click is inside the search container
    //         const isInsideContainer = containerRef.current && containerRef.current.contains(event.target);

    //         // Check if click is inside the suggestions dropdown (which is rendered in a portal)
    //         const isInsideSuggestions = event.target.closest(".search-suggestions");

    //         if (!isInsideContainer && !isInsideSuggestions) {
    //             if (isExpanded) {
    //                 setShowSuggestions(false);
    //                 setTimeout(() => {
    //                     setIsExpanded(false);
    //                     onExpandChange?.(false);
    //                     setSearchValue("");
    //                 }, 200);
    //             }
    //         }
    //     };

    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [isExpanded, onExpandChange]);

    // Note: Removed auto-close search on mobile to allow mobile search expansion

    useEffect(() => {
        if (showSuggestions && !isMobileLayout) {
            const handleResize = () => {
                setTimeout(() => {
                    updateSearchBoxPosition();
                }, 50);
            };

            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, [showSuggestions, isMobileLayout]);

    // Update position when window width changes (for responsive width changes)
    useEffect(() => {
        if (showSuggestions && !isMobileLayout && isClient) {
            updateSearchBoxPosition();
        }
    }, [windowWidth, showSuggestions, isMobileLayout, isClient]);

    const getSuggestionsWidth = () => {
        if (isMobileLayout) {
            return "calc(100vw - 40px)"; // Full width on mobile
        }

        // Always match the search box width
        return getSearchBoxWidth();
    };
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === "Escape" && isExpanded) {
                setShowSuggestions(false);
                setTimeout(() => {
                    setIsExpanded(false);
                    onExpandChange?.(false);
                    setSearchValue("");
                }, 200);
            }
        };

        window.addEventListener("keydown", handleEscKey);
        return () => {
            window.removeEventListener("keydown", handleEscKey);
        };
    }, [isExpanded, onExpandChange]);

    useEffect(() => {
        if (!isStatusInclude(getGlobalSearchRes?.status)) return;
        setGlobalSearchData(getGlobalSearchRes?.data);
    }, [getGlobalSearchRes]);

    const getDisplayData = () => {
        return [
            {
                category: "Reports",
                items: isValidArray(globalSearchData?.allReports)
                    ? globalSearchData.allReports.map((item) => ({
                          id: item._id,
                          title: item.reportSubTitle || item.blogSubTitle || "Untitled",
                          category: item.categoryId?.name || "Report",
                          dataItem: item,
                      }))
                    : [],
            },
            {
                category: "Blogs",
                items: isValidArray(globalSearchData?.blogs)
                    ? globalSearchData.blogs.map((item) => ({
                          id: item._id,
                          title: item.blogSubTitle || item.reportSubTitle || "Untitled",
                          category: item.categoryId?.name || "Blog",
                          dataItem: item,
                      }))
                    : [],
            },
            {
                category: "Articles",
                items: isValidArray(globalSearchData?.articles)
                    ? globalSearchData.articles.map((item) => ({
                          id: item._id,
                          title: item.blogSubTitle || item.reportSubTitle || "Untitled",
                          category: item.categoryId?.name || "Article",
                          dataItem: item,
                      }))
                    : [],
            },
        ].filter((group) => group.items.length > 0); // Only include categories with items
    };

    const [dynamicLeft, setDynamicLeft] = useState("auto");
    const [collapsedLeftPx, setCollapsedLeftPx] = useState(null);
    const [expandedWidthPx, setExpandedWidthPx] = useState(null);

    useEffect(() => {
        if (isExpanded && firstNavItemRef?.current) {
            const navRect = firstNavItemRef.current.getBoundingClientRect();
            setDynamicLeft(`${navRect.left}px`);
        } else {
            setDynamicLeft("auto");
        }
    }, [isExpanded, firstNavItemRef, windowWidth]);

    // Compute collapsed left so left can animate from a number
    useEffect(() => {
        const headerEl = typeof document !== "undefined" ? document.querySelector(".main-header") : null;
        if (!headerEl) return;
        const headerRect = headerEl.getBoundingClientRect();
        const headerPaddingPx = getHeaderRightPaddingPx();
        const collapsedWidthPx = 231;
        const leftPx = Math.max(0, Math.round(headerRect.right - headerPaddingPx - collapsedWidthPx));
        setCollapsedLeftPx(leftPx);
    }, [windowWidth]);

    // Compute expanded width so width can animate from a number to a number
    useEffect(() => {
        if (!isExpanded) {
            setExpandedWidthPx(null);
            return;
        }
        const headerEl = typeof document !== "undefined" ? document.querySelector(".main-header") : null;
        const navLeftPx = parsePx(dynamicLeft);
        if (!headerEl || !Number.isFinite(navLeftPx)) return;
        const headerRect = headerEl.getBoundingClientRect();
        const headerPaddingPx = getHeaderRightPaddingPx();
        const widthPx = Math.max(0, Math.round(headerRect.right - headerPaddingPx - navLeftPx));
        setExpandedWidthPx(widthPx);
    }, [isExpanded, dynamicLeft, windowWidth]);

    const containerStyle = {
        // Animate between numeric values instead of "auto"

        left:
            isExpanded && Number.isFinite(parsePx(dynamicLeft)) && collapsedLeftPx !== null
                ? `${parsePx(dynamicLeft)}px`
                : collapsedLeftPx !== null
                ? `${collapsedLeftPx}px`
                : "auto",
        width: isExpanded && expandedWidthPx !== null ? `${expandedWidthPx}px` : "88px",
        position: isExpanded ? "absolute" : "",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-end",
        // transition: 'left var(--search-transition-duration, 0.8s) ease, width var(--search-transition-duration, 0.8s) ease',
        zIndex: isExpanded ? 1001 : "auto",
    };

    return (
        <>
            <div ref={containerRef} className={`search-box-container ${isExpanded ? "expanded" : ""} ${isMobileLayout ? "mobile" : ""}`} style={containerStyle}>
                <div
                    onClick={handleSearchClick}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignSelf: "stretch",
                        width: "100%", // Take full width of container
                        cursor: isExpanded ? "text" : "pointer",
                        // transition: "all var(--search-transition-duration, 0.5s) ease",
                        borderRadius: isExpanded ? "8px 8px 0 0" : "8px",
                        background: isExpanded ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flex: 1,
                        }}
                    >
                        <Image src="/icons/search.webp" alt="Search" width={24} height={24} quality={100} />
                        <input
                            ref={searchRef}
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={handleInputFocus}
                            onClick={handleInputClick}
                            onKeyDown={handleKeyDown}
                            placeholder={isExpanded ? "Search reports, blogs, articles..." : "Explore"}
                            style={{
                                width: "100%",
                                border: "none",
                                outline: "none",
                                background: "transparent",
                                color: "black",
                                fontSize: "15px",
                                fontStyle: "normal",
                                fontWeight: "500",
                                lineHeight: "normal",
                                cursor: isExpanded ? "text" : "pointer",
                            }}
                            readOnly={!isExpanded}
                        />
                    </div>

                    {/* Right side - Close icon (only when fully expanded) */}
                    {isExpanded && (
                        <Image
                            src="/icons/Close.svg"
                            alt="Close"
                            onClick={handleCloseClick}
                            style={{
                                width: "22px",
                                height: "22px",
                                aspectRatio: "1/1",
                                cursor: "pointer",
                                transition: `all var(--search-transition-duration, 0.5s) ease 0.2s`, // Delayed appearance
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? "scale(1) rotate(0deg)" : "scale(0.8) rotate(90deg)",
                                visibility: isExpanded ? "visible" : "hidden",
                            }}
                            width={100}
                            height={100}
                            quality={100}
                        />
                    )}
                </div>
            </div>
            {/* Search Suggestions Portal - Rendered outside header */}
            {searchValue?.length > 0 &&
                createPortal(
                    <div
                        className={`search-suggestions ${showSuggestions ? "visible" : "hide"}`}
                        style={{
                            position: "fixed",
                            // top: `${searchBoxPosition.top}px`,
                            top: props?.searchPosition?.searchPosition ? `${searchBoxPosition.top - 43}px` : `${searchBoxPosition.top - 7}px`,
                            left: `${searchBoxPosition.left}px`,
                            width: `${searchBoxPosition.width}px`,
                            padding: "20px 40px",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "10px",
                            background: "white",
                            borderRadius: "0px",
                            zIndex: 9999,
                            display: showSuggestions ? "flex" : "none",
                            maxHeight: "calc(100vh - 300px)",
                            overflow: "auto",
                            borderStyle: "solid",
                            borderColor: "#ff000088",
                            borderWidth: "0 1.5px 1.5px 1.5px",
                        }}
                    >
                        {getDisplayData().length > 0 ? (
                            <>
                                {getDisplayData()?.map((section, index) => {
                                    return (
                                        <React.Fragment key={index + 1}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    gap: "8px",
                                                    alignSelf: "stretch",
                                                }}
                                            >
                                                {/* Category Header */}
                                                <div
                                                    style={{
                                                        color: "var(--1C1C1C, #1C1C1C)",
                                                        // fontFamily: "var(--font-inter)",
                                                        fontSize: "14px",
                                                        fontStyle: "normal",
                                                        fontWeight: "bold",
                                                        lineHeight: "160%",
                                                        alignSelf: "stretch",
                                                    }}
                                                >
                                                    {section?.category}
                                                </div>
                                                {isValidArray(section?.items) &&
                                                    section?.items?.map((items, itemsIndex) => {
                                                        return (
                                                            <Box
                                                                className="hover:underline hover:decoration-red-500"
                                                                key={itemsIndex + 1}
                                                                sx={{
                                                                    color: "var(--4d4d4d, #4D4D4D)",
                                                                    // fontFamily: "var(--font-inter)",
                                                                    fontSize: "15px",
                                                                    fontStyle: "normal",
                                                                    fontWeight: "400",
                                                                    lineHeight: "160%",
                                                                    alignSelf: "stretch",
                                                                    cursor: "pointer",
                                                                    padding: "4px 0",
                                                                    transition: "color 0.2s ease",
                                                                    "&:hover": {
                                                                        color: "red",
                                                                    },
                                                                    borderBottom: "1px solid lightgrey",
                                                                }}
                                                                onClick={() => {
                                                                    setSearchValue("");
                                                                    setShowSuggestions(false);
                                                                    setTimeout(() => {
                                                                        setIsExpanded(false);
                                                                        onExpandChange?.(false);
                                                                        // Redirect to search page with the selected item
                                                                        if (section?.category === "Blogs" || section?.category === "Articles") {
                                                                            redirect(`blogs/${items?.dataItem?.url}`);
                                                                        } else {
                                                                            redirect(`report-store/${items?.dataItem?.url}`);
                                                                        }

                                                                        // window.location.href = `/search?q=${encodeURIComponent(items?.title)}`;
                                                                    }, 200);
                                                                }}
                                                            >
                                                                {items?.title}
                                                            </Box>
                                                        );
                                                    })}
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                                {searchSuggestions.map((section, sectionIndex) => (
                                    <div
                                        key={sectionIndex}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            gap: "8px",
                                            alignSelf: "stretch",
                                        }}
                                    >
                                        {/* Category Header */}
                                        <div
                                            style={{
                                                color: "var(--1C1C1C, #1C1C1C)",
                                                fontFamily: "var(--font-inter)",
                                                fontSize: "14px",
                                                fontStyle: "normal",
                                                fontWeight: "400",
                                                lineHeight: "160%",
                                                alignSelf: "stretch",
                                            }}
                                        >
                                            {section?.category}
                                        </div>

                                        {/* Suggestion Items */}
                                        {getDisplayData()?.map((item, itemIndex) => (
                                            <Box
                                                key={itemIndex}
                                                sx={{
                                                    color: "var(--4d4d4d, #4D4D4D)",
                                                    fontFamily: "var(--font-inter)",
                                                    fontSize: "16px",
                                                    fontStyle: "normal",
                                                    fontWeight: "400",
                                                    lineHeight: "160%",
                                                    alignSelf: "stretch",
                                                    cursor: "pointer",
                                                    padding: "4px 0",
                                                    transition: "color 0.2s ease",
                                                    "&:hover": {
                                                        color: "red",
                                                    },
                                                }}
                                                onClick={() => {
                                                    setSearchValue(item?.title);
                                                    setShowSuggestions(false);
                                                    setTimeout(() => {
                                                        setIsExpanded(false);
                                                        onExpandChange?.(false);
                                                        // Redirect to search page with the selected item
                                                        window.location.href = `/search?q=${encodeURIComponent(item?.title)}`;
                                                    }, 200);
                                                }}
                                            >
                                                {item?.title}
                                            </Box>
                                        ))}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: "20px",
                                    color: "#666",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    width: "100%",
                                }}
                            >
                                No result found
                            </div>
                        )}
                    </div>,
                    document.body
                )}
        </>
    );
};

export default SearchBox;
