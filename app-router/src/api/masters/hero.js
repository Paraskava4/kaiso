import axiosInstance from "../../utils/axiosInstance";

export const getHeroSections = async () => {
    try {
        const response = await axiosInstance.get("/hero/getHeroSection");
        return { success: true, data: response };
    } catch (error) {
        // Return error object to prevent Next.js error panel
        return {
            success: false,
            error: true,
            message: error?.response?.data?.message || "Failed to get hero sections. Please try again.",
            status: error?.response?.status || 500
        };
    }
};

export const addHeroSection = async (formData) => {
    try {
        const response = await axiosInstance.post("/hero/addHeroSection", formData);
        return { success: true, data: response };
    } catch (error) {
        // Return error object to prevent Next.js error panel
        return {
            success: false,
            error: true,
            message: error?.response?.data?.message || "Failed to add hero section. Please try again.",
            status: error?.response?.status || 500
        };
    }
};

// Delete hero section by id
export const deleteHeroSection = async (heroSectionId) => {
    try {
        const response = await axiosInstance.delete("/hero/deleteHeroSection", {
            params: { heroSectionId },
        });
        return { success: true, data: response };
    } catch (error) {
        // Return error object to prevent Next.js error panel
        return {
            success: false,
            error: true,
            message: error?.response?.data?.message || "Failed to delete hero section. Please try again.",
            status: error?.response?.status || 500
        };
    }
};

// Update hero section details
export const updateHeroSection = async (formData) => {
    try {
        const response = await axiosInstance.put("/hero/updateHeroSection", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return { success: true, data: response };
    } catch (error) {
        // Return error object to prevent Next.js error panel
        return {
            success: false,
            error: true,
            message: error?.response?.data?.message || "Failed to update hero section. Please try again.",
            status: error?.response?.status || 500
        };
    }
};

// Get single hero section by id
export const getHeroSectionById = async (heroSectionId) => {
    try {
        const response = await axiosInstance.get("/hero/getHeroSectionById", {
            params: { heroSectionId },
        });
        return { success: true, data: response };
    } catch (error) {
        // Return error object to prevent Next.js error panel
        return {
            success: false,
            error: true,
            message: error?.response?.data?.message || "Failed to get hero section. Please try again.",
            status: error?.response?.status || 500
        };
    }
};

export const updateHeroSectionOrder = async (data) => {
    if (!data || !Array.isArray(data.heroSectionIds)) {
        return {
            success: false,
            error: true,
            message: "Invalid data provided for reordering",
            status: 400
        };
    }

    try {
        const response = await axiosInstance.put("/hero/updateIndex", data);
        return { success: true, data: response };
    } catch (error) {
        console.error("Error updating hero section order:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                data: error.config?.data,
            },
        });
        // Return error object to prevent Next.js error panel
        return {
            success: false,
            error: true,
            message: error?.response?.data?.message || "Failed to update hero section order. Please try again.",
            status: error?.response?.status || 500
        };
    }
};
