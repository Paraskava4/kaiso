import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Use career inquiries API
import { getCareerInquiries, likeUnlikeCareerInquiry } from "../api/career";

// Thunk to fetch career inquiries with pagination and sorting
export const fetchCareerInquiries = createAsyncThunk(
    "career/fetchCareerInquiries",
    async ({ page = 1, limit = 10, fieldName = "createdAt", sort = -1, search = "", date = "" }, { rejectWithValue }) => {
        try {
            // Forward pagination, sorting, and date filtering params to the API
            const res = await getCareerInquiries(page, limit, fieldName, sort, search, date);
            return {
                list: res.data?.data || [],
                total: res.data?.totalRecordCount || res.data?.total || (res.data?.data ? res.data.data.length : 0),
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Unable to fetch career inquiries");
        }
    }
);

// Thunk to toggle like/dislike status for a career inquiry
export const toggleCareerInquiryLike = createAsyncThunk("career/toggleCareerInquiryLike", async (careerId, { rejectWithValue }) => {
    try {
        const res = await likeUnlikeCareerInquiry(careerId);
        return {
            careerId,
            message: res.data?.message || "Status updated successfully",
            isLiked: res.data?.message?.includes("liked") || false, // Determine if it was liked or disliked
        };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to update career inquiry status");
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

const careerSlice = createSlice({
    name: "career",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCareerInquiries.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCareerInquiries.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload.list;
                state.total = action.payload.total;
            })
            .addCase(fetchCareerInquiries.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(toggleCareerInquiryLike.pending, (state) => {
                state.likeStatus = "loading";
                state.likeError = null;
            })
            .addCase(toggleCareerInquiryLike.fulfilled, (state, action) => {
                state.likeStatus = "succeeded";
                // Update the specific career inquiry's like status in the data array
                const { careerId, isLiked } = action.payload;
                state.data = state.data.map((career) => (career.inquiryNo === careerId || career._id === careerId ? { ...career, isLiked } : career));
            })
            .addCase(toggleCareerInquiryLike.rejected, (state, action) => {
                state.likeStatus = "failed";
                state.likeError = action.payload;
            });
    },
});

export default careerSlice.reducer;
