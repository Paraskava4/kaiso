import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLandingPageReviews, selectDeselectReview } from "../../api/masters/webReview";

// Thunk to fetch landing page reviews
export const fetchLandingPageReviews = createAsyncThunk(
    "webReview/fetchLandingPageReviews",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getLandingPageReviews();
            if (response.error) {
                return rejectWithValue(response.message);
            }
            const items = response.data?.data || [];
            // Map _id to id for consistency
            return items.map((item) => ({ ...item, id: item._id }));
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Unable to fetch landing page reviews");
        }
    }
);

// Thunk to select/deselect a review
export const toggleReviewSelection = createAsyncThunk(
    "webReview/toggleReviewSelection",
    async (reviewId, { rejectWithValue }) => {
        try {
            const response = await selectDeselectReview(reviewId);
            if (response.error) {
                return rejectWithValue(response.message);
            }
            return { reviewId, data: response.data };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Failed to toggle review selection");
        }
    }
);

const initialState = {
    data: [],
    status: "idle",
    error: null,
    toggleStatus: "idle",
    toggleError: null,
};

const webReviewSlice = createSlice({
    name: "webReview",
    initialState,
    reducers: {
        clearToggleStatus: (state) => {
            state.toggleStatus = "idle";
            state.toggleError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch landing page reviews
            .addCase(fetchLandingPageReviews.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchLandingPageReviews.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchLandingPageReviews.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Toggle review selection
            .addCase(toggleReviewSelection.pending, (state) => {
                state.toggleStatus = "loading";
                state.toggleError = null;
            })
            .addCase(toggleReviewSelection.fulfilled, (state, action) => {
                state.toggleStatus = "succeeded";
                state.toggleError = null;
                // Refresh the data after successful toggle
                // The actual state change will be handled by refetching
            })
            .addCase(toggleReviewSelection.rejected, (state, action) => {
                state.toggleStatus = "failed";
                state.toggleError = action.payload;
            });
    },
});

export const { clearToggleStatus } = webReviewSlice.actions;
export default webReviewSlice.reducer;
