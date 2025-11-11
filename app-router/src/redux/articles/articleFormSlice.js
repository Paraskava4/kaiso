import { createSlice } from "@reduxjs/toolkit";

const emptyObj = null;

const handlePayload = ({ payload: data }) => ({
    data,
});

const initialState = {
    articleForm: emptyObj,
};

export const articleFormSlice = createSlice({
    name: "articleForm",
    initialState,
    reducers: {
        createArticleForm: (state, action) => {
            state.articleForm = handlePayload(action);
        },
        clearArticleForm: (state) => {
            state.articleForm = emptyObj;
        },
    },
});

export const { createArticleForm, clearArticleForm } = articleFormSlice.actions;

export default articleFormSlice.reducer;
