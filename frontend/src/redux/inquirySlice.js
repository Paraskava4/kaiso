import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Use paginated inquiries API
import { getInquiries, likeUnlikeInquiry } from "../api/inquiry";

// Thunk to fetch inquiries with pagination and sorting
export const fetchInquiries = createAsyncThunk(
    "inquiry/fetchInquiries",
    async ({ page = 1, limit = 10, type = "", fieldName = "createdAt", sort = -1, search = "", date = "" }, { rejectWithValue }) => {
        try {
            // Forward pagination, sorting, and date filtering params to the API
            const res = await getInquiries(page, limit, type, fieldName, sort, search, date);
            return {
                list: res.data?.data || [],
                total: res.data?.totalRecordCount || res.data?.total || (res.data?.data ? res.data.data.length : 0),
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Unable to fetch inquiries");
        }
    }
);

// Thunk to toggle like/dislike status for an inquiry
export const toggleInquiryLike = createAsyncThunk("inquiry/toggleInquiryLike", async (inquiryId, { rejectWithValue }) => {
    try {
        const res = await likeUnlikeInquiry(inquiryId);
        return {
            inquiryId,
            message: res.data?.message || "Status updated successfully",
            isLiked: res.data?.message?.includes("liked") || false, // Determine if it was liked or disliked
        };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to update inquiry status");
    }
});

const initialState = {
    data: [],
    total: 0,
    status: "idle",
    error: null,
    likeStatus: "idle",
    likeError: null,
};

const inquirySlice = createSlice({
    name: "inquiry",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInquiries.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchInquiries.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload.list;
                state.total = action.payload.total;
            })
            .addCase(fetchInquiries.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(toggleInquiryLike.pending, (state) => {
                state.likeStatus = "loading";
                state.likeError = null;
            })
            .addCase(toggleInquiryLike.fulfilled, (state, action) => {
                state.likeStatus = "succeeded";
                // Update the specific inquiry's like status in the data array
                const { inquiryId, isLiked } = action.payload;
                state.data = state.data.map((inquiry) => (inquiry.inquiryNo === inquiryId || inquiry._id === inquiryId ? { ...inquiry, isLiked } : inquiry));
            })
            .addCase(toggleInquiryLike.rejected, (state, action) => {
                state.likeStatus = "failed";
                state.likeError = action.payload;
            });
    },
});

export default inquirySlice.reducer;
