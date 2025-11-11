"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { hasSubNavigation, getSubNavigationData, generateUrlPath } from "../../utils/navbarTransform";
import { isValidArray } from "@/utils/validation/array";
import { useGetGlobalSearchDataQuery } from "@/api/home";
import { isStatusInclude } from "@/utils/axiosInstance";
import { X } from "lucide-react";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import Link from "next/link";

// Custom debounce function
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const MobileMenu = ({ isOpen, onClose, menuItems, navigationData }) => {
    const [expandedMenu, setExpandedMenu] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const router = useRouter();
    const { redirect } = useRouteRedirect();

    // Debounced search handler
    const debouncedSetSearchValue = useCallback(
        debounce((value) => {
            setSearchValue(value);
            setShowSuggestions(!!value);
        }, 300),
        []
    );

    // Fetch dynamic search data
    const params = { search: searchValue };
    const { data: globalSearchRes } = useGetGlobalSearchDataQuery(params, { skip: !searchValue });
    const [globalSearchData, setGlobalSearchData] = useState();

    useEffect(() => {
        if (!globalSearchRes) return;
        if (isStatusInclude(globalSearchRes?.status)) {
            console.log("API Response:", globalSearchRes); // Debug
            setGlobalSearchData(globalSearchRes?.data);
        } else {
            console.error("API Error:", globalSearchRes?.status);
            setGlobalSearchData(null);
        }
    }, [globalSearchRes]);

    // Prepare data for suggestions
    const getDisplayData = () =>
        [
            {
                category: "Reports",
                items: isValidArray(globalSearchData?.allReports)
                    ? globalSearchData.allReports.map((item) => ({
                        id: item._id,
                        title: item.reportSubTitle || item.title || "Untitled",
                        // ✅ Use slug/url instead of ID
                        url: item.url ? `/report-store/${item.url}` : `/report-store/${item._id}`,
                    }))
                    : [],
            },
            {
                category: "Blogs",
                items: isValidArray(globalSearchData?.blogs)
                    ? globalSearchData.blogs.map((item) => ({
                        id: item._id,
                        title: item.blogSubTitle || item.title || "Untitled",
                        url: item.url || `/blogs/${item._id}`,
                    }))
                    : [],
            },
            {
                category: "Articles",
                items: isValidArray(globalSearchData?.articles)
                    ? globalSearchData.articles.map((item) => ({
                        id: item._id,
                        title: item.articleSubTitle || item.title || "Untitled",
                        url: item.url || `/article/${item._id}`,
                    }))
                    : [],
            },
        ].filter((group) => group.items.length > 0);

    const handleMenuItemClick = (menuText) => {
        if (!hasSubNavigation(menuText, navigationData)) {
            if (menuText === "About us" || menuText === "About Us") redirect("aboutus");
            else if (menuText === "Blogs & News") redirect("blog");
            else if (menuText === "Report Store") redirect("report-store");
            onClose();
        } else {
            setExpandedMenu(expandedMenu === menuText ? null : menuText);
        }
    };

    const handleSubMenuItemClick = (subItem, parentMenu, isSubItem = false, parentTitle = null) => {
        let url = "";
        if (isSubItem) {
            url = generateUrlPath(parentMenu, parentTitle, subItem, navigationData) || `/blog/${subItem.toLowerCase().replace(/\s+/g, "-")}`;
        } else {
            url = generateUrlPath(parentMenu, subItem, null, navigationData) || `/blog/${subItem.toLowerCase().replace(/\s+/g, "-")}`;
        }
        // Special fix for About Us menu
        if (parentMenu === "About Us" || parentMenu === "About us") {
            if (url === "contact-us") url = "/contactus";
            if (url === "become-a-reseller") url = "/become-a-reseller";
        }
        router.push(url);
        onClose();
    };

    const handleSearch = (item) => {
        if (!item?.url) return;
        router.push(item.url);
        setSearchValue("");
        setShowSuggestions(false);
        if (searchRef.current) searchRef.current.value = "";
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div className={`mobile-menu-overlay ${isOpen ? "active" : ""}`} onClick={onClose} />

            {/* Menu */}
            <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
                {/* Header */}
                <div className="mobile-menu-header">
                    <div style={{ width: "120px", height: "28px" }}>
                        <Image
                            src="/images/logo.webp"
                            alt="Logo"
                            width={100}
                            height={100}
                            style={{ width: "100%", height: "100%", aspectRatio: "77/18", objectFit: "contain" }}
                        />
                    </div>
                    <button className="mobile-menu-close" onClick={onClose} aria-label="Close menu">
                        ×
                    </button>
                </div>

                {/* Search Box */}
                <div
                    style={{
                        padding: "8px",
                        borderTop: "1px solid rgba(77, 77, 77, 0.1)",
                        // marginTop: "20px",
                        position: "relative",
                    }}
                >
                    {/* Search icon (left inside input) */}
                    <div
                        style={{
                            position: "absolute",
                            left: "20px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            zIndex: 2,
                        }}
                        onClick={() => handleSearch({ url: `/report-store?search=${encodeURIComponent(searchValue)}` })}
                    >
                        <Image src="/icons/search.webp" alt="Search" width={20} height={20} />
                    </div>

                    {/* Input field */}
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="Explore"
                        value={searchValue}
                        onChange={(e) => debouncedSetSearchValue(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        style={{
                            width: "100%",
                            padding: "12px 36px 12px 36px", // extra padding for icons
                            borderBottom: "1px solid #ddd",
                            outline: "none",
                            fontSize: "16px",
                            position: "relative",
                            zIndex: 1,
                        }}
                    />

                    {/* Close (clear) icon (right inside input) */}
                    {searchValue && (
                        <div
                            style={{
                                position: "absolute",
                                right: "20px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                zIndex: 2,
                            }}
                            onClick={() => {
                                setSearchValue("");
                                setShowSuggestions(false);
                                if (searchRef.current) searchRef.current.value = "";
                            }}
                        >
                            <X className="w-5 h-5" alt="Clear" />
                        </div>
                    )}

                    {/* Suggestion dropdown */}
                    {showSuggestions && searchValue.length > 0 && (
                        <div
                            style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                background: "#fff",
                                zIndex: 10,
                                marginTop: "-3%",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                maxHeight: "300px",
                                overflowY: "auto",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            }}
                        >
                            {isValidArray(getDisplayData()) ? (
                                getDisplayData().map((section, index) => (
                                    <div key={index} style={{ padding: "10px" }}>
                                        <div
                                            style={{
                                                fontWeight: "bold",
                                                marginBottom: "6px",
                                                color: "#1C1C1C",
                                            }}
                                        >
                                            {section.category}
                                        </div>
                                        {section.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    padding: "4px 0",
                                                    cursor: "pointer",
                                                    color: "#4D4D4D",
                                                    fontSize: "15px",
                                                    lineHeight: "160%",
                                                    transition: "color 0.2s ease",
                                                }}
                                                onClick={() => handleSearch(item)}
                                                onMouseEnter={(e) => (e.target.style.color = "red")}
                                                onMouseLeave={(e) => (e.target.style.color = "#4D4D4D")}
                                            >
                                                {item.title}
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: "10px", color: "#888" }}>No results found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="mobile-menu-nav">
                    {menuItems.map((item, index) => (
                        <div key={index}>
                            <div className="mobile-menu-item" onClick={() => handleMenuItemClick(item.text)}>
                                <span className="mobile-menu-item-text">{item.text}</span>
                                {item.hasIcon && (
                                    <div className={`mobile-menu-item-icon ${expandedMenu === item.text ? "expanded" : ""}`}>
                                        <Image src="/icons/Dropdown.webp" alt="Dropdown" width={100} height={100} />
                                    </div>
                                )}
                            </div>

                            {hasSubNavigation(item.text, navigationData) && expandedMenu === item.text && (
                                <div className="mobile-submenu">
                                    {getSubNavigationData(item.text, navigationData)?.items?.map((subItem, subIndex) => {
                                        console.log("subItem", subItem);

                                        return (
                                            <div key={subIndex} className="mobile-submenu-section">
                                                <Link href={subItem?.pageItem?.categoryId ? `/report-store/${subItem?.url}` : `/${subItem?.url}`} onClick={() => { onClose() }}>
                                                    <div className="mobile-submenu-title" >
                                                        {subItem.title}
                                                    </div>
                                                </Link>
                                                {subItem.subItems?.map((subSubItem, subSubIndex) => (
                                                    <div
                                                        key={subSubIndex}
                                                        className="mobile-submenu-item"
                                                        onClick={() => handleSubMenuItemClick(subSubItem, item.text, true, subItem.title)}
                                                    >
                                                        {subSubItem}
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default MobileMenu;
