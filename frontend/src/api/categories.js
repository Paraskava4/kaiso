import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor } from "./baseQuery";
import { PrepareHeaders } from "./utils";
import isSuccess from "@/utils/validation/response";

const type = "categories";

export const categoriesApi = createApi({
    reducerPath: "categoriesApi",
    baseQuery: baseQueryWithAuthInterceptor,
    tagTypes: [type],
    // Enhanced caching configuration
    keepUnusedDataFor: 300, // 5 minutes
    refetchOnMountOrArgChange: 300, // 5 minutes
    refetchOnFocus: false,
    refetchOnReconnect: true,
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: (params = {}) => {
                return {
                    url: `/category/getCategory`,
                    method: "GET",
                    params: {
                        ...params,
                    },
                };
            },
            providesTags: [type],
        }),
        getAllCategories: builder.query({
            query: (params = {}) => {
                return {
                    url: `/category/getAllCategory`,
                    method: "GET",
                    params: {
                        page: params.page || 1,
                        limit: params.limit || 10,
                        ...params,
                    },
                };
            },
            providesTags: [type],
        }),
        getAllCategoriesPaginated: builder.query({
            query: (params = {}) => {
                return {
                    url: `/category/getAllCategory`,
                    method: "GET",
                    params: {
                        page: params.page || 1,
                        limit: params.limit || 10,
                        ...params,
                    },
                };
            },
            providesTags: [type],
        }),
        createCategory: builder.mutation({
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
        updateCategory: builder.mutation({
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
        deleteCategory: builder.mutation({
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
        toggleCategoryStatus: builder.mutation({
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
        getSubCategories: builder.query({
            query: () => {
                return {
                    url: `/category/getSubCategory`,
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        getAllSubCategoriesPaginated: builder.query({
            query: (params = {}) => {
                return {
                    url: `/category/getAllSubCategory`,
                    method: "GET",
                    params: {
                        page: params.page || 1,
                        limit: params.limit || 10,
                        ...params,
                    },
                };
            },
            providesTags: [type],
        }),
        createSubCategory: builder.mutation({
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
        updateSubCategory: builder.mutation({
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
        deleteSubCategory: builder.mutation({
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
        toggleSubCategoryStatus: builder.mutation({
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
        deleteMultipleCategory: builder.mutation({
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
        deleteMultipleSubCategory: builder.mutation({
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
        getAllCategoryAndSubcategory: builder.query({
            query: (params) => ({
                url: `/category/getAllCategoryAndSubcategory`,
                method: "GET",
                params,
            }),
            providesTags: [type],
        }),
        getSubcategoryByCategoryId: builder.query({
            query: (params) => ({
                url: `/category/getSubcategoryByCategoryId`,
                method: "GET",
                params,
            }),
            providesTags: [type],
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetCategoriesQuery,
    useGetAllCategoriesQuery,
    useGetAllCategoriesPaginatedQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useToggleCategoryStatusMutation,
    useGetSubCategoriesQuery,
    useGetAllSubCategoriesPaginatedQuery,
    useGetAllCategoryAndSubcategoryQuery,
    useCreateSubCategoryMutation,
    useUpdateSubCategoryMutation,
    useDeleteSubCategoryMutation,
    useToggleSubCategoryStatusMutation,
    useDeleteMultipleCategoryMutation,
    useDeleteMultipleSubCategoryMutation,
    useGetSubcategoryByCategoryIdQuery,
} = categoriesApi;
