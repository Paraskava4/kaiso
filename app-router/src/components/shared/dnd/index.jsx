import React, { useState, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Upload } from "lucide-react";

const DND = ({ value, onChange, name, error, setValue }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const allowedFileTypes = ["text/csv"];
    const maxFileSize = 1 * 1024 * 1024; // 1MB

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        handleFile(file);
    };

    const handleFile = (file) => {
        if (file && allowedFileTypes.includes(file.type) && file.size <= maxFileSize) {
            setValue(name, file, { shouldValidate: true });
        } else {
            setValue(name, null, { shouldValidate: true });
        }
    };

    return (
        <Box
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
                border: `2px dashed ${error ? "red" : isDragging ? "blue" : "grey"}`,
                padding: 2,
                borderRadius: 1,
                textAlign: "center",
                backgroundColor: isDragging ? "rgba(0, 0, 255, 0.1)" : "transparent",
            }}
        >
            <Box sx={{ fontSize: "2rem", display: "flex", justifyContent: "center", mb: 1 }}>
                <Box sx={{ p: 2, backgroundColor: "#F3F4F6", borderRadius: 2 }}>
                    <Upload />
                </Box>
            </Box>
            <Typography variant="body1">Drag and drop a file here or click to select</Typography>

            {value && (
                <Typography variant="body2" sx={{ mt: 1, wordBreak: "break-all" }}>
                    Selected: {value.name}
                </Typography>
            )}
            {error && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {error.message || "Invalid file. Please upload a valid CSV file (max 1MB)."}
                </Typography>
            )}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    (.csv, max 1MB)
                </Typography>
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<Upload />}
                    sx={{
                        //
                        color: "#fff",
                        backgroundColor: "#163272",
                        "&:hover": { backgroundColor: "#0d1a40" },
                    }}
                >
                    Select File
                    <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="text/csv" />
                </Button>
            </Box>
        </Box>
    );
};

export default DND;
