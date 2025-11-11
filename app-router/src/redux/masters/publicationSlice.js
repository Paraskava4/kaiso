import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLatestPublications,
    createLatestPublication as apiCreateLatestPublication,
    updateLatestPublication as apiUpdateLatestPublication,
    deleteLatestPublication as apiDeleteLatestPublication,
} from "../../api/masters/publication";

export const fetchLatestPublications = createAsyncThunk("publication/fetchLatestPublications", async (_, { rejectWithValue }) => {
    try {
        const response = await getLatestPublications();
        return response.data?.data || [];
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to fetch publications");
    }
});

export const createLatestPublication = createAsyncThunk("publication/createLatestPublication", async (formData, { rejectWithValue }) => {
    try {
        const response = await apiCreateLatestPublication(formData);
        return response.data?.data || response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to create publication");
    }
});

export const updateLatestPublication = createAsyncThunk("publication/updateLatestPublication", async (formData, { rejectWithValue }) => {
    try {
        const response = await apiUpdateLatestPublication(formData);
        return response.data?.data || response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to update publication");
    }
});

export const deleteLatestPublication = createAsyncThunk("publication/deleteLatestPublication", async (publicationId, { rejectWithValue }) => {
    try {
        const response = await apiDeleteLatestPublication(publicationId);
        // Return the deleted id so the caller can refresh if needed
        return response.data?.data || publicationId;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to delete publication");
    }
});

const initialState = {
    data: [],
    status: "idle",
    error: null,
};

const publicationSlice = createSlice({
    name: "publication",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLatestPublications.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchLatestPublications.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchLatestPublications.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(createLatestPublication.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createLatestPublication.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = [action.payload, ...state.data];
            })
            .addCase(createLatestPublication.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(updateLatestPublication.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateLatestPublication.fulfilled, (state, action) => {
                state.status = "succeeded";
                const updated = action.payload;
                state.data = state.data.map((item) => (item._id === updated._id || item.id === updated.id ? { ...item, ...updated } : item));
            })
            .addCase(updateLatestPublication.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Delete publication
            .addCase(deleteLatestPublication.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteLatestPublication.fulfilled, (state, action) => {
                state.status = "succeeded";
                const deletedId = action.payload?._id || action.payload?.id || action.payload;
                state.data = state.data.filter((item) => item._id !== deletedId && item.id !== deletedId);
            })
            .addCase(deleteLatestPublication.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default publicationSlice.reducer;
