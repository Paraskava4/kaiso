import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getNewsArticles,
    updateNewsArticleOrder,
    createNewsArticle as apiCreateNewsArticle,
    updateNewsArticle as apiUpdateNewsArticle,
    deleteNewsArticle as apiDeleteNewsArticle,
    getNewsArticleById,
} from "../../api/masters/newsArticle";

// Thunk to fetch news articles
export const fetchNewsArticles = createAsyncThunk("newsArticle/fetchNewsArticles", async (_, { rejectWithValue }) => {
    try {
        const response = await getNewsArticles();
        const items = response.data?.data || [];
        // Flatten & map: move type from blogId.type, set id from _id
        return items.map((item) => ({
            ...item,
            id: item._id,
            type: item.blogId?.type || "",
        }));
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to fetch news articles");
    }
});

// Fetch single by id
export const fetchNewsArticleById = createAsyncThunk("newsArticle/fetchNewsArticleById", async (id, { rejectWithValue }) => {
    try {
        const res = await getNewsArticleById(id);
        return res.data?.data || res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Create
export const createNewsArticle = createAsyncThunk("newsArticle/createNewsArticle", async (data, { rejectWithValue }) => {
    try {
        const res = await apiCreateNewsArticle(data);
        return res.data?.data || res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Update
export const updateNewsArticleThunk = createAsyncThunk("newsArticle/updateNewsArticle", async (data, { rejectWithValue }) => {
    try {
        const res = await apiUpdateNewsArticle(data);
        return res.data?.data || res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Delete
export const deleteNewsArticleThunk = createAsyncThunk("newsArticle/deleteNewsArticle", async (id, { rejectWithValue }) => {
    try {
        await apiDeleteNewsArticle(id);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Thunk to update order
export const saveNewsArticleOrder = createAsyncThunk("newsArticle/saveNewsArticleOrder", async (idsArray, { rejectWithValue }) => {
    try {
        const response = await updateNewsArticleOrder({ newsArticleIds: idsArray });
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to update news article order");
    }
});

const initialState = {
    data: [],
    status: "idle",
    error: null,
};

const newsArticleSlice = createSlice({
    name: "newsArticle",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNewsArticles.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchNewsArticles.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchNewsArticles.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(saveNewsArticleOrder.fulfilled, (state) => {})
            // Create
            .addCase(createNewsArticle.pending, (s) => {
                s.status = "loading";
            })
            .addCase(createNewsArticle.fulfilled, (s, action) => {
                s.status = "succeeded";
                s.data = [action.payload, ...s.data];
            })
            .addCase(createNewsArticle.rejected, (s, a) => {
                s.status = "failed";
                s.error = a.payload;
            })
            // Update
            .addCase(updateNewsArticleThunk.pending, (s) => {
                s.status = "loading";
            })
            .addCase(updateNewsArticleThunk.fulfilled, (s, a) => {
                s.status = "succeeded";
                const updated = a.payload;
                s.data = s.data.map((i) => (i._id === updated._id || i.id === updated.id ? { ...i, ...updated } : i));
            })
            .addCase(updateNewsArticleThunk.rejected, (s, a) => {
                s.status = "failed";
                s.error = a.payload;
            })
            // Delete
            .addCase(deleteNewsArticleThunk.pending, (s) => {
                s.status = "loading";
            })
            .addCase(deleteNewsArticleThunk.fulfilled, (s, a) => {
                s.status = "succeeded";
                const delId = a.payload;
                s.data = s.data.filter((i) => i._id !== delId && i.id !== delId);
            })
            .addCase(deleteNewsArticleThunk.rejected, (s, a) => {
                s.status = "failed";
                s.error = a.payload;
            });
    },
});

export default newsArticleSlice.reducer;
