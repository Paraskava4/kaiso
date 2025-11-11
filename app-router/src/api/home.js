import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import isSuccess from "@/utils/validation/response";

const type = "HomeAPI";

export const homeApi = createApi({
    reducerPath: "HomeAPI",
    baseQuery,
    tagTypes: [type],
    // Enhanced caching configuration
    keepUnusedDataFor: 300, // 5 minutes
    refetchOnMountOrArgChange: 300, // 5 minutes
    refetchOnFocus: false,
    refetchOnReconnect: true,
    endpoints: (builder) => ({
        getLandingPageData: builder.query({
            query: (params) => {
                return {
                    url: `/web/landingPage`,
                    method: "GET",
                    params,
                };
            },
            providesTags: [type],
            // Enhanced caching for landing page data
            keepUnusedDataFor: 600, // 10 minutes
        }),
        getGlobalSearchData: builder.query({
            query: (params) => {
                return {
                    url: `/web/search`,
                    method: "GET",
                    params,
                };
            },
            providesTags: [type],
        }),
        getBlogByIdData: builder.query({
            query: (blogId) => {
                return {
                    url: `/web/getBlogById?blogId=${blogId}`,
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        getReportData: builder.query({
            query: (reportId) => {
                return {
                    url: `/web/getReportById?reportId=${reportId}`,
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        getLetestArticleData: builder.query({
            query: () => {
                return {
                    url: `/web/latestBlogArticle`,
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        getNewsArticleById: builder.query({
            query: (newsArticleId) => {
                return {
                    url: `/web/getNewsArticleById?newsArticleId=${newsArticleId}`,
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        getUrlToData: builder.query({
            query: (params) => {
                return {
                    url: `/web/getDataByURL`,
                    method: "GET",
                    params,
                };
            },
            transformErrorResponse: (response) => response,
            transformResponse: (response) => response,
            providesTags: [type],
        }),
        getDataByCategoryAndSubcategory: builder.query({
            query: (params) => {
                return {
                    url: `/web/getDataByCategoryAndSubcategory`,
                    method: "GET",
                    params,
                };
            },
            providesTags: [type],
        }),
        getCategoryAndSubcategory: builder.query({
            query: () => {
                return {
                    url: `/web/categoryAndSubcategory`,
                    method: "GET",
                };
            },
            providesTags: [type],
            // Enhanced caching for categories (rarely change)
            keepUnusedDataFor: 1800, // 30 minutes
        }),
        // >>>>>>>>>>>>>>>>>>> Report >>>>>>>>>>>>>>>>>>>>>>>

        getDataBySubCategory: builder.query({
            query: (selectedSubCategory) => {
                return {
                    url: `/web/getDataBySubCategory?subCategoryId=${selectedSubCategory}`,
                    method: "GET",
                };
            },
            transformErrorResponse: (response) => response,
            transformResponse: (response) => response,
            providesTags: [type],
        }),
        getDataByCategory: builder.query({
            query: (selectedCategory) => {
                return {
                    url: `/web/getDataByCategory?categoryId=${selectedCategory}`,
                    method: "GET",
                };
            },
            transformErrorResponse: (response) => response,
            transformResponse: (response) => response,
            providesTags: [type],
        }),
        getReport: builder.query({
            query: () => {
                return {
                    url: `/web/getReport`,
                    method: "GET",
                };
            },
            transformErrorResponse: (response) => response,
            transformResponse: (response) => response,
            providesTags: [type],
        }),
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

        createLink: builder.mutation({
            query: (body) => {
                return {
                    url: `/paypal/createLink`,
                    method: "POST",
                    body,
                };
            },
            invalidatesTags: [type],
        }),
        createLinkRazorpay: builder.mutation({
            query: (body) => {
                return {
                    url: `/razorpay/createLink`,
                    method: "POST",
                    body,
                };
            },
            invalidatesTags: [type],
        }),
        createOrderCapture: builder.mutation({
            query: (params) => {
                return {
                    url: `/paypal/orderCapture`,
                    method: "POST",
                    params,
                };
            },
            // transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: (error) => (!error ? [type] : [type]),
        }),
        updateInquiryType: builder.mutation({
            query: (body) => {
                return {
                    url: `/inquiry/update`,
                    method: "PUT",
                    body,
                };
            },
            // transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: (error) => (!error ? [type] : [type]),
        }),
    }),
});

export const {
    useGetLandingPageDataQuery,
    useGetGlobalSearchDataQuery,
    useGetBlogByIdDataQuery,
    useGetReportDataQuery,
    useGetLetestArticleDataQuery,
    useGetNewsArticleByIdQuery,
    useGetUrlToDataQuery,
    useGetDataByCategoryAndSubcategoryQuery,
    useGetCategoryAndSubcategoryQuery,
    useCreateLinkMutation,
    useCreateLinkRazorpayMutation,
    useCreateOrderCaptureMutation,
    useUpdateInquiryTypeMutation,
    useGetDataBySubCategoryQuery,
    useGetDataByCategoryQuery,
    useGetReportQuery,
} = homeApi;
