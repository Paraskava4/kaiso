"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Box, Typography, MenuItem, TextField, IconButton, Paper } from "@mui/material";
import { XCircle } from "lucide-react";
import EntityFormField from "../EntityFormField";
import EntityButton from "../EntityButton";
import { forwardRef, useImperativeHandle } from "react";
import { ensureWebP } from "@/utils/imageUtils";

const EntityForm = forwardRef(({ title, fields, onSubmit, onCancel, initialValues = {}, showCloseButton = true, showActions = true, sx = {} }, ref) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const dragRef = useRef(null);

    const validate = () => {
        const newErrors = {};
        fields.forEach((field) => {
            const value = formData[field.name];
            if (field.required) {
                if (field.type === "file") {
                    // For file fields, check if there's a new file or existing image
                    const hasExistingImage = formData.existingImage;
                    if (!value && !hasExistingImage) {
                        newErrors[field.name] = "This field is required.";
                    } else if (
                        field.accept &&
                        value &&
                        value instanceof File &&
                        !["image/jpeg", "image/png", "image/svg+xml", "image/webp", "image/jpg"].includes(value.type)
                    ) {
                        newErrors[field.name] = "Only .jpg, .jpeg, .png, .svg, .webp files are allowed.";
                    }
                } else if (!value || value === "") {
                    newErrors[field.name] = "This field is required.";
                }
            }
            if (
                field.type === "file" &&
                value &&
                field.accept &&
                value instanceof File &&
                !["image/svg+xml", "image/jpeg", "image/png", "image/webp", "image/jpg"].includes(value.type)
            ) {
                newErrors[field.name] = "Only .jpg, .jpeg, .png, .svg, .webp files are allowed.";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Update formData when actual content of initialValues changes
    React.useEffect(() => {
        // shallow compare keys/values to avoid needless state updates causing re-render loops
        const isSame = Object.keys(initialValues).every((key) => initialValues[key] === formData[key]);
        if (!isSame) {
            setFormData(initialValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(initialValues)]);

    const handleChange = (name, value, field) => {
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
        setErrors((prev) => ({ ...prev, [name]: undefined }));

        // Call custom onChange handler if provided
        if (field?.onChange && typeof field.onChange === "function") {
            const result = field.onChange(value, updatedFormData);
            // If onChange returns updated form data, use it
            if (result && typeof result === "object") {
                setFormData(result);
            }
        }
    };

    const handleFileChange = async (name, file) => {
        const finalFile = await ensureWebP(file, { quality: 0.8, maxWidth: 1920, maxHeight: 1920 });

        setFormData((prev) => ({ ...prev, [name]: finalFile }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const formRef = useRef(null);

    useImperativeHandle(ref, () => ({
        submit: () => {
            if (formRef.current) {
                formRef.current.requestSubmit();
            }
        },
    }));

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const handleDrop = (e, name) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileChange(name, file);
    };

    const handleDragOver = (e) => e.preventDefault();

    console.log("formData", formData);

    return (
        <Paper
            elevation={3}
            sx={{
                maxWidth: 840,
                width: "100%",
                mx: "auto",
                my: 4,
                p: 4,
                borderRadius: 2,
                position: "relative",
                ...sx,
            }}
        >
            {showCloseButton && (
                <IconButton onClick={onCancel} sx={{ position: "absolute", top: 16, right: 16 }} aria-label="Close Form">
                    <XCircle size={24} />
                </IconButton>
            )}

            {/* Title */}
            <Typography variant="h6" mb={3}>
                {title}
            </Typography>

            {/* Form Content */}
            <form ref={formRef} onSubmit={handleFormSubmit}>
                {fields.map((field, idx) => (
                    <EntityFormField key={idx} label={field.label} required={field.required} className="mb-4">
                        {field.type === "select" && (
                            <TextField
                                select
                                fullWidth
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value, field)}
                                SelectProps={{
                                    renderValue: (selected) => {
                                        if (!selected) return field.placeholder || "Select an option";
                                        const option = field.options?.find((opt) => opt.value === selected);
                                        if (!option) return selected;
                                        const label = option.label || "";
                                        return label.length > 120 ? `${label.slice(0, 117)}...` : label;
                                    },
                                    MenuProps: {
                                        PaperProps: {
                                            sx: {
                                                maxHeight: 300,
                                            },
                                        },
                                    },
                                }}
                                error={!!errors[field.name]}
                                helperText={errors[field.name]}
                                disabled={field.disabled}
                            >
                                <MenuItem value="" disabled>
                                    {field.placeholder || "Select an option"}
                                </MenuItem>

                                {field.options &&
                                    field.options.map((option, index) => (
                                        <MenuItem key={index} value={option.value} sx={{ maxWidth: 800 }}>
                                            <Box sx={{ whiteSpace: "normal" }}>
                                                {option.label.length > 120 ? `${option.label.slice(0, 117)}...` : option.label}
                                            </Box>
                                        </MenuItem>
                                    ))}
                            </TextField>
                        )}

                        {field.type === "text" && (
                            <TextField
                                fullWidth
                                type="text"
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value, field)}
                                placeholder={field.placeholder}
                                error={!!errors[field.name]}
                                helperText={errors[field.name]}
                                disabled={field.disabled}
                            />
                        )}

                        {field.type === "textarea" && (
                            <TextField
                                fullWidth
                                multiline
                                rows={field.rows || 3}
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value, field)}
                                placeholder={field.placeholder}
                                error={!!errors[field.name]}
                                helperText={errors[field.name]}
                                disabled={field.disabled}
                            />
                        )}

                        {field.type === "file" && (
                            <Box
                                ref={dragRef}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    handleFileChange(field.name, file);
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => document.getElementById(`file-input-${field.name}`).click()}
                                sx={{
                                    border: errors[field.name] ? "1px solid red" : "1px dashed rgba(67,70,75,0.3)",
                                    borderRadius: "8px",
                                    px: 3,
                                    py: 2,
                                    textAlign: "center",
                                    backgroundColor: "#fafafa",
                                    cursor: "pointer",
                                    color: "#777",
                                    minHeight: 100,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mt: 2,
                                }}
                            >
                                <input
                                    hidden
                                    type="file"
                                    accept={field.accept || "*"}
                                    id={`file-input-${field.name}`}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        handleFileChange(field.name, file);
                                    }}
                                />

                                {/* Show existing image or new file preview */}
                                {formData[field.name] || formData.existingImage ? (
                                    <Box sx={{ textAlign: "center", width: "100%" }}>
                                        {/* Image Preview */}
                                        {(formData[field.name] instanceof File || formData.existingImage) && (
                                            <Box sx={{ mb: 2 }}>
                                                <Image
                                                    src={
                                                        formData[field.name] instanceof File
                                                            ? URL.createObjectURL(formData[field.name])
                                                            : formData.existingImage
                                                    }
                                                    alt="Preview"
                                                    style={{
                                                        maxWidth: "150px",
                                                        maxHeight: "100px",
                                                        objectFit: "cover",
                                                        borderRadius: "4px",
                                                        border: "1px solid #ddd",
                                                    }}
                                                    width={100}
                                                    height={100}
                                                    quality={100}
                                                />
                                            </Box>
                                        )}
                                        <Typography variant="body2" sx={{ color: "#333", fontWeight: 500 }}>
                                            {formData[field.name] instanceof File ? formData[field.name].name : "Current image"}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#666", mt: 1, display: "block" }}>
                                            Click to change or drag & drop a new image
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ textAlign: "center", width: "100%" }}>
                                        <Typography variant="body1" sx={{ color: "#333", fontWeight: 500, mb: 1 }}>
                                            {field.placeholder || "Drag & Drop or Click to Upload"}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#666" }}>
                                            Click to browse or drag & drop a file
                                        </Typography>
                                    </Box>
                                )}

                                {errors[field.name] && (
                                    <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
                                        {errors[field.name]}
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </EntityFormField>
                ))}

                {showActions && (
                    <Box display="flex" gap={2} mt={4}>
                        <EntityButton type="submit" variant="primary">
                            Submit
                        </EntityButton>
                        <EntityButton type="button" variant="secondary" onClick={onCancel}>
                            Cancel
                        </EntityButton>
                    </Box>
                )}
            </form>
        </Paper>
    );
});

export default EntityForm;
