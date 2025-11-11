import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllAdmins, changeAdminStatus, createAdmin, getAdminById, updateAdmin, deleteAdmin } from '../api/admin';

// Thunk to fetch all admins
export const fetchAllAdmins = createAsyncThunk(
  'admin/fetchAllAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllAdmins();
      return {
        list: response.data?.data || [],
        total: response.data?.totalRecordCount || response.data?.total || (response.data?.data ? response.data.data.length : 0),
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Unable to fetch admins'
      );
    }
  }
);

// Thunk to change admin status
export const updateAdminStatus = createAsyncThunk(
  'admin/updateAdminStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await changeAdminStatus(userId);
      return {
        userId,
        data: response.data
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Unable to update admin status'
      );
    }
  }
);

// Thunk to create new admin
export const createAdminThunk = createAsyncThunk(
  'admin/createAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await createAdmin(adminData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Unable to create admin'
      );
    }
  }
);

// Thunk to get admin by ID
export const fetchAdminById = createAsyncThunk(
  'admin/fetchAdminById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getAdminById(userId);
      return response.data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Unable to fetch admin'
      );
    }
  }
);

// Thunk to update admin
export const updateAdminThunk = createAsyncThunk(
  'admin/updateAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await updateAdmin(adminData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Unable to update admin'
      );
    }
  }
);

// Thunk to delete admin
export const deleteAdminThunk = createAsyncThunk(
  'admin/deleteAdmin',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await deleteAdmin(userId);
      return { userId, data: response.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Unable to delete admin'
      );
    }
  }
);

const initialState = {
  data: [],
  total: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  statusUpdateLoading: false,
  createLoading: false,
  selectedAdmin: null,
  fetchAdminLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Reset state
    resetAdminState: (state) => {
      return initialState;
    },
    // Clear selected admin
    clearSelectedAdmin: (state) => {
      state.selectedAdmin = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all admins
      .addCase(fetchAllAdmins.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllAdmins.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.list;
        state.total = action.payload.total;
      })
      .addCase(fetchAllAdmins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update admin status
      .addCase(updateAdminStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateAdminStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        // Update the specific admin's status in the data array
        const { userId } = action.payload;
        const adminIndex = state.data.findIndex(admin => admin._id === userId || admin.id === userId);
        if (adminIndex !== -1) {
          // Toggle the status (assuming it's a boolean field)
          state.data[adminIndex].isActive = !state.data[adminIndex].isActive;
        }
      })
      .addCase(updateAdminStatus.rejected, (state, action) => {
        state.statusUpdateLoading = false;
        state.error = action.payload;
      })
      // Create admin
      .addCase(createAdminThunk.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createAdminThunk.fulfilled, (state, action) => {
        state.createLoading = false;
        // Optionally add the new admin to the data array
        if (action.payload?.data) {
          state.data.push(action.payload.data);
          state.total += 1;
        }
      })
      .addCase(createAdminThunk.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      // Fetch admin by ID
      .addCase(fetchAdminById.pending, (state) => {
        state.fetchAdminLoading = true;
        state.error = null;
        state.selectedAdmin = null;
      })
      .addCase(fetchAdminById.fulfilled, (state, action) => {
        state.fetchAdminLoading = false;
        state.selectedAdmin = action.payload;
      })
      .addCase(fetchAdminById.rejected, (state, action) => {
        state.fetchAdminLoading = false;
        state.error = action.payload;
        state.selectedAdmin = null;
      })
      // Update admin
      .addCase(updateAdminThunk.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateAdminThunk.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Update the admin in the data array
        if (action.payload?.data) {
          const adminIndex = state.data.findIndex(admin => admin._id === action.payload.data._id);
          if (adminIndex !== -1) {
            state.data[adminIndex] = action.payload.data;
          }
          state.selectedAdmin = action.payload.data;
        }
      })
      .addCase(updateAdminThunk.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Delete admin
      .addCase(deleteAdminThunk.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteAdminThunk.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Remove the admin from the data array
        const { userId } = action.payload;
        state.data = state.data.filter(admin => admin._id !== userId);
        state.total = Math.max(0, state.total - 1);
        if (state.selectedAdmin?._id === userId) {
          state.selectedAdmin = null;
        }
      })
      .addCase(deleteAdminThunk.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetAdminState, clearSelectedAdmin } = adminSlice.actions;

export default adminSlice.reducer;
