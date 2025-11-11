"use client";
import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { X } from "lucide-react";
import InfoTable from "../../shared/InfoTable";

const DetailsModal = ({ open, onClose, title = "Inquiry Details", data = [] }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth aria-labelledby="details-dialog-title">
            <DialogTitle id="details-dialog-title" className="flex justify-between items-center">
                <span>{title}</span>
                <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                    <X size={24} />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <InfoTable title={title} data={data} />
            </DialogContent>
        </Dialog>
    );
};

export default DetailsModal;
