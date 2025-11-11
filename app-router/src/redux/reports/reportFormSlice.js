import { createSlice } from "@reduxjs/toolkit";

const emptyObj = null;

const handlePayload = ({ payload: data }) => ({
    data,
});

const initialState = {
    reportForm: emptyObj,
};

export const reportFormSlice = createSlice({
    name: "reportForm",
    initialState,
    reducers: {
        createReportForm: (state, action) => {
            state.reportForm = handlePayload(action);
        },
        clearReportForm: (state) => {
            state.reportForm = emptyObj;
        },
    },
});

export const { createReportForm, clearReportForm } = reportFormSlice.actions;

export default reportFormSlice.reducer;
