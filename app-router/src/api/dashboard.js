import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, PrepareHeaders } from "./utils";
import { BASE_URL } from "../../config";


const type = "dashboardApi";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            return PrepareHeaders(headers, { getState });
        },
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getDashboardData: builder.query({
            query: ({ search }) => {
                return {
                    url: `/home/dashboard`,
                    method: "GET",
                    params: { search },
                };
            },
            providesTags: [type],
        }),
    }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
