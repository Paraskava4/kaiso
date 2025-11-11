"use client";
import React from "react";
import { useSelector } from "react-redux";
import { actions } from "../../../../redux/store";
import { Box, Dialog, Slide } from "@mui/material";
import PermanentDrawerLeft from "../../PermanentDrawerLeft";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
});
const CreateReport = () => {
    const { open, data } = useSelector((state) => state?.modal?.createReport);
    const handleClose = () => actions.modal.closeCreateReport();

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            slots={{
                transition: Transition,
            }}
        >
            <Box>
                <PermanentDrawerLeft modalData={data} />
            </Box>
        </Dialog>
    );
};

export default CreateReport;
