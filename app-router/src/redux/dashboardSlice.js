import { createSlice } from "@reduxjs/toolkit";
import { dashboardApi } from "../api/dashboard";

const initialState = {
    data: {
        report: {},
        inquiry: {},
    },
    status: "idle",
    error: null,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(dashboardApi.endpoints.getDashboardData.matchPending, (state) => {
                state.status = "loading";
            })
            .addMatcher(dashboardApi.endpoints.getDashboardData.matchFulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload.data;
            })
            .addMatcher(dashboardApi.endpoints.getDashboardData.matchRejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default dashboardSlice.reducer;
