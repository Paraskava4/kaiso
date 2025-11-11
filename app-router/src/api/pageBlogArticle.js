import { createApi } from "@reduxjs/toolkit/query/react";
// import { baseQueryWithAuthInterceptor, PrepareHeaders } from "../utils";
import { BASE_URL } from "../../config";
import { baseQueryWithAuthInterceptor, PrepareHeaders } from "./utils";

const type = "pageBlogArticle";

export const pageBlogArticleApi = createApi({
    reducerPath: "pageBlogArticleApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            return PrepareHeaders(headers, { getState });
        },
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getPageBlogArticle: builder.query({
            query: (params) => {
                return {
                    url: `/pageBlogArticle/get`,
                    method: "GET",
                    params,
                };
            },
            providesTags: [type],
        }),
    }),
});

export const { useGetPageBlogArticleQuery } = pageBlogArticleApi;
