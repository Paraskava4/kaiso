// store/metaSlice.js
import { createSlice } from "@reduxjs/toolkit";

const metaSlice = createSlice({
    name: "meta",
    initialState: {
        author: null, // null = fallback to default
    },
    reducers: {
        setAuthor: (state, action) => {
            state.author = action.payload;
        },
        resetAuthor: (state) => {
            state.author = null;
        },
    },
});

export const { setAuthor, resetAuthor } = metaSlice.actions;
export default metaSlice.reducer;
export { metaSlice };
