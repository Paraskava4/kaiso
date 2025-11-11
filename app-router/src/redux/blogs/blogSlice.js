import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllBlogs,
  getAllArticles,
  getArticleById,
  createArticle as apiCreateArticle,
  updateArticle as apiUpdateArticle,
  deleteArticle as apiDeleteArticle,
  importArticlesCSV as apiImportArticlesCSV,
} from '../../api/blogs/blog';

// Async thunk to fetch all blogs (backward compatibility)
export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllBlogs();
      // assuming API returns { data: { data: [...] }} similar to other endpoints
      return response.data?.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Unable to fetch blogs'
      );
    }
  }
);

// Async thunk to fetch all articles with pagination
export const fetchAllArticles = createAsyncThunk(
  'blog/fetchAllArticles',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await getAllArticles(page, limit);
      return {
        list: response.data?.data || [],
        total: response.data?.totalRecordCount || response.data?.total || (response.data?.data ? response.data.data.length : 0),
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Unable to fetch articles'
      );
    }
  }
);

// Async thunk to fetch article by ID
export const fetchArticleById = createAsyncThunk(
  'blog/fetchArticleById',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await getArticleById(blogId);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Unable to fetch article'
      );
    }
  }
);

// Async thunk to create article
export const createArticle = createAsyncThunk(
  'blog/createArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      const response = await apiCreateArticle(articleData);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Unable to create article'
      );
    }
  }
);

// Async thunk to update article
export const updateArticle = createAsyncThunk(
  'blog/updateArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      const response = await apiUpdateArticle(articleData);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Unable to update article'
      );
    }
  }
);

// Async thunk to delete article
export const deleteArticle = createAsyncThunk(
  'blog/deleteArticle',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await apiDeleteArticle(blogId);
      return { blogId, response: response.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Unable to delete article'
      );
    }
  }
);

// Async thunk to import CSV
export const importArticlesCSV = createAsyncThunk(
  'blog/importArticlesCSV',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiImportArticlesCSV(formData);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Unable to import CSV'
      );
    }
  }
);

const initialState = {
  data: [],
  total: 0,
  currentArticle: null,
  status: 'idle',
  error: null,
  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
  importStatus: 'idle',
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetStatuses: (state) => {
      state.createStatus = 'idle';
      state.updateStatus = 'idle';
      state.deleteStatus = 'idle';
      state.importStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all blogs (backward compatibility)
      .addCase(fetchBlogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch all articles with pagination
      .addCase(fetchAllArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.list;
        state.total = action.payload.total;
      })
      .addCase(fetchAllArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch article by ID
      .addCase(fetchArticleById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentArticle = {
          ...action.payload,
          id: action.payload._id,
        };
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create article
      .addCase(createArticle.pending, (state) => {
        state.createStatus = 'loading';
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        const newArticle = {
          ...action.payload,
          id: action.payload._id,
        };
        state.data = [newArticle, ...state.data];
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
      })
      // Update article
      .addCase(updateArticle.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const updatedArticle = {
          ...action.payload,
          id: action.payload._id,
        };
        const index = state.data.findIndex(item => item.id === updatedArticle.id);
        if (index !== -1) {
          state.data[index] = updatedArticle;
        }
        if (state.currentArticle && state.currentArticle.id === updatedArticle.id) {
          state.currentArticle = updatedArticle;
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload;
      })
      // Delete article
      .addCase(deleteArticle.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        const { blogId } = action.payload;
        state.data = state.data.filter(item => item._id !== blogId && item.id !== blogId);
        if (state.currentArticle && (state.currentArticle._id === blogId || state.currentArticle.id === blogId)) {
          state.currentArticle = null;
        }
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload;
      })
      // Import CSV
      .addCase(importArticlesCSV.pending, (state) => {
        state.importStatus = 'loading';
      })
      .addCase(importArticlesCSV.fulfilled, (state, action) => {
        state.importStatus = 'succeeded';
        // Refresh data after import - you might want to trigger fetchAllArticles instead
        if (Array.isArray(action.payload)) {
          const importedArticles = action.payload.map((item) => ({
            ...item,
            id: item._id,
          }));
          state.data = [...importedArticles, ...state.data];
        }
      })
      .addCase(importArticlesCSV.rejected, (state, action) => {
        state.importStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCurrentArticle, clearError, resetStatuses } = blogSlice.actions;

export default blogSlice.reducer;
