"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularInsights, createPopularInsight, updatePopularInsight, deletePopularInsight, fetchInsightById } from "../../../redux/masters/insightSlice";
import axiosInstance from "../../../utils/axiosInstance";
import { Box, Typography, IconButton, Button, Collapse, Grid, Paper, Modal } from "@mui/material";

import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import EntityForm from "@/components/shared/EntityForm";
import { useAccess } from "@/utils/constants/accessContext";

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

const AddButton = ({ onClick, ...props }) => (
    <Button
        variant="outlined"
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

const InsightCard = ({ blogDescription, bigImage, onEdit, onDelete }) => {
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
                <ActionButton icon={Edit} onClick={onEdit} ariaLabel="Edit insight" disabled={isButtonDisabled("update")} />
                <ActionButton icon={Trash2} onClick={onDelete} ariaLabel="Delete insight" disabled={isButtonDisabled("delete")} />
            </Box>

            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    bgcolor: "transparent",
                    color: "black",
                    width: "100%",
                    p: 2,
                    minHeight: 80,
                }}
            >
                <Typography variant="body2" sx={{ color: "black" }}>
                    {blogDescription || ""}
                </Typography>
            </Box>
        </Paper>
    );
};

const MostPopularInsights = ({ onAddNew, onEdit, onDelete }) => {
    // Add unhandled rejection prevention
    const { isButtonDisabled } = useAccess();
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
    const { data: insights, status } = useSelector((state) => state.insight);
    const [blogs, setBlogs] = useState([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedInsight, setSelectedInsight] = useState(null);
    const [formData, setFormData] = useState({});

    // Custom function to fetch blogs using the new API
    const fetchBlogsFromNewAPI = async () => {
        try {
            const response = await axiosInstance.get("/web/getBlog");
            const blogData = response.data?.data || [];
            setBlogs(blogData);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setBlogs([]);
        }
    };

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchPopularInsights());
        }
        // Fetch blogs list once using new API
        fetchBlogsFromNewAPI();
    }, [status, dispatch]);

    // Remove duplicates just in case backend returns same record twice
    const displayInsights = React.useMemo(() => {
        const seen = new Set();
        return insights.filter((item) => {
            const id = item._id || item.id;
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    }, [insights]);

    // Debug: Log the insights data to see the actual structure

    const handleToggleExpand = () => setIsExpanded((prev) => !prev);

    const handleAddNew = () => {
        setSelectedInsight(null);
        setFormData({
            existingImage: null,
        });
        setShowForm(true);
    };

    // Handle blog selection and auto-populate fields
    const handleBlogSelection = (blogId, currentFormData) => {
        const selectedBlog = blogs.find((blog) => (blog._id || blog.id) === blogId);
        if (selectedBlog) {
            const updatedFormData = {
                ...currentFormData,
                blog: blogId,
                blogTitle: selectedBlog.blogTitle || "",
                blogDescription: selectedBlog.blogSubTitle || "",
                // Note: We don't auto-populate bgImage as it's a file field
                // User can still change these values after auto-population
            };
            setFormData(updatedFormData);
            return updatedFormData;
        }
        return currentFormData;
    };

    // Submit handler – create popular insight
    const handleCreateInsight = (data) => {
        if (selectedInsight) {
            // UPDATE FLOW – use FormData for file uploads
            const formData = new FormData();
            formData.append("insightId", selectedInsight._id || selectedInsight.id);
            formData.append("blogId", data.blog);
            formData.append("blogTitle", data.blogTitle);
            formData.append("blogDescription", data.blogDescription);

            // Include image if a new file is selected
            if (data.bgImage instanceof File) {
                formData.append("image", data.bgImage);
            }

            dispatch(updatePopularInsight(formData))
                .unwrap()
                .then(() => {
                    dispatch(fetchPopularInsights());
                    setShowForm(false);
                    setSelectedInsight(null);
                    setFormData({});
                });
        } else {
            // CREATE FLOW
            const formData = new FormData();
            formData.append("blogId", data.blog);
            formData.append("blogTitle", data.blogTitle);
            formData.append("blogDescription", data.blogDescription);
            if (data.bgImage) {
                formData.append("image", data.bgImage);
            }
            dispatch(createPopularInsight(formData))
                .unwrap()
                .then(() => {
                    dispatch(fetchPopularInsights());
                    setShowForm(false);
                    setFormData({});
                });
        }
    };

    // Prepare dropdown options
    const blogOptions = blogs.map((blog) => ({
        value: blog._id || blog.id,
        label: blog.blogTitle || blog.title || blog.name || blog.heading || "Untitled Blog",
    }));

    const formFields = [
        {
            name: "blog",
            label: "Select Blog",
            type: "select",
            placeholder: "Select Blog",
            required: true,
            options: blogOptions,
            onChange: handleBlogSelection,
        },
        {
            name: "blogTitle",
            label: "Blog Title",
            type: "text",
            placeholder: "Enter Blog Title",
            required: true,
        },
        {
            name: "blogDescription",
            label: "Blog Description",
            type: "text",
            placeholder: "Enter Blog Description",
            required: true,
        },
        {
            name: "bgImage",
            label: "Bg Image",
            type: "file",
            placeholder: "Upload Background",
            required: !selectedInsight || (!formData.existingImage && !formData.bgImage),
            accept: "image/*",
        },
    ];

    // Memoize initial form values for update flow
    const initialFormValues = React.useMemo(() => {
        // For create flow, use formData state (which gets updated by blog selection)
        if (!selectedInsight) {
            return formData;
        }

        // For update flow, use formData state (which includes existing image info)
        return formData;
    }, [selectedInsight, formData]);

    const handleEdit = (insightId) => {
        dispatch(fetchInsightById(insightId))
            .unwrap()
            .then((data) => {
                setSelectedInsight(data);

                // Auto-populate form data for update scenario
                const raw = data.blogId ?? data.blog;
                let blogId = "";
                if (typeof raw === "string") {
                    blogId = raw;
                } else if (raw && (raw._id || raw.id)) {
                    blogId = raw._id || raw.id;
                }

                // If there's a blog selected, auto-populate from blog data
                if (blogId) {
                    const selectedBlog = blogs.find((blog) => (blog._id || blog.id) === blogId);
                    if (selectedBlog) {
                        setFormData({
                            blog: blogId,
                            blogTitle: data.blogTitle || selectedBlog.blogTitle || "",
                            blogDescription: data.blogDescription || selectedBlog.blogSubTitle || "",
                            bgImage: data.bigImage || null, // Preserve existing image
                            existingImage: data.bigImage, // Keep track of existing image
                        });
                    } else {
                        setFormData({
                            blog: blogId,
                            blogTitle: data.blogTitle || "",
                            blogDescription: data.blogDescription || "",
                            bgImage: data.bigImage || null, // Preserve existing image
                            existingImage: data.bigImage, // Keep track of existing image
                        });
                    }
                }

                setShowForm(true);
            });
    };

    const handleDelete = (insightId) => {
        if (!window.confirm("Delete this insight?")) return;
        dispatch(deletePopularInsight(insightId))
            .unwrap()
            .then(() => dispatch(fetchPopularInsights()));
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} width={1}>
            {/* Header: Title and Buttons */}
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%", mb: 2 }}>
                <Typography fontWeight="bold" fontSize="1rem" sx={{ flexGrow: 1, minWidth: 0 }}>
                    Most Popular Insights
                </Typography>
                <Box display="flex" gap={1} flexShrink={0}>
                    <AddButton onClick={handleAddNew} />
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
                        {displayInsights.map((insight, idx) => (
                            <Grid item key={insight._id || insight.id || idx} xs={12} sm={6} md={4} lg={2}>
                                <InsightCard
                                    blogDescription={insight.blogDescription}
                                    bigImage={insight.bigImage}
                                    onEdit={() => handleEdit(insight._id || insight.id)}
                                    onDelete={() => handleDelete(insight._id || insight.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Collapse>

            {/* EntityForm Modal */}
            <Modal
                open={showForm}
                onClose={() => {
                    setShowForm(false);
                    setSelectedInsight(null);
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
                    <EntityForm
                        title={selectedInsight ? "Update Popular Insight" : "Add Popular Insight"}
                        fields={formFields}
                        initialValues={initialFormValues}
                        onSubmit={handleCreateInsight}
                        onCancel={() => {
                            setShowForm(false);
                            setSelectedInsight(null);
                            setFormData({});
                        }}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default MostPopularInsights;
