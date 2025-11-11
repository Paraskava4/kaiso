"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestPublications, createLatestPublication, updateLatestPublication, deleteLatestPublication } from "../../../redux/masters/publicationSlice";
import { getReportsForPublication } from "../../../api/masters/publication";
import { Box, Typography, IconButton, Button, Collapse, Grid, Paper, Modal, TextField, MenuItem } from "@mui/material";
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, XCircle } from "lucide-react";
import { getPublicationById } from "../../../api/masters/publication";
import EntityFormField from "@/components/shared/EntityFormField";
import EntityButton from "@/components/shared/EntityButton";
import { useAccess } from "@/utils/constants/accessContext";
import { ensureWebP } from "@/utils/imageUtils";

const ActionButton = ({ icon: IconComponent, onClick, ariaLabel, ...props }) => (
    <IconButton
        onClick={onClick}
        aria-label={ariaLabel}
        size="small"
        sx={{
            border: "1px solid rgba(0, 0, 0, 0.2)",
            backgroundColor: "white",
            "&:hover": {
                backgroundColor: "#f5f5f5",
            },
        }}
        {...props}
    >
        <IconComponent fontSize="small" sx={{ color: "#5A5D63" }} />
    </IconButton>
);

const AddButton = ({ onClick, disabled, ...props }) => (
    <Button
        variant="outlined"
        disabled={disabled}
        startIcon={<Plus className="w-[18px] h-[18px] text-[#5A5D63]" />}
        onClick={onClick}
        sx={{
            backgroundColor: "white",
            borderColor: "rgba(0, 0, 0, 0.2)",
            color: "#5A5D63",
            textTransform: "none",
            "&:hover": {
                backgroundColor: "#f5f5f5",
                borderColor: "rgba(0, 0, 0, 0.3)",
            },
        }}
        {...props}
    >
        Add New
    </Button>
);

const PublicationCard = ({ reportTitle, bigImage, onEdit, onDelete }) => {
    const { isButtonDisabled } = useAccess();

    return (
        <Paper
            elevation={1}
            sx={{
                width: 250,
                height: 300,
                borderRadius: 3,
                position: "relative",
                backgroundImage: bigImage ? `url(${bigImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: bigImage ? "transparent" : "#d1d1d1",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    display: "flex",
                    gap: 1,
                    zIndex: 1,
                }}
            >
                <ActionButton icon={Edit} onClick={onEdit} ariaLabel="Edit publication" disabled={isButtonDisabled("update")} />
                <ActionButton icon={Trash2} onClick={onDelete} ariaLabel="Delete publication" disabled={isButtonDisabled("delete")} />
            </Box>

            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    bgcolor: "transparent",
                    color: "white",
                    width: "100%",
                    p: 2,
                    minHeight: 80,
                }}
            >
                <Typography variant="body2">{reportTitle && reportTitle.length > 77 ? `${reportTitle.substring(0, 77)}...` : reportTitle || ""}</Typography>
            </Box>
        </Paper>
    );
};

// Custom form component for Latest Publication
const CustomPublicationForm = ({ title, initialValues, reports, selectedReportId, onReportChange, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});

    // Update formData when initialValues change
    React.useEffect(() => {
        setFormData(initialValues);
    }, [initialValues]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));

        // Handle report selection
        if (name === "report") {
            onReportChange(value);
        }
    };

    const handleFileChange = async (name, file) => {
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                setErrors((prev) => ({ ...prev, [name]: "Please upload an image file (JPG, PNG, GIF, WebP)" }));
                return;
            }

            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (file.size > maxSize) {
                setErrors((prev) => ({ ...prev, [name]: "File size must be less than 10MB" }));
                return;
            }
        }
        const finalFile = await ensureWebP(file, { quality: 0.8, maxWidth: 1920, maxHeight: 1920 });
        setFormData((prev) => ({ ...prev, [name]: finalFile }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // Drag and drop handlers
    const [isDragOver, setIsDragOver] = React.useState(false);
    const [dragCounter, setDragCounter] = React.useState(0);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter((prev) => prev + 1);
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter((prev) => {
            const newCounter = prev - 1;
            if (newCounter === 0) {
                setIsDragOver(false);
            }
            return newCounter;
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        setDragCounter(0);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            // Check if it's an image file
            if (file.type.startsWith("image/")) {
                handleFileChange("bigImage", file);
            } else {
                setErrors((prev) => ({ ...prev, bigImage: "Please upload an image file (JPG, PNG, GIF, WebP)" }));
            }
        }
    };

    // Prevent default drag behaviors on the entire form
    const handleFormDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleFormDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.report) newErrors.report = "Report is required";
        if (!formData.reportTitle) newErrors.reportTitle = "Report title is required";
        if (!formData.reportSubTitle) newErrors.reportSubTitle = "Report subtitle is required";
        // For updates, image is only required if there's no existing image and no new image selected
        if (!formData.bigImage && !formData.existingImage) newErrors.bigImage = "Background image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const reportOptions = reports.map((r) => ({ value: r.id, label: r.reportTitle }));
    const isReportSelected = Boolean(selectedReportId);

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
            }}
        >
            <IconButton onClick={onCancel} sx={{ position: "absolute", top: 16, right: 16 }} aria-label="Close Form">
                <XCircle className="w-5 h-5" />
            </IconButton>

            <Typography variant="h9" mb={3}>
                {title}
            </Typography>

            <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '16px' }}>
                <form onSubmit={handleSubmit} onDragOver={handleFormDragOver} onDrop={handleFormDrop}>
                    {/* Report Selection */}
                    <EntityFormField label="Choose Report" required className="mb-4">
                        <TextField
                            select
                            fullWidth
                            value={formData.report || ""}
                            onChange={(e) => handleChange("report", e.target.value)}
                            slotProps={{
                                select: {
                                    renderValue: (selected) => {
                                        if (!selected) return "Choose Report";
                                        const option = reportOptions.find((opt) => opt.value === selected);
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
                                },
                            }}
                            error={!!errors.report}
                            helperText={errors.report}
                        >
                            <MenuItem value="" disabled>
                                Choose Report
                            </MenuItem>
                            {reportOptions.map((option, index) => (
                                <MenuItem key={index} value={option.value} sx={{ maxWidth: 800 }}>
                                    <Box sx={{ whiteSpace: "normal" }}>{option.label.length > 120 ? `${option.label.slice(0, 117)}...` : option.label}</Box>
                                </MenuItem>
                            ))}
                        </TextField>
                    </EntityFormField>

                    {/* Report Title */}
                    <EntityFormField label="Report Title" required className="mb-4">
                        <TextField
                            fullWidth
                            type="text"
                            value={formData.reportTitle || ""}
                            onChange={(e) => handleChange("reportTitle", e.target.value)}
                            placeholder="Enter report title"
                            error={!!errors.reportTitle}
                            helperText={errors.reportTitle || (Boolean(selectedReportId) ? "Title is auto-filled from selected report" : "")}
                            sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                    WebkitTextFillColor: "#666",
                                    backgroundColor: "#f5f5f5",
                                },
                            }}
                        />
                    </EntityFormField>

                    {/* Report Subtitle */}
                    <EntityFormField label="Report Subtitle" required className="mb-4">
                        <TextField
                            fullWidth
                            type="text"
                            value={formData.reportSubTitle || ""}
                            onChange={(e) => handleChange("reportSubTitle", e.target.value)}
                            placeholder="Enter report subtitle"
                            error={!!errors.reportSubTitle}
                            helperText={errors.reportSubTitle || (Boolean(selectedReportId) ? "Subtitle is auto-filled from selected report (or first 55 characters of overview if subtitle is empty)" : "")}
                            sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                    WebkitTextFillColor: "#666",
                                    backgroundColor: "#f5f5f5",
                                },
                            }}
                        />
                    </EntityFormField>

                    {/* Background Image */}
                    <EntityFormField label="Bg Image" required={!formData.existingImage} className="mb-4">
                        <Box
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById("file-input-bigImage").click()}
                            sx={{
                                border: errors.bigImage ? "2px solid red" : isDragOver ? "2px solid #1976d2" : "2px dashed rgba(67,70,75,0.3)",
                                borderRadius: "8px",
                                px: 3,
                                py: 4,
                                textAlign: "center",
                                backgroundColor: isDragOver ? "#f0f8ff" : "#fafafa",
                                cursor: "pointer",
                                color: "#777",
                                minHeight: 120,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                mt: 2,
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                    backgroundColor: "#f0f0f0",
                                    borderColor: "#1976d2",
                                },
                            }}
                        >
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                id="file-input-bigImage"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        handleFileChange("bigImage", file);
                                    }
                                }}
                            />

                            {formData.bigImage || formData.existingImage ? (
                                <Box sx={{ textAlign: "center" }}>
                                    {/* Image Preview */}
                                    <Box sx={{ mb: 2 }}>
                                        <Image
                                            src={
                                                formData.bigImage instanceof File
                                                    ? URL.createObjectURL(formData.bigImage)
                                                    : formData.existingImage || formData.bigImage
                                            }
                                            alt="Preview"
                                            style={{
                                                maxWidth: "200px",
                                                maxHeight: "120px",
                                                objectFit: "cover",
                                                borderRadius: "4px",
                                                border: "1px solid #ddd",
                                            }}
                                            width={100}
                                            height={100}
                                            quality={100}
                                        />
                                    </Box>
                                    <Typography variant="body2" sx={{ color: "#333", fontWeight: 500 }}>
                                        {formData.bigImage instanceof File ? formData.bigImage.name : "Current image"}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#666", mt: 1, display: "block" }}>
                                        Click to change or drag & drop a new image
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="body1" sx={{ color: "#333", fontWeight: 500, mb: 1 }}>
                                        {isDragOver ? "Drop image here" : "Upload Background Image"}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#666" }}>
                                        Click to browse or drag & drop an image file
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#999", display: "block", mt: 0.5 }}>
                                        Supports: JPG, PNG, GIF, WebP
                                    </Typography>
                                </Box>
                            )}

                            {errors.bigImage && (
                                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                                    {errors.bigImage}
                                </Typography>
                            )}
                        </Box>
                    </EntityFormField>

                    <Box display="flex" gap={2} mt={4}>
                        <EntityButton type="submit" variant="primary">
                            Submit
                        </EntityButton>
                        <EntityButton type="button" variant="secondary" onClick={onCancel}>
                            Cancel
                        </EntityButton>
                    </Box>
                </form>
            </div>
        </Paper>
    );
};

const LatestPublication = () => {
    // Add unhandled rejection prevention
    useEffect(() => {
        const handleUnhandledRejection = (event) => {
            // Prevent Next.js error panel for network-related errors
            if (
                event.reason?.response?.status === 404 ||
                event.reason?.code === "NETWORK_ERROR" ||
                event.reason?.message?.includes("Network Error") ||
                event.reason?.message?.includes("Failed to fetch")
            ) {
                event.preventDefault();
                console.error("Prevented unhandled promise rejection:", event.reason);
            }
        };

        window.addEventListener("unhandledrejection", handleUnhandledRejection);

        return () => {
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
    }, []);

    const dispatch = useDispatch();
    const { isButtonDisabled } = useAccess();
    const { data: publications, status } = useSelector((state) => state.publication);
    const [reports, setReports] = useState([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedPub, setSelectedPub] = useState(null);
    const [formData, setFormData] = useState({});
    const [selectedReportId, setSelectedReportId] = useState("");

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchLatestPublications());
        }
    }, [status, dispatch]);

    // Fetch reports using the new web API
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await getReportsForPublication();
                if (response?.error) {
                    console.error("Failed to fetch reports:", response.message);
                    setReports([]);
                } else {
                    // Transform the data to match the expected format
                    const reportsData = response.data?.data || [];
                    const transformedReports = reportsData.map((report) => ({
                        id: report._id,
                        reportTitle: report.reportTitle,
                        reportSubTitle: report.reportSubTitle || report.subTitle || "",
                        reportOverview: report.reportOverview || "",
                    }));
                    setReports(transformedReports);
                }
            } catch (error) {
                console.error("Error fetching reports:", error);
                setReports([]);
            }
        };

        fetchReports();
    }, []);

    // Deduplicate publications to ensure unique React keys
    const displayPublications = React.useMemo(() => {
        const seen = new Set();
        return (publications || []).filter((pub) => {
            const id = pub._id || pub.id;
            if (!id) return true; // keep entries without id
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    }, [publications]);

    const handleToggleExpand = () => setIsExpanded((prev) => !prev);

    const handleAddNew = () => {
        setSelectedPub(null);
        setFormData({
            report: "",
            reportTitle: "",
            reportSubTitle: "",
            bigImage: null,
            existingImage: null,
        });
        setSelectedReportId("");
        setShowForm(true);
    };

    const handleEdit = async (id) => {
        try {
            const res = await getPublicationById(id);
            const data = res.data?.data || res.data;
            setSelectedPub(data);
            const reportId = extractId(data.reportId || data.report);
            setSelectedReportId(reportId);
            // Set formData with all necessary fields for editing
            setFormData({
                report: reportId,
                reportTitle: data.reportTitle,
                reportSubTitle: data.reportSubTitle || data.reportSubTitleText || data.blogDescription || data.blogDetails || "",
                bigImage: data.bigImage || null, // Preserve existing image
                existingImage: data.bigImage, // Keep track of existing image
            });
            setShowForm(true);
        } catch (e) {
            console.error("Failed to fetch publication", e);
        }
    };

    const handleDelete = (id) => {
        if (!id) return;
        dispatch(deleteLatestPublication(id))
            .unwrap()
            .then(() => {
                dispatch(fetchLatestPublications());
            });
    };

    // Handle report selection change
    const handleReportChange = (reportId) => {
        setSelectedReportId(reportId);

        if (reportId) {
            // Find the selected report and auto-populate the title
            const selectedReport = reports.find((r) => r.id === reportId);
            if (selectedReport) {
                let subtitle = selectedReport.reportSubTitle || "";
                if (!subtitle && selectedReport.reportOverview) {
                    // Strip HTML tags and get first 55 characters
                    const plainText = selectedReport.reportOverview.replace(/<[^>]*>/g, '').trim();
                    subtitle = plainText.length > 75 ? `${plainText.substring(0, 75)}...` : plainText;
                }

                setFormData((prev) => ({
                    ...prev,
                    report: reportId,
                    reportTitle: selectedReport.reportTitle,
                    reportSubTitle: subtitle,
                }));
            }
        } else {
            // Clear the title when no report is selected
            setFormData((prev) => ({
                ...prev,
                report: "",
                reportTitle: "",
                reportSubTitle: "",
            }));
        }
    };

    const handleCreatePublication = (data) => {
        const formData = new FormData();
        formData.append("reportId", data.report);
        // For backward compatibility keep original key if backend accepts it
        // formData.append('report', data.report);
        formData.append("reportTitle", data.reportTitle);
        if (data.reportSubTitle !== undefined) {
            // Send reportSubTitle under blogDescription for backend compatibility
            formData.append("blogDescription", data.reportSubTitle || "");
        }

        // Only append image if a new file is selected
        if (data.bigImage instanceof File) {
            formData.append("bigImage", data.bigImage);
            // Also append under generic key for compatibility
            formData.append("image", data.bigImage);
        }

        const thunk = selectedPub ? updateLatestPublication : createLatestPublication;
        if (selectedPub) {
            formData.append("publicationId", selectedPub.id || selectedPub._id);
        }
        dispatch(thunk(formData))
            .unwrap()
            .then(() => {
                // Refresh list after successful create/update to ensure accuracy
                dispatch(fetchLatestPublications());
                setShowForm(false);
                setSelectedPub(null);
                setSelectedReportId("");
                setFormData({});
            });
    };

    const extractId = (val) => {
        if (!val) return "";
        if (typeof val === "string") return val;
        if (typeof val === "object") return val._id || val.id || "";
        return "";
    };

    // Use formData as the source of truth for initial values
    // This ensures that when user changes report selection, the form reflects the changes
    const initialValues = formData;

    return (
        <Box display="flex" flexDirection="column" gap={2} width={1}>
            {/* Header: Title and Buttons */}
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%", mb: 2 }}>
                <Typography fontWeight="bold" fontSize="1rem" sx={{ flexGrow: 1, minWidth: 0 }}>
                    Latest Publication
                </Typography>
                <Box display="flex" gap={1} flexShrink={0}>
                    <AddButton onClick={handleAddNew} disabled={isButtonDisabled("create")} />
                    <IconButton onClick={handleToggleExpand} size="small">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </IconButton>
                </Box>
            </Box>

            {/* Cards */}
            <Collapse in={isExpanded}>
                <Box sx={{ mt: 2 }}>
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            p: 2,
                            bgcolor: "#f5f5f5",
                            borderRadius: 3,
                        }}
                    >
                        {displayPublications.map((pub) => (
                            <Grid item key={pub._id || pub.id} xs={12} sm={6} md={4} lg={2}>
                                <PublicationCard
                                    reportTitle={pub.reportTitle}
                                    bigImage={pub.bigImage}
                                    onEdit={() => handleEdit(pub.id || pub._id)}
                                    onDelete={() => handleDelete(pub.id || pub._id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Collapse>

            {/* Custom Form Modal */}
            <Modal
                open={showForm}
                onClose={() => {
                    setShowForm(false);
                    setSelectedPub(null);
                    setSelectedReportId("");
                    setFormData({});
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                    }}
                >
                    <CustomPublicationForm
                        title={selectedPub ? "Update Latest Publication" : "Add Latest Publication"}
                        initialValues={initialValues}
                        reports={reports}
                        selectedReportId={selectedReportId}
                        onReportChange={handleReportChange}
                        onSubmit={handleCreatePublication}
                        onCancel={() => {
                            setShowForm(false);
                            setSelectedPub(null);
                            setSelectedReportId("");
                            setFormData({});
                        }}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default LatestPublication;
