import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../utils/axiosInstance";
import { BASE_URL } from "../../config";

/**
 * Fetch list of career inquiries
 * @param {number} page - page number (1-indexed)
 * @param {number} limit - page size
 * @param {string} fieldName - field name for sorting (e.g., 'createdAt', 'firstName')
 * @param {number} sort - sort direction (-1 for desc, 1 for asc)
 * @param {string} search - search term
 * @param {string} date - date filter in ISO format (e.g., '2025-07-14T18:30:00.000Z')
 * @returns {Promise<AxiosResponse>}
 */
export const getCareerInquiries = (page = 1, limit = 10, fieldName = "createdAt", sort = -1, search = "", date = "") => {
    let url = `/career/getCareer?page=${page}&limit=${limit}&fieldName=${fieldName}&sort=${sort}&search=${search}`;
    if (date) {
        url += `&date=${encodeURIComponent(date)}`;
    }
    return axiosInstance.get(url);
};

/**
 * Toggle like/dislike status for a career inquiry
 * @param {string} careerId - The career inquiry ID to like/dislike
 * @returns {Promise<AxiosResponse>}
 */
export const likeUnlikeCareerInquiry = (careerId) => {
    return axiosInstance.put(`/career/likeUnlike?careerId=${careerId}`);
};

const type = "Career";

export const careerAPI = createApi({
    reducerPath: "careerAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getGlobalSearchData: builder.mutation({
            query: (params) => {
                return {
                    url: `/career/likeUnlike`,
                    method: "PUT",
                    params,
                };
            },
            providesTags: [type],
        }),
    }),
});

export const { useGetGlobalSearchDataQuery } = careerAPI;
