import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../utils/axiosInstance";
import { BASE_URL } from "../../config";

/**
 * Fetch list of inquiries
 * @param {number} page - page number (1-indexed)
 * @param {number} limit - page size
 * @param {string} type - inquiry type filter
 * @param {string} fieldName - field name for sorting (e.g., 'createdAt', 'clientName')
 * @param {number} sort - sort direction (-1 for desc, 1 for asc)
 * @param {string} search - search term
 * @param {string} date - date filter in ISO format (e.g., '2025-07-14T18:30:00.000Z')
 * @returns {Promise<AxiosResponse>}
 */
export const getInquiries = (page = 1, limit = 10, type = "", fieldName = "createdAt", sort = -1, search = "", date = "") => {
    let url = `/inquiry/getAll?page=${page}&limit=${limit}&fieldName=${fieldName}&sort=${sort}&search=${search}`;
    if (type) {
        url += `&type=${encodeURIComponent(type)}`;
    }
    if (date) {
        url += `&date=${encodeURIComponent(date)}`;
    }
    return axiosInstance.get(url);
};

/**
 * Toggle like/dislike status for an inquiry
 * @param {string} inquiryId - The inquiry ID to like/dislike
 * @returns {Promise<AxiosResponse>}
 */
export const likeUnlikeInquiry = (inquiryId) => {
    return axiosInstance.put(`/inquiry/likeUnlike?inquiryId=${inquiryId}`);
};

const type = "Inquiries";

export const inquiriesAPI = createApi({
    reducerPath: "inquiriesAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getGlobalSearchData: builder.mutation({
            query: (params) => {
                return {
                    url: `/inquiry/likeUnlike`,
                    method: "PUT",
                    params,
                };
            },
            providesTags: [type],
        }),
    }),
});

export const { useGetGlobalSearchDataQuery } = inquiriesAPI;
