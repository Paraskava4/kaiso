import React from "react";
import { useSelector } from "react-redux";
import { actions } from "../../../../redux/store";
import { Box, Dialog, Slide } from "@mui/material";
import PermanentDrawerLeftArticle from "../../PermanentDrawerLeftArticle";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
});

const CreateArticle = () => {
    const { open, data } = useSelector((state) => state?.modal?.createArticle);
    const handleClose = () => actions.modal.closeCreateArticle();

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
                <PermanentDrawerLeftArticle modalData={data} />
            </Box>
        </Dialog>
    );
};

export default CreateArticle;
