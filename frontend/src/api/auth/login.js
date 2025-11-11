import axiosInstance from "../../utils/axiosInstance";

export const login = async (credentials) => {
    try {
        const response = await axiosInstance.post("/login", credentials);
        return response.data;
    } catch (error) {
        // Return error object instead of throwing
        return {
            error: true,
            message: error?.response?.data?.message || "Login failed. Please try again.",
            status: error?.response?.status || 500
        };
    }
};
