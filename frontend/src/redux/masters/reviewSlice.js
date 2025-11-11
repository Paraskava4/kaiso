import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getReviews, createReview, updateReview, deleteReview } from "../../api/masters/review";

// Thunk to fetch reviews with search support
export const fetchReviews = createAsyncThunk("review/fetchReviews", async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
        const response = await getReviews(page, limit, search);
        const items = response.data?.data || [];
        const total = response.data?.totalRecordCount || items.length;
        // Map _id to id for MUI lists / keys
        return { list: items.map((item) => ({ ...item, id: item._id })), total };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to fetch reviews");
    }
});

// .
export const addReview = createAsyncThunk("review/addReview", async (formData, { rejectWithValue }) => {
    try {
        const res = await createReview(formData);
        const item = res.data?.data;
        return { ...item, id: item._id };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Failed to add review");
    }
});

// Update review
export const editReview = createAsyncThunk("review/editReview", async (formData, { rejectWithValue }) => {
    try {
        const res = await updateReview(formData);
        const item = res.data?.data;
        return { ...item, id: item._id };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Failed to update review");
    }
});

// Delete review
export const removeReview = createAsyncThunk("review/removeReview", async (id, { rejectWithValue }) => {
    try {
        await deleteReview(id);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Failed to delete review");
    }
});

const initialState = {
    data: [],
    total: 0,
    status: "idle",
    error: null,
};

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload.list;
                state.total = action.payload.total;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.data.unshift(action.payload);
            })
            .addCase(editReview.fulfilled, (state, action) => {
                state.data = state.data.map((r) => (r.id === action.payload.id ? action.payload : r));
            })
            .addCase(removeReview.fulfilled, (state, action) => {
                state.data = state.data.filter((r) => r.id !== action.payload);
            });
    },
});

export default reviewSlice.reducer;
