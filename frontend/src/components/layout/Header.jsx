"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { MobileMenu, HamburgerButton } from "../ui";
import SubNavMenu from "../ui/SubNavMenu";
import { useWindowSize, useClientOnly } from "../../hooks/useClientOnly";
import { hasSubNavigation, getSubNavigationData, transformNavbarData, isIndustriesPath } from "../../utils/navbarTransform";
import { useGetNavbarDataQuery } from "../../api/navbar";
import Image from "next/image";
import Link from "next/link";

// Lazy load SearchBox - only load when user interacts with search
const SearchBox = dynamic(() => import("../ui/SearchBox"), { 
    ssr: false,
    loading: () => <div className="search-placeholder" style={{ width: "40px", height: "40px" }} />
});

const Header = (searchPosition) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [activeSubNav, setActiveSubNav] = useState(null);
    const [subNavPosition, setSubNavPosition] = useState({ top: 0, left: 0 });
    const [hoverTimer, setHoverTimer] = useState(null);
    const [activeMenuItem, setActiveMenuItem] = useState(null);
    const navRef = useRef(null);
    const firstNavItemRef = useRef(null);
    const isClient = useClientOnly();
    const { width } = useWindowSize();
    const router = useRouter();
    const pathname = usePathname();

    const { data: navbarApiData, error: navbarError, isLoading: navbarLoading } = useGetNavbarDataQuery();
    const { menuItems, navigationData } = transformNavbarData(navbarApiData);

    const isMobileLayout = isClient && width <= 1080;

    // Persist activeMenuItem based on current route
    useEffect(() => {
        if (!isClient) return;

        const url = new URL(window.location.href);
        const fromParam = url.searchParams.get("from");

        // Enhanced Industries highlighting logic
        if ((pathname === "/report-store" && fromParam === "industries") || pathname?.startsWith("/report-store/")) {
            // Check if this is an Industries category URL by matching against API data
            if (isIndustriesPath(pathname, navigationData)) {
                setActiveMenuItem("Industries");
                return;
            }

            // Fallback: if /report/ path but not matched to Industries, check if it's Report Store
            if (pathname === "/report-store") {
                setActiveMenuItem("Report Store");
                return;
            }
        }

        // Static route mapping for other pages
        const routeToMenuMap = {
            "": "",
            "/consulting-services": "Consulting Services",
            "/aboutus": "About Us",
            "/blog": "Blogs & News",
            "/report-store": "Report Store",
            "/syndicate-reports": "Services",
            "/custom-reports": "Services",
            "/full-time-engagement": "Services",
            "/strategic-analysis": "Services",
            "/market-assessment": "Consulting Services",
            "/competitive-positioning-analysis": "Consulting Services",
            "/market-intelligence": "Consulting Services",
            "/technology-scouting": "Consulting Services",
            "/partner-identification": "Consulting Services",
            "/customer-intelligence": "Consulting Services",
            "/strategic-analysis-market-insights": "Consulting Services",
            "/contactus": "About Us",
            "/become-a-reseller": "About Us",
        };

        const matchedMenuItem = routeToMenuMap?.[pathname] || Object?.entries(routeToMenuMap)?.find(([route]) => pathname?.startsWith(route))?.[1];

        setActiveMenuItem(matchedMenuItem || null);
    }, [pathname, isClient, navigationData]);

    // Close subnav when route changes (page loads)
    useEffect(() => {
        if (!isClient) return;

        // Close the subnav menu when pathname changes (page navigation occurs)
        setActiveSubNav(null);

        // Clear any pending hover timers
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            setHoverTimer(null);
        }
    }, [pathname, isClient, hoverTimer]);

    useEffect(() => {
        if (!isClient || typeof document === "undefined") return;
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
        return () => {
            if (typeof document !== "undefined") {
                document.body.style.overflow = "unset";
            }
        };
    }, [isClient, isMobileMenuOpen]);

    useEffect(() => {
        if (!isClient) return;
        if (width > 1080 && isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    }, [isClient, width, isMobileMenuOpen]);

    useEffect(() => {
        return () => {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
            }
        };
    }, [hoverTimer]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleSearchExpandChange = (expanded) => {
        setIsSearchExpanded(expanded);
        if (expanded) {
            setActiveSubNav(null);
        }
    };

    const handleNavItemClick = (menuText) => {
        if (isSearchExpanded && !isMobileLayout) return;

        // Close subnav immediately when clicking on any navigation item
        setActiveSubNav(null);

        // Clear any pending hover timers
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            setHoverTimer(null);
        }

        // Explicitly prevent navigation for "Industries"
        if (menuText === "Industries") {
            setActiveMenuItem("Industries");
            return; // Prevent navigation
        }

        // Handle navigation for other menu items
        if (menuText === "Consulting Services") {
            setActiveMenuItem("Consulting Services");
            router.push("/consulting-services");
        } else if (menuText === "About Us") {
            setActiveMenuItem("About Us");
            router.push("/aboutus");
        } else if (menuText === "Blogs & News") {
            setActiveMenuItem("Blogs & News");
            router.push("/blog");
        } else if (menuText === "Report Store") {
            setActiveMenuItem("Report Store");
            router.push("/report-store");
        } else if (menuText === "Services") {
            setActiveMenuItem("Services");
            router.push("");
        }
    };

    const handleSubNavClick = (parentMenuText) => {
        setActiveMenuItem(parentMenuText);
        setActiveSubNav(null);

        // Clear any pending hover timers
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            setHoverTimer(null);
        }
    };

    const handleSetSubNavPosition = useCallback(
        (menuText, event) => {
            // Explicitly prevent submenu for Report Store
            if (menuText === "Report Store") {
                setActiveSubNav(null);
                return;
            }

            if (hasSubNavigation(menuText, navigationData) && !isMobileLayout && !isSearchExpanded) {
                const headerElement = document.querySelector(".main-header");
                if (headerElement) {
                    const headerRect = headerElement.getBoundingClientRect();
                    const position = {
                        top: headerRect.bottom,
                        left: 0,
                    };
                    setSubNavPosition(position);
                } else {
                    const rect = event.currentTarget.getBoundingClientRect();
                    const position = {
                        top: rect.bottom - 2,
                        left: rect.left,
                    };
                    setSubNavPosition(position);
                }
                setActiveSubNav(menuText);
            } else {
                setActiveSubNav(null);
            }
        },
        [isMobileLayout, isSearchExpanded, navigationData]
    );

    const handleNavItemHover = (menuText, event) => {
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            setHoverTimer(null);
        }
        handleSetSubNavPosition(menuText, event);
    };

    const handleNavItemLeave = (event) => {
        const relatedTarget = event.relatedTarget;
        if (
            relatedTarget &&
            relatedTarget.nodeType === Node.ELEMENT_NODE &&
            (relatedTarget.closest(".sub-nav-menu") || relatedTarget.closest(".header-nav-item"))
        ) {
            return;
        }
        const timer = setTimeout(() => {
            setActiveSubNav(null);
        }, 300);
        setHoverTimer(timer);
    };

    const handleSubNavHover = () => {
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            setHoverTimer(null);
        }
    };

    const handleSubNavLeave = (event) => {
        const relatedTarget = event.relatedTarget;
        if (relatedTarget && relatedTarget.nodeType === Node.ELEMENT_NODE && relatedTarget.closest(".header-nav-item")) {
            return;
        }
        setActiveSubNav(null);
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            setHoverTimer(null);
        }
    };

    const headerPadding = "20px";
    const logoWidth = "150px";
    const hamburgerButtonWidth = "50px";
    const searchIconWidth = "50px";

    if (navbarLoading) {
        return (
            <div
                className="main-header"
                style={{
                    position: "relative",
                    display: "flex",
                    height: "80px",
                    width: "100%",
                    backgroundColor: "white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div>Loading...</div>
            </div>
        );
    }

    if (navbarError) {
        console.error("Navbar API Error:", navbarError);
    }

    return (
        <>
            <div
                className={`main-header ${isSearchExpanded ? "search-expanded" : ""} ${isMobileLayout ? "mobile-layout" : ""}`}
                style={{
                    position: "relative",
                    display: isMobileLayout ? "block" : "flex",
                    height: isMobileLayout ? "80px" : "auto",
                    width: "100%",
                    boxSizing: "border-box",
                    zIndex: 100,
                    backgroundColor: "white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
            >
                {isMobileLayout && (
                    <div className="mobile-hamburger-container">
                        <HamburgerButton
                            isOpen={isMobileMenuOpen}
                            onClick={toggleMobileMenu}
                            style={{
                                position: "absolute",
                                right: "20px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                display: isSearchExpanded ? "none" : "flex",
                                transition: "opacity 0.3s ease",
                                opacity: isSearchExpanded ? 0 : 1,
                                zIndex: 1000,
                                width: "44px",
                                height: "44px",
                            }}
                        />
                    </div>
                )}
                <div
                    className={`header-logo-container ${isMobileLayout ? "mobile-logo-large" : ""}`}
                    style={{
                        position: isMobileLayout ? "absolute" : "relative",
                        left: isMobileLayout ? headerPadding : "auto",
                        top: isMobileLayout ? "50%" : "auto",
                        transform: isMobileLayout ? "translateY(-50%)" : "none",
                        justifyContent: isMobileLayout ? "flex-start" : "flex-start",
                        flex: isMobileLayout ? "none" : "none",
                        display: isMobileLayout && isSearchExpanded ? "none" : "flex",
                        transition: "opacity 0.3s ease",
                        opacity: isMobileLayout && isSearchExpanded ? 0 : 1,
                        ...(isMobileLayout && {
                            width: "270px",
                            height: "90px",
                            minWidth: "270px",
                            maxWidth: "270px",
                            minHeight: "90px",
                            maxHeight: "90px",
                            overflow: "visible",
                        }),
                    }}
                >
                    <Link
                        href="/"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            // marginRight: "30%",
                            zIndex: 999,
                        }}
                        aria-label="Go to home page"
                    >
                        <Image
                            src="/icons/loogo.svg"
                            alt="KAISO Logo"
                            width={isMobileLayout ? 250 : 50}
                            height={isMobileLayout ? 80 : 0}
                            style={{
                                height: isMobileLayout ? "80px" : "auto",
                                width: isMobileLayout ? "250px" : "100%",
                                objectFit: "contain",
                                minWidth: isMobileLayout ? "250px" : "auto",
                                maxWidth: isMobileLayout ? "250px" : "none",
                                display: "block",
                                ...(isMobileLayout && {
                                    position: "relative",
                                    zIndex: "9999",
                                }),
                            }}
                            quality={100}
                            priority
                        />
                    </Link>
                </div>
                {!isMobileLayout && (
                    <>
                        <>
                            {!isSearchExpanded && (
                                <nav
                                    ref={navRef}
                                    className="header-nav px-2"
                                    style={{
                                        width: "fit-content",
                                        height: "auto",
                                        opacity: 1,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        letterSpacing: "0.5px",
                                        fontWeight: "500",
                                        gap: "16px",
                                        transition: "opacity 0.3s ease",
                                        zIndex: 2,
                                    }}
                                >
                                    <>
                                        <style jsx>{`
                                            @media (min-width: 1080px) and (max-width: 1160px) {
                                                .menu-item {
                                                    font-size: 11.5px !important;
                                                }
                                            }
                                        `}</style>

                                        {menuItems.map((item, index) => (
                                            <div
                                                key={index}
                                                ref={index === 0 ? firstNavItemRef : null}
                                                className={`header-nav-item ${activeSubNav === item.text ? "has-active-submenu" : ""}`}
                                                onMouseEnter={(e) => handleNavItemHover(item.text, e)}
                                                onMouseLeave={(e) => handleNavItemLeave(e)}
                                                onClick={() => handleNavItemClick(item.text)}
                                                style={{ position: "relative", cursor: "pointer" }}
                                            >
                                                <span
                                                    className={`menu-item text-[10px] sm:text-[12px] md:text-[12px] lg:text-[13px] xl:text-[14px] whitespace-nowrap 2xl:text-[14px] transition-all duration-200`}
                                                    style={{
                                                        color: activeMenuItem === item.text ? "#D5003C" : "rgb(50, 50, 50)",
                                                        textDecoration: activeMenuItem === item.text ? "underline" : "none",
                                                        textDecorationColor: activeMenuItem === item.text ? "#D5003C" : "inherit",
                                                        textDecorationThickness: activeMenuItem === item.text ? "2px" : "auto",
                                                        textUnderlineOffset: activeMenuItem === item.text ? "4px" : "auto",
                                                        lineHeight: "120%",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.color = "#D5003C";
                                                        e.target.style.textDecoration = "underline";
                                                        e.target.style.textDecorationColor = "#D5003C";
                                                        e.target.style.textDecorationThickness = "2px";
                                                        e.target.style.textUnderlineOffset = "4px";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (activeMenuItem !== item.text) {
                                                            e.target.style.color = "rgb(50, 50, 50)";
                                                            e.target.style.textDecoration = "none";
                                                        }
                                                    }}
                                                >
                                                    {item.text}
                                                </span>
                                                {item.hasIcon && (
                                                    <div className="header-nav-icon ml-1">
                                                        <Image src="/icons/Dropdown.webp" alt="Dropdown" width={100} height={100} quality={100} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                </nav>
                            )}
                            {isSearchExpanded && (
                                <nav
                                    ref={navRef}
                                    className="header-nav"
                                    style={{
                                        width: "fit-content",
                                        height: "auto",
                                        opacity: 0,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        letterSpacing: "0.5px",
                                        fontWeight: "500",
                                        gap: "16px",
                                        transition: "opacity 0.3s ease",
                                        zIndex: 2,
                                    }}
                                >
                                    {menuItems.map((item, index) => (
                                        <div
                                            key={index}
                                            ref={index === 0 ? firstNavItemRef : null}
                                            className={`header-nav-item ${activeSubNav === item.text ? "has-active-submenu" : ""}`}
                                            onMouseEnter={(e) => handleNavItemHover(item.text, e)}
                                            onMouseLeave={(e) => handleNavItemLeave(e)}
                                            onClick={() => handleNavItemClick(item.text)}
                                            style={{ position: "relative", cursor: "pointer" }}
                                        >
                                            <span
                                                className={`text-[10px] sm:text-[12px] md:text-[13px] lg:text-[13px] xl:text-[14px] whitespace-nowrap 2xl:text-14px] transition-all duration-200`}
                                                style={{
                                                    color: activeMenuItem === item.text ? "#D5003C" : "rgb(50, 50, 50)",
                                                    textDecoration: activeMenuItem === item.text ? "underline" : "none",
                                                    textDecorationColor: activeMenuItem === item.text ? "#D5003C" : "inherit",
                                                    textDecorationThickness: activeMenuItem === item.text ? "2px" : "auto",
                                                    textUnderlineOffset: activeMenuItem === item.text ? "4px" : "auto",
                                                    lineHeight: "120%",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.color = "#D5003C";
                                                    e.target.style.textDecoration = "underline";
                                                    e.target.style.textDecorationColor = "#D5003C";
                                                    e.target.style.textDecorationThickness = "2px";
                                                    e.target.style.textUnderlineOffset = "4px";
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (activeMenuItem !== item.text) {
                                                        e.target.style.color = "rgb(50, 50, 50)";
                                                        e.target.style.textDecoration = "none";
                                                    }
                                                }}
                                            >
                                                {item.text}
                                            </span>

                                            {item.hasIcon && (
                                                <div className="header-nav-icon ml-1">
                                                    <Image src="/icons/Dropdown.webp" alt="Dropdown" width={100} height={100} quality={100} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </nav>
                            )}
                        </>
                        <>
                            <SearchBox
                                onExpandChange={handleSearchExpandChange}
                                isMobileLayout={isMobileLayout}
                                isSearchExpanded={isSearchExpanded}
                                searchPosition={searchPosition}
                                firstNavItemRef={firstNavItemRef}
                                headerPadding={headerPadding}
                            />
                            {isSearchExpanded && (
                                <div
                                    style={{
                                        width: "105px",
                                        marginRight: "5px",
                                        height: "25px",
                                        display: "block",
                                    }}
                                />
                            )}
                        </>
                    </>
                )}
            </div>
            {activeSubNav && !isSearchExpanded && (
                <SubNavMenu
                    data={getSubNavigationData(activeSubNav, navigationData)}
                    isVisible={!!activeSubNav && !isSearchExpanded}
                    position={subNavPosition}
                    onMouseEnter={handleSubNavHover}
                    onMouseLeave={(e) => handleSubNavLeave(e)}
                    parentMenu={activeSubNav}
                    onNavigate={() => handleSubNavClick(activeSubNav)}
                />
            )}
            <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} menuItems={menuItems} navigationData={navigationData} />
        </>
    );
};

export default Header;
