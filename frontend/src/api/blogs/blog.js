import axiosInstance from "../../utils/axiosInstance";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, PrepareHeaders } from "../utils";
import { BASE_URL } from "../../../config";
import isSuccess from "@/utils/validation/response";
import { prepareFormData } from "@/utils/constants/api/formData";
import { API } from "@/utils/constants/api/schemas";
const { ARTICLE_CREATE_EDIT } = API;

// Traditional API functions for backward compatibility
export const getAllBlogs = () => axiosInstance.get("/blog/getAllBlog");

// Get blog by ID
// GET /web/getBlogById?blogId={id}
// Returns a single blog object
export const getBlogById = (blogId) =>
    axiosInstance
        .get("/web/getBlogById", { params: { blogId } })
        .then((response) => {
            
            return response;
        })
        .catch((error) => {
            
            return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
        });

// Get all articles with pagination
export const getAllArticles = (page = 1, limit = 10) =>
    axiosInstance
        .get("/blog/getAll", { params: { page, limit } })
        .then((response) => response)
        .catch((error) => {
            
            return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
        });

// Get article by ID
export const getArticleById = (blogId) =>
    axiosInstance
        .get("/blog/getById", { params: { blogId } })
        .then((response) => response)
        .catch((error) => {
            
            return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
        });

// Create new article
export const createArticle = (articleData) =>
    axiosInstance
        .post("/blog/create", articleData)
        .then((response) => response)
        .catch((error) => {
            
            return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
        });

// Update article
export const updateArticle = (articleData) =>
    axiosInstance
        .put("/blog/update", articleData)
        .then((response) => response)
        .catch((error) => {
            
            return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
        });
export const updateArticle1 = (articleData) =>
    axiosInstance
        .put("/blog/update", articleData)
        .then((response) => response)
        .catch((error) => {
            
            return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
        });

// Delete article
export const deleteArticle = (blogId) =>
    axiosInstance
        .delete("/blog/deleteBlog", { params: { blogId } })
        .then((response) => response)
        .catch((error) => {
            
            return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
        });

// Import CSV
export const importArticlesCSV = (formData) =>
    axiosInstance
        .post("/blog/importCsv", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => response)
        .catch((error) => {
            
            return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
        });

// Page Blog Article APIs
// Get page blog articles by page title
export const getPageBlogArticles = (pageTitle) =>
    axiosInstance
        .get("/pageBlogArticle/get", { params: { pageTitle } })
        .then((response) => response)
        .catch((error) => {
            
            return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
        });

// Add page blog article
export const addPageBlogArticle = (data) =>
    axiosInstance
        .post("/pageBlogArticle/add", data)
        .then((response) => response)
        .catch((error) => {
            
            return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
        });

// Delete page blog article
export const deletePageBlogArticle = (pageBlogArticleId) =>
    axiosInstance
        .delete("/pageBlogArticle/delete", { params: { pageBlogArticleId } })
        .then((response) => response)
        .catch((error) => {
            
            return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
        });

// Update page blog article index/position
export const updatePageBlogArticleIndex = (data) =>
    axiosInstance
        .put("/pageBlogArticle/updateIndex", data)
        .then((response) => response)
        .catch((error) => {
            
            return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
        });

const type = "article";

// RTK Query API for Articles
export const articlesApi = createApi({
    reducerPath: "articlesApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            return PrepareHeaders(headers, { getState });
        },
    }),
    tagTypes: [type, "pageBlogArticle"],
    endpoints: (builder) => ({
        getAllArticles: builder.query({
            query: (params) => {
                return {
                    url: `/blog/getAll`,
                    method: "GET",
                    params,
                };
            },
            providesTags: [type],
        }),
        getAllArticlesPaginationWise: builder.query({
            query: (params) => {
                return {
                    url: `/blog/getAll`,
                    method: "GET",
                    params,
                };
            },
            providesTags: [type],
        }),
        getArticleById: builder.query({
            query: (blogId) => {
                return {
                    url: `/blog/getById`,
                    method: "GET",
                    params: { blogId },
                };
            },
            providesTags: (result, error, blogId) => [{ type, id: blogId }],
        }),
        createArticle: builder.mutation({
            query: (body) => {
                return {
                    url: `/blog/create`,
                    method: "POST",
                    body: prepareFormData({ ...body }),
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: (error) => (!error ? [type] : [type]),
        }),
        updateArticle: builder.mutation({
            query: (body) => {
                const formdata = new FormData();

                formdata.append(ARTICLE_CREATE_EDIT.ARTICLE_TITLE, body?.[ARTICLE_CREATE_EDIT.ARTICLE_TITLE] || "");
                formdata.append(ARTICLE_CREATE_EDIT.ARTICLE_SUBTITLE, body?.[ARTICLE_CREATE_EDIT.ARTICLE_SUBTITLE] || "");
                formdata.append(ARTICLE_CREATE_EDIT.ARTICLE_TYPE, body?.[ARTICLE_CREATE_EDIT.ARTICLE_TYPE] || "");
                formdata.append(ARTICLE_CREATE_EDIT.CATEGORY_ID, body?.[ARTICLE_CREATE_EDIT.CATEGORY_ID] || "");
                formdata.append(ARTICLE_CREATE_EDIT.SUBCATEGORY_ID, body?.[ARTICLE_CREATE_EDIT.SUBCATEGORY_ID] || "");
                formdata.append(ARTICLE_CREATE_EDIT.ARTICLE_CONTENT, body?.[ARTICLE_CREATE_EDIT.ARTICLE_CONTENT] || "");
                formdata.append(ARTICLE_CREATE_EDIT.SEO_TITLE, body?.[ARTICLE_CREATE_EDIT.SEO_TITLE] || "");
                formdata.append(ARTICLE_CREATE_EDIT.CONTENTS, body?.[ARTICLE_CREATE_EDIT.META_DESCRIPTION] || "");
                formdata.append(ARTICLE_CREATE_EDIT.KEYWORDS, body?.[ARTICLE_CREATE_EDIT.KEYWORDS] || "");
                formdata.append(ARTICLE_CREATE_EDIT.URL, body?.[ARTICLE_CREATE_EDIT.URL] || "");
                formdata.append(ARTICLE_CREATE_EDIT.PUBLISH_DATE, body?.[ARTICLE_CREATE_EDIT.PUBLISH_DATE] || "");
                formdata.append(ARTICLE_CREATE_EDIT.STATUS, body?.[ARTICLE_CREATE_EDIT.STATUS] || "");
                formdata.append("blogId", body?.blogId || "");

                const image = body?.[ARTICLE_CREATE_EDIT.BLOG_IMAGE];
                if (image && (image instanceof File || image instanceof Blob)) {
                    formdata.append(ARTICLE_CREATE_EDIT.BLOG_IMAGE, image, image.name || "image");
                } else if (image) {
                    console.warn("Image is not a valid File or Blob object:", image);
                }



                return {
                    url: `/blog/update`,
                    method: "PUT",
                    body: formdata,
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: (error) => (!error ? [type] : [type]),
        }),
        deleteArticle: builder.mutation({
            query: (blogId) => {
                return {
                    url: `/blog/deleteBlog`,
                    method: "DELETE",
                    params: { blogId },
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: (result, error, blogId) => [type, { type, id: blogId }],
        }),
        importArticlesCSV: builder.mutation({
            query: (formData) => {
                return {
                    url: `/blog/importCsv`,
                    method: "POST",
                    body: formData,
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: [type],
        }),
        // Page Blog Article endpoints
        getPageBlogArticles: builder.query({
            query: (pageTitle) => {
                return {
                    url: `/pageBlogArticle/get`,
                    method: "GET",
                    params: { pageTitle },
                };
            },
            providesTags: ["pageBlogArticle"],
        }),
        addPageBlogArticle: builder.mutation({
            query: (data) => {
                return {
                    url: `/pageBlogArticle/add`,
                    method: "POST",
                    body: data,
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: ["pageBlogArticle"],
        }),
        deletePageBlogArticle: builder.mutation({
            query: (pageBlogArticleId) => {
                return {
                    url: `/pageBlogArticle/delete`,
                    method: "DELETE",
                    params: { pageBlogArticleId },
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: ["pageBlogArticle"],
        }),
        updatePageBlogArticleIndex: builder.mutation({
            query: (data) => {
                return {
                    url: `/pageBlogArticle/updateIndex`,
                    method: "PUT",
                    body: data,
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: ["pageBlogArticle"],
        }),
    }),
});

export const {
    useGetAllArticlesQuery,
    useGetAllArticlesPaginationWiseQuery,
    useGetArticleByIdQuery,
    useCreateArticleMutation,
    useUpdateArticleMutation,
    useDeleteArticleMutation,
    useImportArticlesCSVMutation,
    useGetPageBlogArticlesQuery,
    useAddPageBlogArticleMutation,
    useDeletePageBlogArticleMutation,
    useUpdatePageBlogArticleIndexMutation,
} = articlesApi;
