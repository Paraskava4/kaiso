import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import { X } from "lucide-react";

// Define the types for the props

const CommonModal = ({ open, title, width = "md", onClose, children, sx, fullScreen, TransitionComponent, ...props }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="custom-dialog-title"
            maxWidth={width} // controls max width
            fullWidth={true} // forces the Dialog to take the full width up to maxWidth
            sx={sx}
            fullScreen={fullScreen}
            {...props}
            TransitionComponent={TransitionComponent}
        >
            <DialogTitle
                id="custom-dialog-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 800,
                }}
            >
                {title}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                }}
            >
                <X />
            </IconButton>
            <DialogContent>{children}</DialogContent>
        </Dialog>
    );
};

export default CommonModal;
