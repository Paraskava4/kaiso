import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import axios from "axios";
import { BASE_URL } from "../../config";
import { getSessionStorage, setSessionStorage } from "@/utils/localStorage";

// import { isStatusInclude, isStatusIncludeError } from "../utils/axiosInstance";

const mutex = new Mutex();
const api = BASE_URL;
export const baseQueryWithAuthInterceptor = (args) => {
    // Wait until the mutex is available without locking it

    const baseQuery = fetchBaseQuery(args);
    return async (args, api, extraOptions) => {
        let result = await baseQuery(args, api, extraOptions);
        await mutex.waitForUnlock();
        let isDesktop;

        if (typeof window !== "undefined" && window.localStorage) {
            isDesktop = localStorage.getItem("isDesktop");
        }

        if (!isDesktop && result.error && (result.error.status === 401 || result.error.status === 419)) {
            // Check if the mutex is not locked
            if (!mutex.isLocked()) {
                const release = await mutex.acquire();
                try {
                    // Call the refreshToken function to refresh the token
                    await refreshToken();
                    result = await baseQuery(args, api, extraOptions);
                } finally {
                    // Release the mutex
                    release();
                }
            } else {
                // Wait until the mutex is available without locking it
                await mutex.waitForUnlock();
                result = await baseQuery(args, api, extraOptions);
            }
        }
        if (result.error && (result.error.status === "FETCH_ERROR" || [501, 502, 504, 503, 500].includes(result?.meta?.response?.status))) {
        }
        return result;
    };
};

const refreshToken = async () => {
    let refreshToken;

    if (typeof window !== "undefined" && window.localStorage) {
        refreshToken = localStorage.getItem("refreshToken");
    }

    if (!refreshToken) {
        return;
    }

    try {
        const payload = {
            refreshToken: refreshToken,
        };

        const response = await axios.post(`${api.baseURL}/token`, payload);

        if (isStatusInclude(response?.data?.status)) {
            setSessionStorage("adminToken", response?.data?.accessToken);
            if (window.api) {
                window.api.setData("accessToken", response?.data?.accessToken);
            }
        } else if (isStatusIncludeError(response?.data?.status)) {
            getSessionStorage("adminToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("session");
            window.location.reload();
        }
    } catch (error) {
        getSessionStorage("adminToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("session");
        window.location.reload();
    }
};

export const PrepareHeaders = async (headers, { getState }) => {
    const token = getSessionStorage("adminToken");
    if (token) {
        headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
};
