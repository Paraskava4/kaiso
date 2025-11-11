import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config";

/**
 * Enhanced base query with caching headers and error handling
 */
export const createBaseQuery = (options = {}) => {
    return fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { endpoint }) => {
            // Add cache headers for GET requests on client-side
            if (typeof window !== 'undefined' && endpoint?.method === 'GET') {
                headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache
            }
            return headers;
        },
        ...options,
    });
};

export const baseQuery = createBaseQuery();

/**
 * Base query with authentication interceptor
 */
export const baseQueryWithAuthInterceptor = createBaseQuery({
    prepareHeaders: (headers, { getState }) => {
        // Add auth token if available
        const token = getState()?.auth?.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        
        // Add cache headers for GET requests
        if (typeof window !== 'undefined') {
            headers.set('Cache-Control', 'public, max-age=300');
        }
        
        return headers;
    },
});

