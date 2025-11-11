import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getPopularInsights,
    createPopularInsight as apiCreatePopularInsight,
    updatePopularInsight as apiUpdatePopularInsight,
    deletePopularInsight as apiDeletePopularInsight,
    getInsightById,
} from "../../api/masters/insight";

// Fetch all insights
export const fetchPopularInsights = createAsyncThunk("insight/fetchPopularInsights", async (_, { rejectWithValue }) => {
    try {
        const response = await getPopularInsights();
        return response.data?.data || [];
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to fetch insights");
    }
});

// Create new insight
// Fetch single insight by id
export const fetchInsightById = createAsyncThunk("insight/fetchInsightById", async (insightId, { rejectWithValue }) => {
    try {
        const response = await getInsightById(insightId);
        return response.data?.data || response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const createPopularInsight = createAsyncThunk("insight/createPopularInsight", async (formData, { rejectWithValue }) => {
    try {
        const response = await apiCreatePopularInsight(formData);
        return response.data?.data || response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to create insight");
    }
});

// Update insight
export const updatePopularInsight = createAsyncThunk("insight/updatePopularInsight", async (formData, { rejectWithValue }) => {
    try {
        const response = await apiUpdatePopularInsight(formData);
        return response.data?.data || response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to update insight");
    }
});

// Delete insight
export const deletePopularInsight = createAsyncThunk("insight/deletePopularInsight", async (insightId, { rejectWithValue }) => {
    try {
        const response = await apiDeletePopularInsight(insightId);
        return response.data?.data || insightId;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to delete insight");
    }
});

const initialState = {
    data: [],
    status: "idle",
    error: null,
};

const insightSlice = createSlice({
    name: "insight",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPopularInsights.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPopularInsights.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchPopularInsights.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Create
            .addCase(createPopularInsight.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createPopularInsight.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = [action.payload, ...state.data];
            })
            .addCase(createPopularInsight.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Update
            .addCase(updatePopularInsight.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updatePopularInsight.fulfilled, (state, action) => {
                state.status = "succeeded";
                const updated = action.payload;
                state.data = state.data.map((i) => (i._id === updated._id || i.id === updated.id ? { ...i, ...updated } : i));
            })
            .addCase(updatePopularInsight.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Delete
            .addCase(deletePopularInsight.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deletePopularInsight.fulfilled, (state, action) => {
                state.status = "succeeded";
                const deletedId = action.payload?._id || action.payload?.id || action.payload;
                state.data = state.data.filter((i) => i._id !== deletedId && i.id !== deletedId);
            })
            .addCase(deletePopularInsight.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default insightSlice.reducer;
