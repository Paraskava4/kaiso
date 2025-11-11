import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button, FormControl, Select, MenuItem, IconButton } from "@mui/material";
import { Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import {
    useCreateBlogCategoryMutation,
    useCreateBlogSubCategoryMutation,
    useGetBlogCategoriesQuery,
    useGetNewsCategoriesQuery,
} from "../../../api/blogCategories";
import { ensureWebP } from "@/utils/imageUtils";
import { Label } from "../forms";
// import { Label } from "../forms";

// URL validation function
const validateUrlSlug = (value) => {
    if (!value) return true; // Allow empty for optional validation
    return /^[a-zA-Z0-9_-]+$/.test(value); // Only letters, numbers, -, _ allowed. No spaces or /
};

const AddBlogDomainModal = ({ open, onClose, onSuccess }) => {
    const [createBlogCategory, { isLoading: isCreatingBlogCategory }] = useCreateBlogCategoryMutation();
    const [createBlogSubCategory, { isLoading: isCreatingBlogSubCategory }] = useCreateBlogSubCategoryMutation();

    // Get all blog and news categories for dropdown
    const { data: blogCategoriesResponse } = useGetBlogCategoriesQuery();
    const { data: newsCategoriesResponse } = useGetNewsCategoriesQuery();
    const blogCategories = blogCategoriesResponse?.data || [];
    const newsCategories = newsCategoriesResponse?.data || [];

    const [formData, setFormData] = useState({
        name: "",
        mainDomain: "",
        url: "",
        description: "",
        type: "Blog", // Default to Blog
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [urlError, setUrlError] = useState("");

    // Check if any loading is happening
    const isLoading = isCreatingBlogCategory || isCreatingBlogSubCategory;

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!open) {
            setFormData({
                name: "",
                mainDomain: "",
                url: "",
                description: "",
                type: "Blog",
                image: null,
            });
            setImagePreview(null);
            setUrlError("");
        }
    }, [open]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Reset main domain when type changes
        if (field === "type") {
            setFormData((prev) => ({
                ...prev,
                type: value,
                mainDomain: "",
            }));
        }

        // Real-time URL validation
        if (field === "url") {
            if (value && !validateUrlSlug(value)) {
                setUrlError("Only letters, numbers, -, _ allowed. Do not use '/' or spaces");
            } else {
                setUrlError("");
            }
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

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

        // Convert to WebP for better performance
        const webpFile = await ensureWebP(file, { 
            quality: 0.8, 
            maxWidth: 1920, 
            maxHeight: 1920 
        });

        console.log("Converted size (KB):", (webpFile.size / 1024).toFixed(2));
        setFormData((prev) => ({
            ...prev,
            image: webpFile,
        }));

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(webpFile);
    };

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith("image/")) {
                setFormData((prev) => ({
                    ...prev,
                    image: file,
                }));

                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.name.trim()) {
            toast.error("Domain name is required");
            return;
        }

        // if (!formData.url.trim()) {
        //     toast.error("URL slug is required");
        //     return;
        // }
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

        if (!formData.type) {
            toast.error("Article type is required");
            return;
        }

        // if (!formData.image) {
        //     toast.error("Domain image is required");
        //     return;
        // }

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append("name", formData.name.trim());
            submitData.append("url", formData.url.trim());
            submitData.append("description", formData.description.trim());
            submitData.append("image", formData.image);

            // Add type field for backend requirement
            submitData.append("type", formData.type);

            // Determine if creating main domain or subdomain
            if (formData.mainDomain) {
                // Creating subdomain - add categoryId
                submitData.append("categoryId", formData.mainDomain);
                await createBlogSubCategory(submitData).unwrap();
                toast.success("Subdomain created successfully!");
            } else {
                // Creating main domain
                await createBlogCategory(submitData).unwrap();
                toast.success("Domain created successfully!");
            }

            // Reset form
            setFormData({
                name: "",
                mainDomain: "",
                url: "",
                description: "",
                type: "Blog",
                image: null,
            });
            setImagePreview(null);

            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Create blog domain/subdomain error:", error);
            toast.error(error?.data?.message || "Failed to create domain/subdomain");
        }
    };

    const handleCancel = () => {
        // Reset form
        setFormData({
            name: "",
            mainDomain: "",
            url: "",
            description: "",
            type: "Blog",
            image: null,
        });
        setImagePreview(null);
        onClose();
    };

    // Get available categories based on selected type
    const getAvailableCategories = () => {
        return formData.type === "Blog" ? blogCategories : newsCategories;
    };

    return (
        <Modal
            open={open}
            onClose={handleCancel}
            aria-labelledby="add-blog-domain-modal"
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
                        Add Domain
                    </Typography>
                    <IconButton onClick={handleCancel} size="small">
                        <X />
                    </IconButton>
                </Box>

                {/* Form Fields */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {/* Domain name */}
                    <Box>
                        {/* <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Domain name *
                        </Typography> */}
                        <Label title="Domain name" requiredDot={true} />

                        <TextField
                            fullWidth
                            placeholder="Name a Domain"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            variant="outlined"
                            size="medium"
                        />
                    </Box>
                    {/* Select type */}
                    <Box>
                        {/* <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Select type *
                        </Typography> */}
                        <Label title="Select type" requiredDot={true} />

                        <FormControl fullWidth>
                            <Select
                                value={formData.type}
                                onChange={(e) => handleInputChange("type", e.target.value)}
                                displayEmpty
                                variant="outlined"
                                size="medium"
                            >
                                <MenuItem value="" disabled>
                                    Does it blog or news article
                                </MenuItem>
                                <MenuItem value="Blog">Blog</MenuItem>
                                <MenuItem value="News Article">News Article</MenuItem>
                            </Select>
                        </FormControl>
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
                                displayEmpty
                                variant="outlined"
                                size="medium"
                            >
                                <MenuItem value="">Choose a main Domain</MenuItem>
                                {getAvailableCategories().map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* URL slug */}
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            URL slug <sup style={{ color: "red", fontSize: 16 }}>*</sup>
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="write url"
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
                            placeholder="Description "
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            variant="outlined"
                        />
                    </Box>

                    {/* Domain image */}
                    {/* <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Domain image <sup style={{ color: "red", fontSize: 16 }}>*</sup>
                        </Typography>
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
                            onClick={() => document.getElementById("image-upload").click()}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                            {imagePreview ? (
                                <Box sx={{ textAlign: "center" }}>
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: 80,
                                            borderRadius: 4,
                                            marginBottom: 8,
                                        }}
                                        width={100}
                                        height={100}
                                        quality={100}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        Click to change image
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: "center" }}>
                                    <Upload className="w-10 h-10 text-[#999] mb-1" />
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        Upload Background
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Click to browse or drag & drop image here
                                    </Typography>
                                </Box>
                            )}
                        </Box>
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
                            {isLoading ? "Adding..." : "Add"}
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

export default AddBlogDomainModal;
