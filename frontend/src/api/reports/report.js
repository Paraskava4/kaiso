import axiosInstance from "../../utils/axiosInstance";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, PrepareHeaders } from "../utils";
import isSuccess from "@/utils/validation/response";
import { prepareFormData } from "@/utils/constants/api/formData";
import { BASE_URL } from "../../../config";

// Fetch all reports
export const getAllReports = async () =>
    await axiosInstance
        .get("/report/getAllReport")
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return { error: true, message: error?.response?.data?.message || error.message || "API error", status: error?.response?.status || 500 };
        });

const type = "report";

export const reportApi = createApi({
    reducerPath: "reportApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            return PrepareHeaders(headers, { getState });
        },
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getAllReport: builder.query({
            query: () => {
                return {
                    url: `/report/getAllReport`,
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        getAllReportPaginationWise: builder.query({
            query: (params) => {
                return {
                    url: `/report/getAll`,
                    method: "GET",
                    params,
                };
            },
            providesTags: [type],
        }),
        createReportReq: builder.mutation({
            query: (body) => {
                return {
                    url: `/report/create`,
                    method: "POST",
                    body,
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: (error) => (!error ? [type] : [type]),
        }),
        updateReportReq: builder.mutation({
            query: (body) => {
                return {
                    url: `/report/update`,
                    method: "PUT",
                    body,
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: (error) => (!error ? [type] : [type]),
        }),
        createReportFormCSVReq: builder.mutation({
            query: (body) => {
                return {
                    url: `/report/importCsv`,
                    method: "POST",
                    body: prepareFormData(body),
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: (error) => (!error ? [type] : [type]),
        }),
        getButtonReport: builder.query({
            query: (body) => {
                return {
                    url: `/report/getButton`,
                };
            },
            providesTags: [type],
        }),
        getButtonWithoutAuth: builder.query({
            query: () => {
                return {
                    url: `/report/getButtonWithoutAuth`,
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        updateButtonReport: builder.mutation({
            query: (body) => {
                return {
                    url: `/report/updateButton`,
                    method: "PUT",
                    body: prepareFormData(body),
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: (error) => (!error ? [type] : [type]),
        }),
        deleteReport: builder.mutation({
            query: (params) => {
                return {
                    url: `/report/deleteReport`,
                    method: "DELETE",
                    params,
                };
            },
            transformErrorResponse: (response) => isSuccess(response),
            transformResponse: (response) => isSuccess(response),
            invalidatesTags: (error) => (!error ? [type] : [type]),
        }),
    }),
});

export const {
    useGetAllReportQuery,
    useGetAllReportPaginationWiseQuery,
    useCreateReportReqMutation,
    useCreateReportFormCSVReqMutation,
    useUpdateReportReqMutation,
    useGetButtonReportQuery,
    useGetButtonWithoutAuthQuery,
    useUpdateButtonReportMutation,
    useDeleteReportMutation,
} = reportApi;
