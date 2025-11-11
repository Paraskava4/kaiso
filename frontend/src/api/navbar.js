import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

const type = "NavbarAPI";

export const navbarApi = createApi({
    reducerPath: "NavbarAPI",
    baseQuery,
    tagTypes: [type],
    // Enhanced caching configuration
    keepUnusedDataFor: 600, // 10 minutes
    refetchOnMountOrArgChange: 600, // 10 minutes
    refetchOnFocus: false,
    refetchOnReconnect: true,
    endpoints: (builder) => ({
        getNavbarData: builder.query({
            query: () => {
                return {
                    url: `/web/getNavbar`,
                    method: "GET",
                };
            },
            providesTags: [type],
            // Enhanced caching for navbar data (used across all pages)
            keepUnusedDataFor: 1800, // 30 minutes
        }),
    }),
});

export const { useGetNavbarDataQuery } = navbarApi;
