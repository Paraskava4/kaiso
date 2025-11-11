import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllReports } from "../../api/reports/report";

// Thunk to fetch all reports
export const fetchAllReports = createAsyncThunk("report/fetchAllReports", async (_, { rejectWithValue }) => {
    try {
        const response = await getAllReports();
        return response.data?.data || response.data || [];
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to fetch reports");
    }
});

const initialState = {
    data: [],
    status: "idle",
    error: null,
};

const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllReports.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllReports.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload.map((item) => ({
                    ...item,
                    id: item._id,
                }));
            })
            .addCase(fetchAllReports.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default reportSlice.reducer;
