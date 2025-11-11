// /src/admin/api/pages/index.js

import axiosInstance from "@/utils/axiosInstance";

// Helper function to process unified API response into separate arrays
export const processSiteData = (siteData) => {
    const pages = [];
    const menus = [];
    const subMenus = [];

    siteData.forEach(page => {
        // Process page data
        pages.push({
            _id: page._id,
            name: page.name,
            title: page.title || page.name,
            organizationId: page.organizationId,
            createdAt: page.createdAt,
            updatedAt: page.updatedAt
        });

        // Process menu data
        if (page.siteMenu && page.siteMenu.length > 0) {
            page.siteMenu.forEach(menu => {
                // Handle both direct name and categoryId.name patterns
                const menuName = menu.name || (menu.categoryId && menu.categoryId.name) || 'Unnamed Menu';

                menus.push({
                    ...menu,
                    name: menuName, // Ensure name is always available
                    sitePageId: { _id: page._id, name: page.name }
                });

                // Process submenu data
                if (menu.siteSubMenu && menu.siteSubMenu.length > 0) {
                    menu.siteSubMenu.forEach(subMenu => {
                        // Handle both direct name and subCategoryId.name patterns
                        const subMenuName = subMenu.name || (subMenu.subCategoryId && subMenu.subCategoryId.name) || 'Unnamed Submenu';

                        subMenus.push({
                            ...subMenu,
                            name: subMenuName, // Ensure name is always available
                            siteMenuId: { _id: menu._id, name: menuName },
                            sitePageId: { _id: page._id, name: page.name }
                        });
                    });
                }
            });
        }
    });

    return { pages, menus, subMenus };
};

// New unified API call that gets all data in one request
export const fetchAllSiteData = async () => {
    try {
        const response = await axiosInstance.get("/sitePage/getNew");
        return { success: true, data: response.data.data };
    } catch (error) {
        // Return error result instead of throwing to prevent Next.js error panel
        return {
            success: false,
            error: {
                message: 'Failed to fetch site data',
                status: error.response?.status,
                code: error.code,
                originalError: error
            }
        };
    }
};

// New function that fetches and processes all site data
export const fetchAndProcessAllSiteData = async () => {
    const result = await fetchAllSiteData();

    if (!result.success) {
        // Return the error result instead of throwing
        return result;
    }

    try {
        const processedData = processSiteData(result.data);
        return { success: true, data: processedData };
    } catch (error) {
        // Return error result for processing failures
        return {
            success: false,
            error: {
                message: 'Failed to process site data',
                originalError: error
            }
        };
    }
};

export const fetchPages = async () => {
    try {
        const response = await axiosInstance.get("/sitePage/getNew");
        return response.data.data; // Returns array of pages
    } catch (error) {
        // Return error object instead of throwing
        return {
            error: true,
            message: error?.response?.data?.message || "Failed to fetch pages. Please try again.",
            status: error?.response?.status || 500
        };
    }
};
export const fetchMenus = async () => {
    try {
        // Use the new unified API and extract menus
        const result = await fetchAllSiteData();

        // Check if the API call was successful
        if (!result.success) {
            return { error: true, message: result.error?.message || 'Failed to fetch site data', status: result.error?.status || 500 };
        }

        const siteData = result.data;
        const allMenus = [];

        siteData.forEach(page => {
            if (page.siteMenu && page.siteMenu.length > 0) {
                page.siteMenu.forEach(menu => {
                    // Handle both direct name and categoryId.name patterns
                    const menuName = menu.name || (menu.categoryId && menu.categoryId.name) || 'Unnamed Menu';

                    allMenus.push({
                        ...menu,
                        name: menuName, // Ensure name is always available
                        sitePageId: { _id: page._id, name: page.name }
                    });
                });
            }
        });

        return allMenus;
    } catch (error) {
        return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    }
};
export const fetchSubMenus = async () => {
    try {
        // Use the new unified API and extract submenus
        const result = await fetchAllSiteData();

        // Check if the API call was successful
        if (!result.success) {
            return { error: true, message: result.error?.message || 'Failed to fetch site data', status: result.error?.status || 500 };
        }

        const siteData = result.data;
        const allSubMenus = [];

        siteData.forEach(page => {
            if (page.siteMenu && page.siteMenu.length > 0) {
                page.siteMenu.forEach(menu => {
                    // Handle both direct name and categoryId.name patterns for menu
                    const menuName = menu.name || (menu.categoryId && menu.categoryId.name) || 'Unnamed Menu';

                    if (menu.siteSubMenu && menu.siteSubMenu.length > 0) {
                        menu.siteSubMenu.forEach(subMenu => {
                            // Handle both direct name and subCategoryId.name patterns for submenu
                            const subMenuName = subMenu.name || (subMenu.subCategoryId && subMenu.subCategoryId.name) || 'Unnamed Submenu';

                            allSubMenus.push({
                                ...subMenu,
                                name: subMenuName, // Ensure name is always available
                                siteMenuId: { _id: menu._id, name: menuName },
                                sitePageId: { _id: page._id, name: page.name }
                            });
                        });
                    }
                });
            }
        });

        return allSubMenus;
    } catch (error) {
        return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    }
};

// Get site menu by id
export const getSiteMenuById = async (siteMenuId) => {
    try {
        const response = await axiosInstance.get(`/sitePage/getSiteMenuById`, {
            params: { siteMenuId },
        });
        return response.data.data;
    } catch (error) {
        return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    }
};

export const hideSiteMenu = async (siteMenuId) => {
    try {
        const response = await axiosInstance.put("/sitePage/hideShow", {
            siteMenuId
        });
        return response.data.data;
    } catch (error) {
        return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    }
};

export const updateSiteMenu = async (payload) => {
    try {
        const response = await axiosInstance.put("/sitePage/updateSiteMenu", payload);
        return response.data.data;
    } catch (error) {
        return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    }
};

export const getSiteSubMenuById = async (siteSubMenuId) => {
    try {
        const response = await axiosInstance.get(`/sitePage/getSiteSubMenuById`, {
            params: { siteSubMenuId },
        });
        return response.data.data;
    } catch (error) {
        return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    }
};

export const updateSiteMenuIndex = async (siteMenuIds) => {
    try {
        const response = await axiosInstance.put("/sitePage/updateSiteMenuIndex", { siteMenuIds });
        return response.data.data;
    } catch (error) {
        return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    }
};

export const updateSiteSubMenuIndex = async (siteSubMenuIds) => {
    try {
        const response = await axiosInstance.put("/sitePage/updateSiteSubMenuIndex", { siteSubMenuIds });
        return response.data.data;
    } catch (error) {
        return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    }
};

export const hideSiteSubMenu = async (siteMenuId, siteSubMenuId) => {
    try {
        const response = await axiosInstance.put("/sitePage/hideShow", {
            siteMenuId,
            siteSubMenuId
        });
        return response.data.data;
    } catch (error) {
        return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    }
};

export const updateSiteSubMenu = async (payload) => {
    try {
        const response = await axiosInstance.put("/sitePage/updateSiteSubMenu", payload);
        return response.data.data;
    } catch (error) {
        return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    }
};

export const saveSEO = async (seoData) => {
    try {
        const formData = new FormData();
        Object.entries(seoData).forEach(([key, value]) => {
            if (key === "socialShareImage" && value instanceof File) {
                formData.append(key, value);
            } else {
                formData.append(key, value || "");
            }
        });
        const response = await axiosInstance.post("/sitePage/saveSEO", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    }
};

export const updateSiteMenuWithImage = async (formData) => {
    try {
        const response = await axiosInstance.put("/sitePage/updateSiteMenu", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        
        // Check if the response indicates an error
        if (response.data.status === "Failed") {
            throw new Error(response.data.message || "Update failed");
        }
        
        return response.data.data;
    } catch (error) {
        console.error('updateSiteMenuWithImage error:', error);
        // Throw the error so it can be caught by the calling function
        throw error;
    }
};

export const updateSiteSubMenuWithImage = async (formData) => {
    try {
        const response = await axiosInstance.put("/sitePage/updateSiteSubMenu", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        
        // Check if the response indicates an error
        if (response.data.status === "Failed") {
            throw new Error(response.data.message || "Update failed");
        }
        
        return response.data.data;
    } catch (error) {
        console.error('updateSiteSubMenuWithImage error:', error);
        // Throw the error so it can be caught by the calling function
        throw error;
    }
};
