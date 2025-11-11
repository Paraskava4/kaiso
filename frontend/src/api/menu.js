import { createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config";
import { baseQueryWithAuthInterceptor, PrepareHeaders } from "./utils";

const type = "Menu";

export const menuApi = createApi({
    reducerPath: "menuApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            return PrepareHeaders(headers, { getState });
        },
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getAllMenu: builder.query({
            query: () => {
                return {
                    url: `/menu/getAll`,
                };
            },
            providesTags: [type],
        }),
        getMenuAccess: builder.query({
            query: (params) => {
                return {
                    url: `/menu/getAccessByUserId`,
                    params,
                };
            },
            providesTags: [type],
        }),
    }),
});

export const { useGetAllMenuQuery, useGetMenuAccessQuery } = menuApi;
