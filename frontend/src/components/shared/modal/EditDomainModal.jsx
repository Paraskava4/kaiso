"use client";
import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Select, MenuItem, FormControl, Button, IconButton } from "@mui/material";
import { X, Upload, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateCategoryMutation, useUpdateSubCategoryMutation, useGetCategoriesQuery } from "../../../api/categories";
import { ensureWebP } from "@/utils/imageUtils";

// URL validation function
const validateUrlSlug = (value) => {
    if (!value) return true; // Allow empty for optional validation
    return /^[a-zA-Z0-9_-]+$/.test(value); // Only letters, numbers, -, _ allowed. No spaces or /
};

const EditDomainModal = ({ open, onClose, onSuccess, domainData, type = "Report" }) => {
    const [updateCategory, { isLoading: isUpdatingCategory }] = useUpdateCategoryMutation();
    const [updateSubCategory, { isLoading: isUpdatingSubCategory }] = useUpdateSubCategoryMutation();

    // Get all categories for dropdown, filtered by type
    const { data: categoriesResponse } = useGetCategoriesQuery({ type });
    const categories = categoriesResponse?.data || [];

    // Check if any loading is happening
    const isLoading = isUpdatingCategory || isUpdatingSubCategory;

    const [formData, setFormData] = useState({
        name: "",
        mainDomain: "",
        url: "",
        description: "",
        code: "",
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [urlError, setUrlError] = useState("");

    // Main domain options (you can make this dynamic later)
    const mainDomainOptions = [
        "Consumer Goods",
        "Healthcare",
        "Technology",
        "Energy",
        "Automotive",
        "Financial Services",
        "Manufacturing",
        "Agriculture",
        "Marketing",
    ];

    // Populate form when domainData changes
    useEffect(() => {
        if (domainData) {
            // Determine if this is a subdomain and get parent domain ID
            let parentDomainId = "";
            if (domainData.type === "sub" && domainData.parentDomain) {
                parentDomainId = domainData.parentDomain?._id || domainData.parentDomain;
            }

            setFormData({
                name: domainData.name || "",
                mainDomain: parentDomainId, // Set parent domain ID if it's a subdomain
                url: domainData.url || "",
                description: domainData.description || "",
                code: domainData.code || "",
                image: null, // Will be handled separately for existing image
            });

            // Set existing image preview
            if (domainData.image) {
                setImagePreview(domainData.image);
            }
        }
    }, [domainData]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Real-time URL validation
        if (field === "url") {
            if (value && !validateUrlSlug(value)) {
                setUrlError("Only letters, numbers, -, _ allowed. Do not use '/' or spaces");
            } else {
                setUrlError("");
            }
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        processImageFile(file);
    };

    const processImageFile = async (file) => {
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Please select a valid image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }
            const converted = await ensureWebP(file, { quality: 0.8, maxWidth: 1920, maxHeight: 1920 });
            console.log("Converted image size:", (converted.size / 1024).toFixed(2), "KB");

            setFormData((prev) => ({
                ...prev,
                image: converted,
            }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            processImageFile(files[0]);
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.name.trim()) {
            toast.error("Domain name is required");
            return;
        }

        // For subdomains, main domain is required - they cannot be converted to main domains
        if (domainData.type === "sub" && !formData.mainDomain) {
            toast.error("Main domain is required for subdomains");
            return;
        }

        // if (!formData.url.trim()) {
        //     toast.error("URL slug is required");
        //     return;
        // }

        // Validate URL slug format
        if (!validateUrlSlug(formData.url.trim())) {
            toast.error("Only letters, numbers, -, _ allowed. Do not use '/' or spaces");
            return;
        }

        // if (!formData.description.trim()) {
        //     toast.error("Domain description is required");
        //     return;
        // }

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append("name", formData.name.trim());
            submitData.append("url", formData.url.trim());
            submitData.append("description", formData.description.trim());
            submitData.append("code", formData.code.trim());

            // Add type field for backend requirement
            submitData.append("type", type);

            // Only append image if a new one was selected
            if (formData.image) {
                submitData.append("image", formData.image);
            }

            // Determine the correct API call based on domain type
            if (domainData.type === "sub") {
                // Updating subdomain - main domain is required (validated above)
                submitData.append("subCategoryId", domainData._id);
                submitData.append("categoryId", formData.mainDomain);
                await updateSubCategory(submitData).unwrap();
                toast.success("Subdomain updated successfully!");
            } else {
                // Updating main domain
                submitData.append("categoryId", domainData._id);
                await updateCategory(submitData).unwrap();
                toast.success("Domain updated successfully!");
            }

            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Update domain/subdomain error:", error);
            toast.error(error?.data?.message || "Failed to update domain/subdomain");
        }
    };

    const handleCancel = () => {
        // Reset form
        setFormData({
            name: "",
            mainDomain: "",
            url: "",
            description: "",
            code: "",
            image: null,
        });
        setImagePreview(null);
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleCancel}
            aria-labelledby="edit-domain-modal"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 500,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    position: "relative",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                        Edit Domain
                    </Typography>
                    <IconButton onClick={handleCancel} size="small">
                        <X size={24} />
                    </IconButton>
                </Box>

                {/* Form Fields */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {/* Domain name */}
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Domain name <sup style={{ color: "red", fontSize: 16 }}>*</sup>
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Name a Domain"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            variant="outlined"
                            size="medium"
                        />
                    </Box>

                    {/* Main Domain name */}
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Main Domain name
                        </Typography>
                        <FormControl fullWidth>
                            <Select
                                value={formData.mainDomain}
                                onChange={(e) => handleInputChange("mainDomain", e.target.value)}
                                displayEmpty={domainData?.type === "main"} // Only show empty for main domains
                                variant="outlined"
                                size="medium"
                                disabled={domainData?.type === "main"} // Disable for main domains
                            >
                                {domainData?.type === "main" && <MenuItem value="">Main Domain (No Parent)</MenuItem>}
                                {domainData?.type === "sub" && !formData.mainDomain && (
                                    <MenuItem value="" disabled>
                                        Choose a main domain
                                    </MenuItem>
                                )}
                                {categories.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                            {domainData?.type === "main"
                                ? "This is a main domain"
                                : formData.mainDomain
                                ? "This is a subdomain under selected domain"
                                : "Please select a main domain (required for subdomains)"}
                        </Typography>
                    </Box>

                    {/* URL slug */}
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            URL slug <sup style={{ color: "red", fontSize: 16 }}>*</sup>
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="personal_care_and_cosmetics"
                            value={formData.url}
                            onChange={(e) => handleInputChange("url", e.target.value)}
                            variant="outlined"
                            size="medium"
                            error={!!urlError}
                            helperText={urlError || "Only letters, numbers, -, _ allowed. Do not use '/' or spaces"}
                        />
                    </Box>

                    {/* Domain Description */}
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Domain Description <sup style={{ color: "red", fontSize: 16 }}>*</sup>
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            placeholder=""
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            variant="outlined"
                        />
                    </Box>

                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Code
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Code"
                            value={formData.code}
                            onChange={(e) => handleInputChange("code", e.target.value)}
                            variant="outlined"
                        />
                    </Box>

                    {/* Domain image */}
                    {/* <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Domain image <sup style={{ color: "red", fontSize: 16 }}>*</sup>
                        </Typography>
                        {imagePreview ? (
                            <Box
                                sx={{
                                    position: "relative",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    height: 120,
                                    border: "1px solid #ddd",
                                }}
                            >
                                <Image
                                    src={imagePreview}
                                    alt="Domain"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                    width={100}
                                    height={100}
                                    quality={100}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        display: "flex",
                                        gap: 1,
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() => document.getElementById("edit-image-upload").click()}
                                        sx={{
                                            bgcolor: "rgba(255, 255, 255, 0.9)",
                                            "&:hover": {
                                                bgcolor: "rgba(255, 255, 255, 1)",
                                            },
                                        }}
                                    >
                                        <Edit size={16} />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setFormData((prev) => ({ ...prev, image: null }));
                                        }}
                                        sx={{
                                            bgcolor: "rgba(255, 255, 255, 0.9)",
                                            "&:hover": {
                                                bgcolor: "rgba(255, 255, 255, 1)",
                                            },
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </IconButton>
                                </Box>
                                <input id="edit-image-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    border: "2px dashed #ddd",
                                    borderRadius: 1,
                                    p: 3,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    "&:hover": {
                                        borderColor: "#999",
                                        bgcolor: "#f9f9f9",
                                    },
                                    minHeight: 120,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onClick={() => document.getElementById("edit-image-upload-fallback").click()}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input id="edit-image-upload-fallback" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                                <Upload size={40} className="text-gray-500 mb-1" />
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Upload Background
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Click to browse or drag & drop image here
                                </Typography>
                            </Box>
                        )}
                    </Box> */}

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            sx={{
                                flex: 1,
                                bgcolor: "#dc2626",
                                "&:hover": {
                                    bgcolor: "#b91c1c",
                                },
                                py: 1.5,
                                fontWeight: 600,
                            }}
                        >
                            {isLoading ? "Updating..." : "Add"}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleCancel}
                            sx={{
                                flex: 1,
                                borderColor: "#d1d5db",
                                color: "#374151",
                                "&:hover": {
                                    borderColor: "#9ca3af",
                                    bgcolor: "#f9fafb",
                                },
                                py: 1.5,
                                fontWeight: 600,
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditDomainModal;
