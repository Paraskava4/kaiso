import { useEffect, useRef } from "react";
import { useGetNavbarDataQuery } from "@/api/navbar";
import { BASE_URL } from "../../../config";

// Function to update canonical link dynamically
export const updateCanonicalLink = (url) => {
    if (typeof window === 'undefined' || !url) return;
    
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
};

// Function to get current URL for canonical link
export const getCurrentCanonicalUrl = () => {
    if (typeof window === 'undefined') return '/';
    return window.location.href;
};

export const useMetadata = (title, description, keywords) => {
    const lastAppliedRef = useRef({ title: null, description: null, keywords: null });
    const titleObserverRef = useRef(null);

    useEffect(() => {
        // Only update if values have actually changed to prevent unnecessary re-renders
        const hasChanged =
            lastAppliedRef.current.title !== title ||
            lastAppliedRef.current.description !== description ||
            lastAppliedRef.current.keywords !== keywords;

        if (!hasChanged) return;

        // Set document title only if title is provided
        if (title !== undefined && title !== lastAppliedRef.current.title) {
            if (title) {
                document.title = title;
                lastAppliedRef.current.title = title;

                // Set up a MutationObserver to prevent title from being cleared
                if (titleObserverRef.current) {
                    titleObserverRef.current.disconnect();
                }

                titleObserverRef.current = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList' || mutation.type === 'characterData') {
                            const currentTitle = document.title;
                            // If title gets cleared or changed to something we didn't set, restore it
                            if (currentTitle !== title && title) {
                                document.title = title;
                            }
                        }
                    });
                });

                // Observe changes to the document title
                const titleElement = document.querySelector('title');
                if (titleElement) {
                    titleObserverRef.current.observe(titleElement, {
                        childList: true,
                        characterData: true,
                        subtree: true
                    });
                }
            }
        }

        // Set or create meta description only if description is provided
        if (description !== undefined && description !== lastAppliedRef.current.description) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (description) {
                if (metaDescription) {
                    metaDescription.setAttribute("content", description);
                } else {
                    const meta = document.createElement("meta");
                    meta.name = "description";
                    meta.content = description;
                    document.head.appendChild(meta);
                }
                lastAppliedRef.current.description = description;
            } else if (metaDescription) {
                metaDescription.remove();
                lastAppliedRef.current.description = null;
            }
        }

        // Set or create meta keywords only if keywords are provided
        if (keywords !== undefined && keywords !== lastAppliedRef.current.keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            let keywordsContent = Array.isArray(keywords) ? keywords.join(", ") : keywords;
            if (keywordsContent) {
                if (metaKeywords) {
                    metaKeywords.setAttribute("content", keywordsContent);
                } else {
                    const meta = document.createElement("meta");
                    meta.name = "keywords";
                    meta.content = keywordsContent;
                    document.head.appendChild(meta);
                }
                lastAppliedRef.current.keywords = keywords;
            } else if (metaKeywords) {
                metaKeywords.remove();
                lastAppliedRef.current.keywords = null;
            }
        }
    }, [title, description, keywords]);

    // Cleanup observer on unmount
    useEffect(() => {
        return () => {
            if (titleObserverRef.current) {
                titleObserverRef.current.disconnect();
            }
        };
    }, []);
};


export const extractSEOFromNavbar = (navbarData, pageName, menuName = null, subMenuName = null) => {
    if (!navbarData?.data) {
        return { seoTitle: null, metaDescription: null, keywords: null };
    }

    // Find the page by name (trim spaces for comparison)
    const page = navbarData.data.find(p => p.name?.trim() === pageName?.trim());
    if (!page) {
        return { seoTitle: null, metaDescription: null, keywords: null };
    }

    // Special handling for Consulting Services page
    if (pageName?.trim() === "Consulting Services" && !menuName && !subMenuName) {
        // First, check if there's a "Consulting Services" site menu item with SEO data
        const consultingServicesMenu = page.siteMenu?.find(m => m.name?.trim() === "Consulting Services");
        if (consultingServicesMenu && (consultingServicesMenu.seoTitle || consultingServicesMenu.metaDescription || consultingServicesMenu.keywords)) {
            return {
                seoTitle: consultingServicesMenu.seoTitle,
                metaDescription: consultingServicesMenu.metaDescription,
                keywords: consultingServicesMenu.keywords
            };
        }
    }

    // Special handling for About Us page
    if (pageName?.trim() === "About Us" && !menuName && !subMenuName) {
        // First, check if there's an "About Us" site menu item with SEO data
        const aboutUsMenu = page.siteMenu?.find(m => m.name?.trim() === "About Us");
        if (aboutUsMenu && (aboutUsMenu.seoTitle || aboutUsMenu.metaDescription || aboutUsMenu.keywords)) {
            return {
                seoTitle: aboutUsMenu.seoTitle,
                metaDescription: aboutUsMenu.metaDescription,
                keywords: aboutUsMenu.keywords
            };
        }
    }

    // Special handling for Contact Us page
    if (pageName?.trim() === "Contact Us" && !menuName && !subMenuName) {
        // First, check if there's a "Contact Us" site menu item with SEO data
        const contactUsMenu = page.siteMenu?.find(m => m.name?.trim() === "Contact Us");
        if (contactUsMenu && (contactUsMenu.seoTitle || contactUsMenu.metaDescription || contactUsMenu.keywords)) {
            return {
                seoTitle: contactUsMenu.seoTitle,
                metaDescription: contactUsMenu.metaDescription,
                keywords: contactUsMenu.keywords
            };
        }
    }

    // If no specific menu/submenu requested, return page-level SEO data if available
    if (!menuName && !subMenuName) {
        // Check if page has direct SEO data (some pages might have it)
        if (page.seoTitle || page.metaDescription || page.keywords) {
            return {
                seoTitle: page.seoTitle,
                metaDescription: page.metaDescription,
                keywords: page.keywords
            };
        }
        // Otherwise, return the first menu's SEO data
        if (page.siteMenu && page.siteMenu.length > 0) {
            const firstMenu = page.siteMenu[0];
            return {
                seoTitle: firstMenu.seoTitle,
                metaDescription: firstMenu.metaDescription,
                keywords: firstMenu.keywords
            };
        }
        return { seoTitle: null, metaDescription: null, keywords: null };
    }

    // Find specific menu (trim spaces for comparison)
    if (menuName) {
        const menu = page.siteMenu?.find(m => m.name?.trim() === menuName?.trim());
        if (!menu) {
            return { seoTitle: null, metaDescription: null, keywords: null };
        }

        // If no submenu requested, return menu-level SEO data
        if (!subMenuName) {
            return {
                seoTitle: menu.seoTitle,
                metaDescription: menu.metaDescription,
                keywords: menu.keywords
            };
        }

        // Find specific submenu (trim spaces for comparison)
        const subMenu = menu.siteSubMenu?.find(sm => sm.name?.trim() === subMenuName?.trim());
        if (!subMenu) {
            return { seoTitle: null, metaDescription: null, keywords: null };
        }

        return {
            seoTitle: subMenu.seoTitle,
            metaDescription: subMenu.metaDescription,
            keywords: subMenu.keywords
        };
    }

    return { seoTitle: null, metaDescription: null, keywords: null };
};


// Hook to extract SEO data without applying DOM changes
export const useNavbarSEOData = (pageName, menuName = null, subMenuName = null) => {
    const { data: navbarData, isLoading } = useGetNavbarDataQuery();

    // Extract SEO data from navbar API
    const seoData = extractSEOFromNavbar(navbarData, pageName, menuName, subMenuName);

    return {
        isLoading,
        seoData: {
            seoTitle: seoData.seoTitle || null,
            metaDescription: seoData.metaDescription || null,
            keywords: seoData.keywords || null
        }
    };
};

export const useNavbarSEO = (pageName, menuName = null, subMenuName = null) => {
    const { data: navbarData, isLoading, error } = useGetNavbarDataQuery();


    if (BASE_URL.startsWith("http://192")) {
        const fallbackSEO = {
            // seoTitle: "KAISO - Market Research & Business Intelligence",
            // metaDescription: "Leading provider of market research reports and business intelligence solutions",
            // keywords: "market research, business intelligence, reports, analytics"
        };

        // useMetadata(fallbackSEO.seoTitle, fallbackSEO.metaDescription, fallbackSEO.keywords);

        return {
            // isLoading: false,
            // seoData: fallbackSEO
        };
    }

    // Extract SEO data from navbar API
    const seoData = extractSEOFromNavbar(navbarData, pageName, menuName, subMenuName);

    // Only use API data - no fallback text
    const title = seoData.seoTitle || null;
    const description = seoData.metaDescription || null;
    const keywords = seoData.keywords || null;

    // Only apply metadata when we have navbar data and at least one SEO field
    // This prevents clearing meta tags before API data loads
    const hasAnyData = title || description || keywords;
    const shouldApplyMetadata = navbarData && hasAnyData;

    // Apply the metadata using the existing useMetadata hook only when we have data
    useMetadata(
        shouldApplyMetadata ? title : undefined,
        shouldApplyMetadata ? description : undefined,
        shouldApplyMetadata ? keywords : undefined
    );

    return {
        isLoading,
        seoData: {
            seoTitle: title,
            metaDescription: description,
            keywords: keywords
        }
    };
};