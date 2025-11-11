"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { generateUrlPath, getBasePath } from "../../utils/navbarTransform";
// import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { useRoutePrefetch } from "@/hooks/useRoutePrefetch";
import { useLoadingBar } from "../../contexts/LoadingBarContext";

const SubNavMenu = ({ data, isVisible, position, onMouseEnter, onMouseLeave, parentMenu, onNavigate }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    // const { redirect } = useRouteRedirect();
    const { prefetchOnHover } = useRoutePrefetch();
    const { startLoading } = useLoadingBar();

    // Helper to get the path for a given nav item so we can compare it with current route
    const getTargetPath = (title, isSubItem = false, parentTitle = null, itemData = null) => {
        // Replicate navigation logic used in handleItemClick so path comparison stays consistent
        if (isSubItem && (parentMenu === "Our Expertise" || parentMenu === "Services" || parentMenu === "Consulting Services")) {
            if (parentTitle === "Syndicate Reports") return "/syndicate-reports";
            if (parentTitle === "Custom Reports and Solutions") return "/custom-reports-and-solutions";
            if (parentTitle === "Full Time Engagement") return "/full-time-engagement";
            if (parentTitle === "Strategic Analysis" && parentMenu === "Consulting Services") return "/strategic-analysis";
            if (parentTitle === "Strategic Growth Solutions") return "/strategic-growth-solutions";
            if (parentTitle === "Market Assessment") return "/market-assessment";
            if (parentTitle === "Competitive Positioning Analysis") return "/competitive-positioning-analysis";
            if (parentTitle === "Market Intelligence") return "/market-intelligence";
            if (parentTitle === "Technology Scouting & Monitoring") return "/technology-scouting-monitoring";
            if (parentTitle === "Partner Identification") return "/partner-identification";
            if (parentTitle === "Customer Intelligence") return "/customer-intelligence";
        }

        if (title === "Syndicate Reports") return "/syndicate-reports";
        if (title === "Custom Reports and Solutions") return "/custom-reports-and-solutions";
        if (title === "Full Time Engagement") return "/full-time-engagement";
        if (title === "Strategic Analysis" && parentMenu === "Consulting Services") return "/strategic-analysis";
        if (title === "Strategic Growth Solutions") return "/strategic-growth-solutions";
        if (title === "Market Assessment") return "/market-assessment";
        if (title === "Competitive Positioning Analysis") return "/competitive-positioning-analysis";
        if (title === "Market Intelligence") return "/market-intelligence";
        if (title === "Technology Scouting & Monitoring") return "/technology-scouting-monitoring";
        if (title === "Partner Identification") return "/partner-identification";
        if (title === "Customer Intelligence") return "/customer-intelligence";

        // Enhanced Industries path handling using API data
        if (parentMenu === "Industries") {
            if (itemData?.pageItem?.categoryId?.url) {
                // Use the actual category URL from API
                return `/report-store/${itemData.pageItem.categoryId.url}`;
            } else {
                // Fallback to generated URL path
                let urlPath = generateUrlPath(title);
                urlPath = urlPath.replace(/-and-/g, "-");
                return `/report-store/${urlPath}`;
            }
        }

        // Special cases for About Us
        if (parentMenu === "About Us" || parentMenu === "About us") {
            if (title === "Contact Us" || title === "Contact") return "/contactus";
            if (title === "Become a Reseller" || title === "Become a reseller") return "/become-a-reseller";
        }

        // Fallback: construct path from base and url slug
        let urlPath = generateUrlPath(title);
        const basePath = getBasePath(parentMenu);
        return `${basePath}/${urlPath}`;
    };

    // Determine if a sub-item should appear active. We avoid coloring a sub-item
    // when it resolves to the same path as its parent (e.g. sub-items under
    // "Technology Scouting & Monitoring" all route to the parent path).
    const isSubItemActive = (subTitle, parentTitle, itemData = null) => {
        // For Industries, check if current path matches subcategory URL
        if (parentMenu === "Industries" && itemData?.pageItem) {
            const categoryUrl = itemData.pageItem.categoryId?.url;
            if (categoryUrl) {
                // Find the subcategory that matches the subTitle
                const subCategory = itemData.pageItem.siteSubMenu?.find(sub =>
                    sub.name === subTitle || sub.subCategoryId?.name === subTitle
                );
                if (subCategory?.subCategoryId?.url) {
                    const subPath = `/report-store/${categoryUrl}/${subCategory.subCategoryId.url}`;
                    return pathname === subPath;
                }
            }
        }

        const subPath = getTargetPath(subTitle, true, parentTitle, itemData);
        const parentPath = getTargetPath(parentTitle, false, parentTitle, itemData);
        return pathname?.startsWith(subPath) && subPath !== parentPath;
    };
    // Track scroll position to adjust top positioning
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 0);
        };

        // Set initial scroll state
        handleScroll();

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!data || !isVisible) {
        return null;
    }

    const handleItemClick = (title, isSubItem = false, parentTitle = null, obj) => {
        // Close navbar after navigation
        if (onNavigate) {
            onNavigate();
        }

        // Use redirect function to trigger loading bar and navigation
        if (isSubItem && (parentMenu === "Our Expertise" || parentMenu === "Services" || parentMenu === "Consulting Services")) {
            if (parentTitle === "Syndicate Reports") {
                redirect("syndicate-reports");
            } else if (parentTitle === "Custom Reports and Solutions") {
                redirect("custom-reports-and-solutions");
            } else if (parentTitle === "Full Time Engagement") {
                redirect("full-time-engagement");
            } else if (parentTitle === "Strategic Analysis" && parentMenu === "Consulting Services") {
                redirect("strategic-analysis");
            } else if (parentTitle === "Strategic Growth Solutions") {
                redirect("strategic-growth-solutions");
            } else if (parentTitle === "Market Assessment") {
                redirect("market-assessment");
            } else if (parentTitle === "Competitive Positioning Analysis") {
                redirect("competitive-positioning-analysis");
            } else if (parentTitle === "Market Intelligence") {
                redirect("market-intelligence");
            } else if (parentTitle === "Technology Scouting & Monitoring") {
                redirect("technology-scouting-monitoring");
            } else if (parentTitle === "Partner Identification") {
                redirect("partner-identification");
            } else if (parentTitle === "Customer Intelligence") {
                redirect("customer-intelligence");
            }
            return;
        }

        // Navigation logic for main titles
        if (title === "Syndicate Reports") {
            redirect("syndicate-reports");
        } else if (title === "Custom Reports and Solutions") {
            redirect("custom-reports-and-solutions");
        } else if (title === "Full Time Engagement") {
            redirect("full-time-engagement");
        } else if (title === "Strategic Analysis" && parentMenu === "Consulting Services") {
            redirect("strategic-analysis");
        } else if (title === "Strategic Growth Solutions") {
            redirect("strategic-growth-solutions");
        } else if (title === "Market Assessment") {
            redirect("market-assessment");
        } else if (title === "Competitive Positioning Analysis") {
            redirect("competitive-positioning-analysis");
        } else if (title === "Market Intelligence") {
            redirect("market-intelligence");
        } else if (title === "Technology Scouting & Monitoring") {
            redirect("technology-scouting-monitoring");
        } else if (title === "Partner Identification") {
            redirect("partner-identification");
        } else if (title === "Customer Intelligence") {
            redirect("customer-intelligence");
        } else if (title === "Contact Us") {
            redirect("contactus");
        } else if (title === "Become a Reseller") {
            redirect("become-a-reseller");
        } else if (title === "Consulting Services") {
            redirect("consulting-services");
        } else if (parentMenu === "Industries") {
            if (!isSubItem) {
                redirect(`report-store/${obj?.categoryId?.url}`);
            } else {
                const findOneSubCategory = obj?.siteSubMenu?.find((item) => item?.subCategoryId?.name === title);
                redirect(`report-store/${obj?.categoryId?.url}/${findOneSubCategory?.subCategoryId?.url}`);
            }
        }
        // Sub-item navigation - create URL-friendly paths
        else {
            const urlPath = generateUrlPath(title);
            const basePath = getBasePath(parentMenu);
            redirect(`${basePath}/${urlPath}`.replace(/^\//, ''));
        }
    };

    return (
        <div
            className={`sub-nav-menu ${isVisible ? "visible" : ""} fixed left-[8.5%] right-[8.5%] flex flex-row justify-between items-center  py-5 bg-white shadow-md border-b-[9px] border-[#C20036] transition-all duration-300 `}
            style={{
                top: isScrolled ? "69.2px" : "105px",
                borderTop: "0.5px solid #dbdadaff"
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                className="sub-nav-content"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "100%",
                    justifyContent: "flex-start",
                }}
            >
                {data.items.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="sub-nav-item"
                            style={{
                                margin: "0 15px",
                                minWidth: "150px",
                                flex: "0 0 calc(25% - 30px)",
                                boxSizing: "border-box",
                                marginBottom: "20px",
                            }}
                        >
                            <Link
                                href={getTargetPath(item.title, false, item.title, item)}
                                className="sub-nav-title"
                                onClick={onNavigate}
                                style={{
                                    cursor: "pointer",
                                    padding: "5px",
                                    fontWeight: "500",
                                    color: pathname?.startsWith(getTargetPath(item.title, false, item.title, item)) ? "#C20036" : "#333",
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = "#C20036";
                                }}
                                onMouseLeave={(e) => {
                                    if (!pathname?.startsWith(getTargetPath(item.title, false, item.title, item))) {
                                        e.target.style.color = "#333";
                                    }
                                }}
                            >
                                {item.title}
                            </Link>
                            {item.subItems && item.subItems.length > 0 && (
                                <div className="sub-nav-subitems" style={{ display: "flex", flexDirection: "column", paddingLeft: "5px", fontSize: "13px" }}>
                                    {item?.subItems?.map((subItem, subIndex) => {
                                        return (
                                            <div key={subIndex} className="sub-nav-subitem" style={{ margin: "5px 0", color: "#666" }}>
                                                {/* <span className="sub-nav-bullet">•</span> */}
                                                <Link
                                                    href={getTargetPath(subItem, true, item.title, item?.pageItem)}
                                                    className=" py-0"
                                                    onClick={onNavigate}
                                                    style={{
                                                        cursor: "pointer",
                                                        color: isSubItemActive(subItem, item.title, item) ? "#C20036" : "rgb(50, 50, 50)",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.color = "#C20036";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!isSubItemActive(subItem, item.title, item)) {
                                                            e.target.style.color = "rgb(50, 50, 50)";
                                                        }
                                                    }}
                                                >
                                                    {subItem}
                                                </Link>
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
    );
};

export default SubNavMenu;
