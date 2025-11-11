import { createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config";
import { baseQueryWithAuthInterceptor, PrepareHeaders } from "./utils";

const type = "Notification";

export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            return PrepareHeaders(headers, { getState });
        },
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getUnreadNotifications: builder.query({
            query: () => {
                return {
                    url: `/notification/unRead`,
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        getAllNotifications: builder.query({
            query: () => {
                return {
                    url: `/notification/getAll`,
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        markAllAsRead: builder.mutation({
            query: () => {
                return {
                    url: `/notification/markAllAsRead`,
                    method: "POST",
                };
            },
            invalidatesTags: [type],
        }),
    }),
});

export const { 
    useGetUnreadNotificationsQuery,
    useGetAllNotificationsQuery,
    useMarkAllAsReadMutation,
    useLazyGetAllNotificationsQuery,
    useLazyGetUnreadNotificationsQuery
} = notificationApi;
