import axiosInstance from "../../utils/axiosInstance";

// Get user profile by user ID
export const getUserProfile = async (userId) => {
    try {
        const response = await axiosInstance.get("/profile/get", {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        // Throw error to properly trigger Redux rejected state
        throw {
            message: error?.response?.data?.message || "Failed to get user profile. Please try again.",
            status: error?.response?.status || 500,
        };
    }
};

// Update user profile
export const updateUserProfile = async (profileData, userId) => {
    try {
        const response = await axiosInstance.put("/profile/update", {
            ...profileData,
            userId,
        });
        return response.data;
    } catch (error) {
        // Throw error to properly trigger Redux rejected state
        throw {
            message: error?.response?.data?.message || "Failed to update profile. Please try again.",
            status: error?.response?.status || 500,
        };
    }
};

// Update user profile with image upload
// IMPORTANT: The backend expects the image field to be named 'image', not 'profileImage'.
export const updateUserProfileWithImage = async (formData, userId) => {
    try {
        // Add userId to FormData
        formData.append("userId", userId);

        const response = await axiosInstance.put("/profile/update", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Profile update error:", error.response?.data || error.message);
        // Throw error to properly trigger Redux rejected state
        throw {
            message: error?.response?.data?.message || "Failed to update profile with image. Please try again.",
            status: error?.response?.status || 500,
        };
    }
};

// Change user password
export const changePassword = async (userId, password) => {
    try {
        const response = await axiosInstance.post("/changePassword", {
            userId,
            password,
        });
        return response.data;
    } catch (error) {
        // Return error object instead of throwing
        return {
            error: true,
            message: error?.response?.data?.message || "Failed to change password. Please try again.",
            status: error?.response?.status || 500,
        };
    }
};
