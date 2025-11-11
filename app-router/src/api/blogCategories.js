import { createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config";
import { baseQueryWithAuthInterceptor, PrepareHeaders } from "./utils";
import isSuccess from "@/utils/validation/response";

const type = "blogCategory";

export const blogCategoriesApi = createApi({
    reducerPath: "blogCategoriesApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            return PrepareHeaders(headers, { getState });
        },
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        // Get blog categories (non-paginated) with type filtering
        getBlogCategories: builder.query({
            query: (params = {}) => {
                return {
                    url: `/category/getCategory`,
                    method: "GET",
                    params: {
                        type: 'Blog', // Filter for Blog type only
                        ...params
                    },
                };
            },
            providesTags: [type],
        }),
        // Get news categories (non-paginated) with type filtering
        getNewsCategories: builder.query({
            query: (params = {}) => {
                return {
                    url: `/category/getCategory`,
                    method: "GET",
                    params: {
                        type: 'News Article', // Filter for News Article type only
                        ...params
                    },
                };
            },
            providesTags: [type],
        }),
        // Get all blog categories (main domains) with type filtering
        getAllBlogCategories: builder.query({
            query: (params = {}) => {
                return {
                    url: `/category/getAllCategory`,
                    method: "GET",
                    params: {
                        page: params.page || 1,
                        limit: params.limit || 10,
                        type: 'Blog', // Filter for Blog type only
                        ...params
                    },
                };
            },
            providesTags: [type],
        }),
        getAllBlogCategoriesPaginated: builder.query({
            query: (params = {}) => {
                return {
                    url: `/category/getAllCategory`,
                    method: "GET",
                    params: {
                        page: params.page || 1,
                        limit: params.limit || 10,
                        type: 'Blog', // Filter for Blog type only
                        ...params
                    },
                };
            },
            providesTags: [type],
        }),
        // Get all news categories (main domains) with type filtering
        getAllNewsCategories: builder.query({
            query: (params = {}) => {
                return {
                    url: `/category/getAllCategory`,
                    method: "GET",
                    params: {
                        page: params.page || 1,
                        limit: params.limit || 10,
                        type: 'News Article', // Filter for News Article type only
                        ...params
                    },
                };
            },
            providesTags: [type],
        }),
        getAllNewsCategoriesPaginated: builder.query({
            query: (params = {}) => {
                return {
                    url: `/category/getAllCategory`,
                    method: "GET",
                    params: {
                        page: params.page || 1,
                        limit: params.limit || 10,
                        type: 'News Article', // Filter for News Article type only
                        ...params
                    },
                };
            },
            providesTags: [type],
        }),
        // Get all blog subcategories (subdomains) with type filtering
        getAllBlogSubCategories: builder.query({
            query: (params = {}) => {
                return {
                    url: `/category/getAllSubCategory`,
                    method: "GET",
                    params: {
                        page: params.page || 1,
                        limit: params.limit || 10,
                        type: 'Blog', // Filter for Blog type only
                        ...params
                    },
                };
            },
            providesTags: [type],
        }),
        getAllBlogSubCategoriesPaginated: builder.query({
            query: (params = {}) => {
                return {
                    url: `/category/getAllSubCategory`,
                    method: "GET",
                    params: {
                        page: params.page || 1,
                        limit: params.limit || 10,
                        type: 'Blog', // Filter for Blog type only
                        ...params
                    },
                };
            },
            providesTags: [type],
        }),
        // Get all news subcategories (subdomains) with type filtering
        getAllNewsSubCategories: builder.query({
            query: (params = {}) => {
                return {
                    url: `/category/getAllSubCategory`,
                    method: "GET",
                    params: {
                        page: params.page || 1,
                        limit: params.limit || 10,
                        type: 'News Article', // Filter for News Article type only
                        ...params
                    },
                };
            },
            providesTags: [type],
        }),
        getAllNewsSubCategoriesPaginated: builder.query({
            query: (params = {}) => {
                return {
                    url: `/category/getAllSubCategory`,
                    method: "GET",
                    params: {
                        page: params.page || 1,
                        limit: params.limit || 10,
                        type: 'News Article', // Filter for News Article type only
                        ...params
                    },
                };
            },
            providesTags: [type],
        }),
        getAllCategoryAndSubcategory: builder.query({
            query: (params) => ({
                url: `/category/getAllCategoryAndSubcategory`,
                method: "GET",
                params,
            }),
            providesTags: [type],
        }),
        // Create blog category (main domain)
        createBlogCategory: builder.mutation({
            query: (formData) => {
                return {
                    url: `/category/createCategory`,
                    method: "POST",
                    body: formData,
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: [type],
        }),
        // Update blog category (main domain)
        updateBlogCategory: builder.mutation({
            query: (formData) => {
                return {
                    url: `/category/updateCategory`,
                    method: "PUT",
                    body: formData,
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: [type],
        }),
        // Delete blog category (main domain)
        deleteBlogCategory: builder.mutation({
            query: (categoryId) => {
                return {
                    url: `/category/deleteCategory`,
                    method: "DELETE",
                    params: { categoryId },
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: [type],
        }),
        // Toggle blog category status
        toggleBlogCategoryStatus: builder.mutation({
            query: (categoryId) => {
                return {
                    url: `/category/categoryStatusChange`,
                    method: "POST",
                    params: { categoryId },
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: [type],
        }),
        // Create blog subcategory (subdomain)
        createBlogSubCategory: builder.mutation({
            query: (formData) => {
                return {
                    url: `/category/createSubCategory`,
                    method: "POST",
                    body: formData,
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: [type],
        }),
        // Update blog subcategory (subdomain)
        updateBlogSubCategory: builder.mutation({
            query: (formData) => {
                return {
                    url: `/category/updateSubCategory`,
                    method: "PUT",
                    body: formData,
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: [type],
        }),
        // Delete blog subcategory (subdomain)
        deleteBlogSubCategory: builder.mutation({
            query: (subCategoryId) => {
                return {
                    url: `/category/deleteSubCategory`,
                    method: "DELETE",
                    params: { subCategoryId },
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: [type],
        }),
        // Toggle blog subcategory status
        toggleBlogSubCategoryStatus: builder.mutation({
            query: (subCategoryId) => {
                return {
                    url: `/category/subCategoryStatusChange`,
                    method: "POST",
                    params: { subCategoryId },
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: [type],
        }),
        // Delete multiple blog categories
        deleteMultipleBlogCategory: builder.mutation({
            query: (categoryIds) => {
                return {
                    url: `/category/deleteMultipleCategory`,
                    method: "DELETE",
                    body: { categoryIds },
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: [type],
        }),
        // Delete multiple blog subcategories
        deleteMultipleBlogSubCategory: builder.mutation({
            query: (subCategoryIds) => {
                return {
                    url: `/category/deleteMultipleSubCategory`,
                    method: "DELETE",
                    body: { subCategoryIds },
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: [type],
        }),
    }),
});

export const {
    useGetBlogCategoriesQuery,
    useGetNewsCategoriesQuery,
    useGetAllBlogCategoriesQuery,
    useGetAllBlogCategoriesPaginatedQuery,
    useGetAllNewsCategoriesQuery,
    useGetAllNewsCategoriesPaginatedQuery,
    useGetAllBlogSubCategoriesQuery,
    useGetAllBlogSubCategoriesPaginatedQuery,
    useGetAllNewsSubCategoriesQuery,
    useGetAllNewsSubCategoriesPaginatedQuery,
    useGetAllCategoryAndSubcategoryQuery,
    useCreateBlogCategoryMutation,
    useUpdateBlogCategoryMutation,
    useDeleteBlogCategoryMutation,
    useToggleBlogCategoryStatusMutation,
    useCreateBlogSubCategoryMutation,
    useUpdateBlogSubCategoryMutation,
    useDeleteBlogSubCategoryMutation,
    useToggleBlogSubCategoryStatusMutation,
    useDeleteMultipleBlogCategoryMutation,
    useDeleteMultipleBlogSubCategoryMutation,
} = blogCategoriesApi;
