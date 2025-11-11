// Fallback static navigation data for when API is not available
const fallbackNavigationData = {
    "Our Expertise": {
        items: [
            {
                title: "Syndicate Reports",
                subItems: ["Global Report", "Regional Report", "Country Specific Report"],
            },
            {
                title: "Custom Reports and Solutions",
                subItems: [],
            },
            {
                title: "Full Time Engagement",
                subItems: ["On-Demand Engagement", "Full-Time Dedicated Engagement (FTDE)", "Dedicated Analyst Engagement (DAE)"],
            },
            {
                title: "Strategic Analysis",
                subItems: ["TAM Expension", "GTM Strategy", "Competitive Growth"],
            },
        ],
    },
    Industries: {
        items: [
            {
                title: "Life Sciences",
                subItems: ["Pharmaceuticals", "Medical Devices and Supplies", "Healthcare", "Diagnostics and Biotech", "Healthcare IT", "Therapeutics"],
            },
            {
                title: "Consumer Goods",
                subItems: [
                    "Consumer Electronics",
                    "Home Products",
                    "Luxury and High-Value Products",
                    "Personal Care and Cosmetics",
                    "Apparel and Fashion",
                    "Consumer and general services",
                ],
            },
            {
                title: "Materials And Chemicals",
                subItems: [
                    "Renewable and Specialty Chemicals",
                    "Bulk Chemicals",
                    "Composites",
                    "Advanced Materials",
                    "Paints, Coatings and Additives Materials and Chemicals",
                ],
            },
        ],
    },
    "Consulting Services": {
        items: [
            {
                title: "Market Assessment",
                subItems: [],
            },
            {
                title: "Technology Scouting & Monitoring",
                subItems: ["Technology Intelligence", "Idea Funnel Management"],
            },
            {
                title: "Strategic Analysis",
                subItems: ["Go-To-Market Insights", "Identify Market Attractiveness", "Create Differential Advantages"],
            },
            {
                title: "Customer Intelligence",
                subItems: ["Voice of Customers, Wants, Needs, Preferences, and Behaviour", "Customer Satisfaction and Loyalty Assessment"],
            },
        ],
    },
    "About Us": {
        items: [
            {
                title: "Contact",
                subItems: [],
            },
            {
                title: "Become a reseller",
                subItems: [],
            },
        ],
    },
};

// Fallback static menu items
const fallbackMenuItems = [
    { text: "Our Expertise", hasIcon: true },
    { text: "Industries", hasIcon: true },
    { text: "Report Store", href: "/report", hasIcon: false },
    { text: "Consulting Services", hasIcon: true },
    { text: "Blogs & News", href: "/blog", hasIcon: false },
    { text: "About Us", hasIcon: true },
];

/**
 * Transform API navbar data to match the current navbar structure
 * @param {Object} apiResponse - The API response from /web/getNavbar
 * @returns {Object} - Transformed data with menuItems and navigationData
 */
export const transformNavbarData = (apiResponse) => {
    // If no API response, use fallback static data
    if (!apiResponse || !apiResponse.data) {
        return {
            menuItems: fallbackMenuItems,
            navigationData: fallbackNavigationData,
        };
    }

    const menuItems = [];
    const navigationData = {};
    const tempMenuItems = [];

    // Process each page from the API response
    apiResponse.data.forEach((page) => {
        const pageName = page.name;

        // Skip "Landing Page" as it shouldn't appear in the navbar
        if (pageName === "Landing Page") {
            return;
        }

        // Create menu item for header
        // Show dropdown if page has any siteMenu items (regardless of whether they have sub-items)
        // BUT exclude "Blogs & News" and "Report Store" from having dropdown navigation
        const hasSubMenus = page.siteMenu && page.siteMenu.length > 0 && pageName !== "Blogs & News" && pageName !== "Report Store";

        // Handle special cases for navigation
        let href = null;
        if (pageName === "Blogs & News") {
            href = "/blog";
        } else if (pageName === "Report Store") {
            href = "/report";
        }

        const menuItem = {
            text: pageName,
            hasIcon: hasSubMenus, // Show icons for menu items with submenus, except for "Blogs & News" and "Report Store"
            href: href,
        };

        tempMenuItems.push(menuItem);

        // Create navigation data for all menus with siteMenu items
        // Exclude "Blogs & News" from creating navigation data
        if (hasSubMenus && pageName !== "Blogs & News") {
            const items = [];

            // Special handling for Consulting Services page
            if (pageName === "Consulting Services") {
                // Check if there's a "Consulting Services" site menu item with SEO data
                const consultingServicesMenu = page.siteMenu.find(m => m.name?.trim() === "Consulting Services");
                if (consultingServicesMenu && (consultingServicesMenu.seoTitle || consultingServicesMenu.metaDescription || consultingServicesMenu.keywords)) {
                    // If "Consulting Services" exists as a site menu with SEO data, exclude it from dropdown
                    // and only show other menu items
                    page.siteMenu.forEach((menu) => {
                        const menuName = menu.name || (menu.categoryId && menu.categoryId.name) || "Unnamed Menu";
                        
                        // Skip the duplicate "Consulting Services" menu item
                        if (menuName.trim() === "Consulting Services") {
                            return;
                        }

                        const subItems = [];
                        if (menu.siteSubMenu && menu.siteSubMenu.length > 0) {
                            menu.siteSubMenu.forEach((subMenu) => {
                                const subMenuName = subMenu.name || (subMenu.subCategoryId && subMenu.subCategoryId.name) || "Unnamed SubMenu";
                                subItems.push(subMenuName);
                            });
                        }

                        items.push({
                            title: menuName.trim(),
                            subItems: subItems,
                            url: menu.url || menu.pageUrl,
                            image: menu.image,
                            pageItem: menu,
                        });
                    });
                } else {
                    // Normal processing for Consulting Services without duplicate handling
                    page.siteMenu.forEach((menu) => {
                        const menuName = menu.name || (menu.categoryId && menu.categoryId.name) || "Unnamed Menu";

                        const subItems = [];
                        if (menu.siteSubMenu && menu.siteSubMenu.length > 0) {
                            menu.siteSubMenu.forEach((subMenu) => {
                                const subMenuName = subMenu.name || (subMenu.subCategoryId && subMenu.subCategoryId.name) || "Unnamed SubMenu";
                                subItems.push(subMenuName);
                            });
                        }

                        items.push({
                            title: menuName.trim(),
                            subItems: subItems,
                            url: menu.url || menu.pageUrl,
                            image: menu.image,
                            pageItem: menu,
                        });
                    });
                }
            }
            // Special handling for About Us page
            else if (pageName === "About Us") {
                // Check if there's an "About Us" site menu item with SEO data
                const aboutUsMenu = page.siteMenu.find(m => m.name?.trim() === "About Us");
                if (aboutUsMenu && (aboutUsMenu.seoTitle || aboutUsMenu.metaDescription || aboutUsMenu.keywords)) {
                    // If "About Us" exists as a site menu with SEO data, exclude it from dropdown
                    // and only show other menu items
                    page.siteMenu.forEach((menu) => {
                        const menuName = menu.name || (menu.categoryId && menu.categoryId.name) || "Unnamed Menu";
                        
                        // Skip the duplicate "About Us" menu item
                        if (menuName.trim() === "About Us") {
                            return;
                        }

                        const subItems = [];
                        if (menu.siteSubMenu && menu.siteSubMenu.length > 0) {
                            menu.siteSubMenu.forEach((subMenu) => {
                                const subMenuName = subMenu.name || (subMenu.subCategoryId && subMenu.subCategoryId.name) || "Unnamed SubMenu";
                                subItems.push(subMenuName);
                            });
                        }

                        items.push({
                            title: menuName.trim(),
                            subItems: subItems,
                            url: menu.url || menu.pageUrl,
                            image: menu.image,
                            pageItem: menu,
                        });
                    });
                } else {
                    // Normal processing for About Us without duplicate handling
                    page.siteMenu.forEach((menu) => {
                        const menuName = menu.name || (menu.categoryId && menu.categoryId.name) || "Unnamed Menu";

                        const subItems = [];
                        if (menu.siteSubMenu && menu.siteSubMenu.length > 0) {
                            menu.siteSubMenu.forEach((subMenu) => {
                                const subMenuName = subMenu.name || (subMenu.subCategoryId && subMenu.subCategoryId.name) || "Unnamed SubMenu";
                                subItems.push(subMenuName);
                            });
                        }

                        items.push({
                            title: menuName.trim(),
                            subItems: subItems,
                            url: menu.url || menu.pageUrl,
                            image: menu.image,
                            pageItem: menu,
                        });
                    });
                }
            } else {
                // Normal processing for other pages
                page.siteMenu.forEach((menu) => {
                    const menuName = menu.name || (menu.categoryId && menu.categoryId.name) || "Unnamed Menu";

                    const subItems = [];
                    if (menu.siteSubMenu && menu.siteSubMenu.length > 0) {
                        menu.siteSubMenu.forEach((subMenu) => {
                            const subMenuName = subMenu.name || (subMenu.subCategoryId && subMenu.subCategoryId.name) || "Unnamed SubMenu";
                            subItems.push(subMenuName);
                        });
                    }

                    items.push({
                        title: menuName.trim(), // Trim whitespace from API data
                        subItems: subItems,
                        url: menu.url || menu.pageUrl,
                        image: menu.image,
                        pageItem: menu,
                    });
                });
            }

            // Always create navigation data for the page if it has any siteMenu items
            navigationData[pageName] = {
                items: items,
            };
        }
    });

    // Ensure "Report Store" is always included, even if not in API response
    const reportStoreExists = tempMenuItems.some((item) => item.text === "Report Store");
    if (!reportStoreExists) {
        tempMenuItems.push({
            text: "Report Store",
            href: "/report",
            hasIcon: false,
        });
    }

    // Reorder menu items: Report Store should come after Industries and before Consulting Services
    const desiredOrder = ["Services", "Industries", "Report Store", "Consulting Services", "Blogs & News", "About Us"];

    // Sort tempMenuItems according to desired order

    tempMenuItems.sort((a, b) => {
        const indexA = desiredOrder.indexOf(a.text);
        const indexB = desiredOrder.indexOf(b.text);

        // If item not found in desired order, put it at the end
        const finalIndexA = indexA === -1 ? desiredOrder.length : indexA;
        const finalIndexB = indexB === -1 ? desiredOrder.length : indexB;

        return finalIndexA - finalIndexB;
    });

    // Add sorted items to menuItems
    menuItems.push(...tempMenuItems);

    return {
        menuItems,
        navigationData,
    };
};

/**
 * Helper function to check if a menu item has sub-navigation
 * @param {string} menuText - The menu item text
 * @param {Object} navigationData - The transformed navigation data
 * @returns {boolean}
 */
export const hasSubNavigation = (menuText, navigationData) => {
    return navigationData && navigationData.hasOwnProperty(menuText);
};

/**
 * Helper function to get sub-navigation data for a menu item
 * @param {string} menuText - The menu item text
 * @param {Object} navigationData - The transformed navigation data
 * @returns {Object|null}
 */
export const getSubNavigationData = (menuText, navigationData) => {
    return (navigationData && navigationData[menuText]) || null;
};

/**
 * Generate URL-friendly path from title
 * @param {string} title - The title to convert
 * @returns {string}
 */
export const generateUrlPath = (title) => {
    return title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[&]/g, "and")
        .replace(/[^a-z0-9-]/g, "");
};

// Mapping for Industries menu items to report store categories
export const getIndustryCategoryMapping = () => {
    return {
        "life-sciences": {
            displayName: "Life Sciences",
            categoryName: "Life Sciences", // This should match the API category name
            subcategories: ["Pharmaceuticals", "Medical Devices and Supplies", "Healthcare", "Diagnostics and Biotech", "Healthcare IT", "Therapeutics"],
        },
        "consumer-goods": {
            displayName: "Consumer Goods",
            categoryName: "Consumer Goods",
            subcategories: [
                "Consumer Electronics",
                "Home Products",
                "Luxury and High-Value Products",
                "Personal Care and Cosmetics",
                "Apparel and Fashion",
                "Consumer and general services",
            ],
        },
        "materials-chemicals": {
            displayName: "Materials And Chemicals",
            categoryName: "Materials And Chemicals",
            subcategories: [
                "Renewable and Specialty Chemicals",
                "Bulk Chemicals",
                "Composites",
                "Advanced Materials",
                "Paints, Coatings and Additives Materials and Chemicals",
            ],
        },
        "construction-manufacturing": {
            displayName: "Construction and Manufacturing",
            categoryName: "Construction and Manufacturing",
            subcategories: [],
        },
    };
};

/**
 * Get base path for navigation based on parent menu
 * @param {string} parentMenu - The parent menu name
 * @returns {string}
 */
export const getBasePath = (parentMenu) => {
    switch (parentMenu) {
        case "Our Expertise":
        case "Our Experties":
            return ""; // Root level - pages are at /syndicate-reports, /custom-reports, etc.
        case "Industries":
            return "/report"; // Industries now use /report/[category] routing
        case "Consulting Services":
            return ""; // Root level - pages are at /market-assessment, /technology-scouting, etc.
        case "About Us":
        case "About us":
            return "";
        default:
            return "";
    }
};

/**
 * Check if a page has a site menu item with SEO data that matches the page name
 * @param {Object} navbarData - The navbar API response data
 * @param {string} pageName - The page name to check
 * @returns {boolean}
 */
export const hasPageSiteMenuWithSEO = (navbarData, pageName) => {
    if (!navbarData?.data) return false;
    
    const page = navbarData.data.find(p => p.name?.trim() === pageName?.trim());
    if (!page || !page.siteMenu) return false;
    
    const matchingMenu = page.siteMenu.find(m => m.name?.trim() === pageName?.trim());
    return matchingMenu && (matchingMenu.seoTitle || matchingMenu.metaDescription || matchingMenu.keywords);
};

/**
 * Check if a given pathname matches any Industries category or subcategory
 * @param {string} pathname - The current pathname
 * @param {Object} navigationData - The navigation data object
 * @returns {boolean}
 */
export const isIndustriesPath = (pathname, navigationData) => {
    if (!navigationData?.Industries?.items) return false;

    // Check if it's the main Industries page
    if (pathname === "/report-store/industries") return true;

    return navigationData.Industries.items.some(item => {
        const categoryUrl = item?.pageItem?.categoryId?.url;
        if (!categoryUrl) return false;

        // Check if current path matches this category
        if (pathname === `/report-store/${categoryUrl}`) return true;

        // Check if current path matches any subcategory of this category
        if (pathname.startsWith(`/report-store/${categoryUrl}/`)) return true;

        return false;
    });
};

/**
 * Get the category name for a given Industries path
 * @param {string} pathname - The current pathname
 * @param {Object} navigationData - The navigation data object
 * @returns {string|null}
 */
export const getIndustriesCategoryName = (pathname, navigationData) => {
    if (!navigationData?.Industries?.items) return null;

    const matchedItem = navigationData.Industries.items.find(item => {
        const categoryUrl = item?.pageItem?.categoryId?.url;
        if (!categoryUrl) return false;

        return pathname === `/report-store/${categoryUrl}` || pathname.startsWith(`/report-store/${categoryUrl}/`);
    });

    return matchedItem?.pageItem?.categoryId?.name || matchedItem?.title || null;
};