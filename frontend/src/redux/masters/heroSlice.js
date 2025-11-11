import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHeroSections, addHeroSection, deleteHeroSection, getHeroSectionById, updateHeroSection } from "../../api/masters/hero";

// Thunk to fetch hero sections from backend
export const fetchHeroSections = createAsyncThunk("hero/fetchHeroSections", async (_, { rejectWithValue }) => {
    try {
        const response = await getHeroSections();
        if (!response.success || response.error) {
            return rejectWithValue(response.message || "Unable to fetch hero sections");
        }
        // Transform _id to id for consistency
        const data = response.data?.data?.data || [];
        return data.map(item => ({ ...item, id: item._id }));
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to fetch hero sections");
    }
});

// Thunk to delete hero section
export const removeHeroSection = createAsyncThunk("hero/deleteHeroSection", async (heroSectionId, { rejectWithValue }) => {
    try {
        const response = await deleteHeroSection(heroSectionId);
        if (!response.success || response.error) {
            return rejectWithValue(response.message || "Unable to delete hero section");
        }
        return heroSectionId; // return id to remove locally
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to delete hero section");
    }
});

// Thunk to get hero section by id
export const fetchHeroSectionById = createAsyncThunk("hero/fetchHeroSectionById", async (heroSectionId, { rejectWithValue }) => {
    try {
        const response = await getHeroSectionById(heroSectionId);
        if (!response.success || response.error) {
            return rejectWithValue(response.message || "Unable to fetch hero section");
        }
        return response.data?.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to fetch hero section");
    }
});

// Thunk to update hero section
export const editHeroSection = createAsyncThunk("hero/editHeroSection", async ({ heroSectionId, formData }, { rejectWithValue }) => {
    try {
        const response = await updateHeroSection(formData);
        if (!response.success || response.error) {
            return rejectWithValue(response.message || "Unable to update hero section");
        }
        // Return the updated data from response
        const updatedData = response.data?.data?.data || response.data?.data;
        return { heroSectionId, updatedData: { ...updatedData, id: updatedData._id || heroSectionId } };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to update hero section");
    }
});

// Thunk to create hero section
export const createHeroSection = createAsyncThunk("hero/createHeroSection", async (formData, { rejectWithValue }) => {
    try {
        const response = await addHeroSection(formData);
        if (!response.success || response.error) {
            return rejectWithValue(response.message || "Unable to create hero section");
        }
        // Transform _id to id for consistency
        const data = response.data?.data?.data || response.data?.data;
        return { ...data, id: data._id };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || "Unable to create hero section");
    }
});

const initialState = {
    current: null,
    data: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const heroSlice = createSlice({
    name: "hero",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroSections.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchHeroSections.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload.map((item) => ({
                    ...item,
                    id: item._id,
                }));
            })
            .addCase(fetchHeroSections.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // createHeroSection cases
            .addCase(createHeroSection.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createHeroSection.fulfilled, (state, action) => {
                state.status = "succeeded";
                if (action.payload) {
                    state.data.push({ ...action.payload, id: action.payload._id });
                }
            })
            .addCase(createHeroSection.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // fetchHeroSectionById cases
            .addCase(fetchHeroSectionById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchHeroSectionById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.current = action.payload ? { ...action.payload, id: action.payload._id } : null;
            })
            .addCase(fetchHeroSectionById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // editHeroSection cases
            .addCase(editHeroSection.pending, (state) => {
                state.status = "loading";
            })
            .addCase(editHeroSection.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Update the specific item in the data array
                const { heroSectionId, updatedData } = action.payload;
                const index = state.data.findIndex(item => item.id === heroSectionId || item._id === heroSectionId);
                if (index !== -1) {
                    state.data[index] = updatedData;
                }
                // Also update current if it matches
                if (state.current && (state.current.id === heroSectionId || state.current._id === heroSectionId)) {
                    state.current = updatedData;
                }
            })
            .addCase(editHeroSection.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // removeHeroSection cases
            .addCase(removeHeroSection.pending, (state) => {
                state.status = "loading";
            })
            .addCase(removeHeroSection.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = state.data.filter((item) => item.id !== action.payload);
            })
            .addCase(removeHeroSection.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const {} = heroSlice.actions;
export default heroSlice.reducer;
