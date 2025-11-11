import axios from "axios";
import { getSessionStorage, setSessionStorage } from "./localStorage";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Utility to decode JWT and check expiration
export function isTokenValid(token) {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.exp) return false;
        // exp is in seconds, Date.now() in ms
        return Date.now() < payload.exp * 1000;
    } catch (e) {
        return false;
    }
}

// Utility to extract user ID from JWT token
export function getUserIdFromToken(token) {
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.userId || null;
    } catch (e) {
        return null;
    }
}

// Utility to get current user ID from localStorage token
export function getCurrentUserId() {
    if (typeof window !== "undefined" && window.localStorage) {
        const token = getSessionStorage("adminToken");
        return getUserIdFromToken(token);
    }
    return null;
}

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
    (config) => {
        // Check if we're in browser environment
        if (typeof window !== "undefined" && window.localStorage) {
            const token = getSessionStorage("adminToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (refreshToken) {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/token`, {
                        refreshToken: refreshToken,
                    });

                    if (response.data?.accessToken) {
                        setSessionStorage("adminToken", response.data.accessToken);
                        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                        return axiosInstance(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                getSessionStorage("adminToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("session");
                localStorage.removeItem("userProfile");
                localStorage.removeItem("rememberMe");
                if (typeof window !== "undefined") {
                    window.location.href = "/auth/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

export const isStatusInclude = (status) => [200, 201, 202, "success", "Success"].includes(status);
export const isStatusIncludeError = (status) => [400, 404, "fail", "Fail", 500, "error"].includes(status);

export default axiosInstance;
