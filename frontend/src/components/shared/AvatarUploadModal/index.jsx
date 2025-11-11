"use client";
import React, { useState, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, Avatar, CircularProgress } from "@mui/material";
import { X, Upload, Camera } from "lucide-react";
import Image from "next/image";

const AvatarUploadModal = ({ open = false, onClose = () => {}, onSave = () => {}, currentImage = null, loading = false, title = "Upload Profile Picture" }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileSelect = (file) => {
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handle drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    // Handle save
    const handleSave = () => {
        if (selectedFile) {
            onSave(selectedFile);
        }
    };

    // Handle close
    const handleClose = () => {
        setSelectedFile(null);
        setPreview(null);
        setDragActive(false);
        onClose();
    };

    // Handle remove current image
    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreview(null);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    minHeight: 400,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: 1,
                }}
            >
                <Typography variant="h6" component="div">
                    {title}
                </Typography>
                <IconButton onClick={handleClose} size="small" sx={{ color: "grey.500" }}>
                    <X size={20} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {/* Current Image Preview */}
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                border: "3px solid",
                                borderColor: "primary.main",
                            }}
                        >
                            {preview ? (
                                <Image src={preview} alt="Preview" width={120} height={120} style={{ objectFit: "cover" }} />
                            ) : currentImage ? (
                                <Image src={currentImage} alt="Current" width={120} height={120} style={{ objectFit: "cover" }} />
                            ) : (
                                <Camera size={40} className="text-gray-400" />
                            )}
                        </Avatar>
                    </Box>

                    {/* Upload Area */}
                    <Box
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        sx={{
                            border: `2px dashed ${dragActive ? "#1976d2" : "#e0e0e0"}`,
                            borderRadius: 2,
                            p: 4,
                            textAlign: "center",
                            cursor: "pointer",
                            backgroundColor: dragActive ? "rgba(25, 118, 210, 0.04)" : "transparent",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                borderColor: "#1976d2",
                                backgroundColor: "rgba(25, 118, 210, 0.04)",
                            },
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

                        <Upload size={48} className="text-gray-400 mb-2" />
                        <Typography variant="h6" gutterBottom>
                            Drop your image here, or click to browse
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Supports: JPG, PNG, GIF (Max 5MB)
                        </Typography>
                    </Box>

                    {/* Selected File Info */}
                    {selectedFile && (
                        <Box
                            sx={{
                                p: 2,
                                backgroundColor: "grey.50",
                                borderRadius: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="body2">Selected: {selectedFile.name}</Typography>
                            <Button size="small" onClick={handleRemoveImage} color="error">
                                Remove
                            </Button>
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={handleClose} variant="outlined" disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={!selectedFile || loading}
                    startIcon={loading ? <CircularProgress size={16} /> : null}
                >
                    {loading ? "Uploading..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AvatarUploadModal;
