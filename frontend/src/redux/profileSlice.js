import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserProfile, updateUserProfile, updateUserProfileWithImage } from '../api/auth/profile';
import { getCurrentUserId } from '../utils/axiosInstance';

// Thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId = null, { rejectWithValue }) => {
    try {
      const targetUserId = userId || getCurrentUserId();
      if (!targetUserId) {
        return rejectWithValue('User ID not found');
      }
      const response = await getUserProfile(targetUserId);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.message || 'Unable to fetch profile'
      );
    }
  }
);

// Thunk to update user profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        return rejectWithValue('User ID not found');
      }
      const response = await updateUserProfile(profileData, userId);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.message || 'Unable to update profile'
      );
    }
  }
);

// Thunk to update user profile with image
export const updateProfileWithImage = createAsyncThunk(
  'profile/updateProfileWithImage',
  async (formData, { rejectWithValue }) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        return rejectWithValue('User ID not found');
      }
      const response = await updateUserProfileWithImage(formData, userId);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.message || 'Unable to update profile image'
      );
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  updateLoading: false,
  error: null,
  updateError: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    resetProfile: (state) => {
      state.data = null;
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.data = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      // Update profile with image
      .addCase(updateProfileWithImage.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateProfileWithImage.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.data = action.payload;
      })
      .addCase(updateProfileWithImage.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

export const { clearProfileError, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
