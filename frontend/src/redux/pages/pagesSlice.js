// /src/admin/redux/slices/pagesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pages: [],
    menus: [],
    subMenus: [],
    selectedPageId: null,
    selectedMenuId: null,
    seoForm: {},
    loading: false,
    error: null,
};

const pagesSlice = createSlice({
    name: "pages",
    initialState,
    reducers: {
        setPages(state, action) {
            state.pages = action.payload;
        },
        setMenus(state, action) {
            state.menus = action.payload;
        },
        setSubMenus(state, action) {
            state.subMenus = action.payload;
        },
        reorderMenus(state, action) {
            const ordered = action.payload; // array of ids

            // Ensure state.menus is an array
            if (!Array.isArray(state.menus)) {
                state.menus = [];
                return;
            }

            // Create a map of reordered menus with updated indices
            const reorderedMenus = ordered
                .map((id, index) => {
                    const menu = state.menus.find((m) => m._id === id);
                    return menu ? { ...menu, index } : null;
                })
                .filter(Boolean);

            // Update the menus array with new order and indices
            state.menus = state.menus.map((menu) => {
                const reordered = reorderedMenus.find((r) => r._id === menu._id);
                return reordered || menu;
            });
        },
        reorderSubMenus(state, action) {
            const { parentId, subMenuIds } = action.payload;

            // Ensure state.subMenus is an array
            if (!Array.isArray(state.subMenus)) {
                state.subMenus = [];
                return;
            }

            // Get submenus not belonging to this parent (unchanged)
            const rest = state.subMenus.filter((s) => s.siteMenuId && s.siteMenuId._id !== parentId);
            // Create reordered submenus with updated indices
            const ordered = subMenuIds
                .map((id, index) => {
                    const submenu = state.subMenus.find((s) => s._id === id);
                    return submenu ? { ...submenu, index } : null;
                })
                .filter(Boolean);
            // Combine unchanged and reordered submenus
            state.subMenus = [...rest, ...ordered];
        },
        selectPage(state, action) {
            state.selectedPageId = action.payload;

            // Ensure state.menus is an array before filtering
            if (!Array.isArray(state.menus)) {
                state.menus = [];
                state.selectedMenuId = null;
                state.seoForm = {};
                return;
            }

            // Find the first menu for the selected page and auto-select it
            const pageMenus = state.menus.filter(menu =>
                menu.sitePageId && menu.sitePageId._id === action.payload
            );

            if (pageMenus.length > 0) {
                const firstMenu = pageMenus[0];
                state.selectedMenuId = firstMenu._id;

                // Auto-populate SEO form with first menu data
                state.seoForm = {
                    pageName: firstMenu.name,
                    titleTag: firstMenu.seoTitle,
                    metaDescription: firstMenu.metaDescription,
                    keywords: firstMenu.keywords,
                    urlSlug: firstMenu.url,
                    pageUrl: firstMenu.pageUrl,
                    socialShareImage: null,
                    existingImage: firstMenu.image || null,
                };
            } else {
                // No menus for this page, clear selection
                state.selectedMenuId = null;
                state.seoForm = {};
            }
        },
        selectMenu(state, action) {
            state.selectedMenuId = action.payload;

            // Ensure arrays exist before searching
            const menus = Array.isArray(state.menus) ? state.menus : [];
            const subMenus = Array.isArray(state.subMenus) ? state.subMenus : [];

            const menu = menus.find((m) => m._id === action.payload) || subMenus.find((m) => m._id === action.payload);
            state.seoForm = menu
                ? {
                      pageName: menu.name,
                      titleTag: menu.seoTitle,
                      metaDescription: menu.metaDescription,
                      keywords: menu.keywords,
                      urlSlug: menu.url,
                      pageUrl: menu.pageUrl,
                      socialShareImage: null,
                      existingImage: menu.image || null,
                  }
                : {};
        },
        updateSEOForm(state, action) {
            state.seoForm = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        refreshMenuData(state, action) {
            const { menus, subMenus } = action.payload;
            if (menus) state.menus = menus;
            if (subMenus) state.subMenus = subMenus;
        },
        setAllSiteData(state, action) {
            const { pages, menus, subMenus } = action.payload;
            if (pages) state.pages = pages;
            if (menus) state.menus = menus;
            if (subMenus) state.subMenus = subMenus;

            // Auto-select first site page and first menu when data is loaded
            if (pages && pages.length > 0 && !state.selectedPageId) {
                state.selectedPageId = pages[0]._id;
            }

            if (menus && menus.length > 0 && !state.selectedMenuId) {
                const firstMenu = menus[0];
                state.selectedMenuId = firstMenu._id;

                // Auto-populate SEO form with first menu data
                state.seoForm = {
                    pageName: firstMenu.name,
                    titleTag: firstMenu.seoTitle,
                    metaDescription: firstMenu.metaDescription,
                    keywords: firstMenu.keywords,
                    urlSlug: firstMenu.url,
                    pageUrl: firstMenu.pageUrl,
                    socialShareImage: null,
                    existingImage: firstMenu.image || null,
                };
            }
        },
    },
});

export const { setPages, setMenus, setSubMenus, reorderMenus, reorderSubMenus, selectPage, selectMenu, updateSEOForm, setLoading, setError, refreshMenuData, setAllSiteData } =
    pagesSlice.actions;
export default pagesSlice.reducer;
