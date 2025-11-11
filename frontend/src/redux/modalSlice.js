import { createSlice } from "@reduxjs/toolkit";

const open = true;

const emptyObj = {
    open: false,
    data: null,
};

const handlePayload = ({ payload: data }) => ({
    open,
    data,
});

const initialState = {
    createReport: emptyObj,
    importReport: emptyObj,
    createArticle: emptyObj,
    importArticle: emptyObj,
};

export const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openCreateReport: (state, action) => {
            state.createReport = handlePayload(action);
        },
        closeCreateReport: (state) => {
            state.createReport = emptyObj;
        },
        openImportReport: (state, action) => {
            state.importReport = handlePayload(action);
        },
        closeImportReport: (state) => {
            state.importReport = emptyObj;
        },
        openCreateArticle: (state, action) => {
            state.createArticle = handlePayload(action);
        },
        closeCreateArticle: (state) => {
            state.createArticle = emptyObj;
        },
        openImportArticle: (state, action) => {
            state.importArticle = handlePayload(action);
        },
        closeImportArticle: (state) => {
            state.importArticle = emptyObj;
        },
    },
});

export const {
    openCreateReport,
    closeCreateReport,
    openImportReport,
    closeImportReport,
    openCreateArticle,
    closeCreateArticle,
    openImportArticle,
    closeImportArticle
} = modalSlice.actions;

export default modalSlice.reducer;
