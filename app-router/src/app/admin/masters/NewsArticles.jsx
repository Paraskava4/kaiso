"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchNewsArticles,
    saveNewsArticleOrder,
    createNewsArticle,
    updateNewsArticleThunk,
    deleteNewsArticleThunk,
} from "../../../redux/masters/newsArticleSlice";
import { Box, Typography, IconButton, Paper, Button, Collapse, Modal } from "@mui/material";
import { Plus, ChevronUp, Edit, Trash2, GripVertical } from "lucide-react";
// New imports for add form modal
// import EntityForm from "../../../components/shared/EntityForm";
import axiosInstance from "../../../utils/axiosInstance";
import EntityForm from "@/components/shared/EntityForm";
import { format, isValid } from "date-fns";
import { useAccess } from "@/utils/constants/accessContext";
import toast from "react-hot-toast";

const NewsArticles = () => {
    const { isButtonDisabled } = useAccess();

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
    const articlesFromStore = useSelector((state) => state.newsArticle.data);
    const fetchStatus = useSelector((state) => state.newsArticle.status);

    // Local state for drag-and-drop visual feedback; initialised with store data.
    const [articles, setArticles] = useState([]);
    const [blogArticles, setBlogArticles] = useState([]);

    // Sync store data into local list once fetched/updated
    useEffect(() => {
        if (fetchStatus === "succeeded") {
            setArticles(articlesFromStore);
        }
    }, [articlesFromStore, fetchStatus]);

    // Custom function to fetch articles using the new API
    const fetchArticlesFromNewAPI = async () => {
        try {
            const response = await axiosInstance.get("/web/getArticle");
            const articleData = response.data?.data || [];
            setBlogArticles(articleData);
        } catch (error) {
            console.error("Error fetching articles:", error);
            setBlogArticles([]);
            // Only show toast error if it's not a network connectivity issue
            if (error?.response?.status !== 404 && !error?.message?.includes("Network Error")) {
                toast.error("Failed to fetch articles for dropdown");
            }
        }
    };

    // Fetch on mount
    useEffect(() => {
        if (fetchStatus === "idle") {
            dispatch(fetchNewsArticles());
        }
        // Fetch articles for select dropdown using new API
        fetchArticlesFromNewAPI();
    }, [dispatch, fetchStatus]);

    const [expanded, setExpanded] = useState(true);
    const [draggingId, setDraggingId] = useState(null);
    const [dragOverId, setDragOverId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [formData, setFormData] = useState({});
    const wrapperRef = useRef(null);

    const handleAddNew = () => {
        setSelectedArticle(null);
        setFormData({});
        setShowForm(true);
    };

    // Handle blog selection and auto-populate fields with image validation
    const handleBlogSelection = (blogId, currentFormData) => {
        const selectedArticle = blogArticles.find((article) => (article._id || article.id) === blogId);
        if (selectedArticle) {
            // Check if the selected article has an image
            if (!selectedArticle.image || selectedArticle.image === null) {
                toast.error("In That News Article You Don't Have Any Image. Please add image From Articles page before adding that");
                return currentFormData; // Don't update form data if no image
            }

            const updatedFormData = {
                ...currentFormData,
                blog: blogId,
                newsArticleTitle: selectedArticle.blogTitle || "",
                newsArticleDescription: selectedArticle.blogSubTitle || "",
                // User can still change these values after auto-population
            };
            setFormData(updatedFormData);
            return updatedFormData;
        }
        return currentFormData;
    };

    // helper to convert form values to API payload
    const mapToPayload = (data) => {
        const { blog, ...rest } = data;
        return { ...rest, blogId: blog };
    };

    const handleSubmitArticle = (formData) => {
        // Validate that the selected article has an image before submitting
        const selectedBlogArticle = blogArticles.find((article) => (article._id || article.id) === formData.blog);
        if (selectedBlogArticle && (!selectedBlogArticle.image || selectedBlogArticle.image === null)) {
            toast.error("In That News Article You Don't Have Any Image. Please add image From Articles page before adding that");
            return; // Don't proceed with submission
        }

        if (selectedArticle) {
            // Update existing news article
            const payload = { ...mapToPayload(formData), newsArticleId: selectedArticle._id || selectedArticle.id };
            dispatch(updateNewsArticleThunk(payload))
                .unwrap()
                .then(() => {
                    toast.success("News Article updated successfully!");
                    setShowForm(false);
                    setSelectedArticle(null);
                    setFormData({});
                    dispatch(fetchNewsArticles());
                })
                .catch((error) => {
                    // Handle backend validation errors
                    const errorMessage = error?.message || error || "Failed to update news article";
                    toast.error(errorMessage);
                });
        } else {
            // Create new news article
            dispatch(createNewsArticle(mapToPayload(formData)))
                .unwrap()
                .then(() => {
                    toast.success("News Article created successfully!");
                    setShowForm(false);
                    setFormData({});
                    dispatch(fetchNewsArticles());
                })
                .catch((error) => {
                    // Handle backend validation errors (like maximum 3 articles limit)
                    const errorMessage = error?.message || error || "Failed to create news article";
                    toast.error(errorMessage);
                });
        }
    };

    // Build select options for article dropdown using new API data
    const blogOptions = React.useMemo(
        () =>
            (blogArticles || []).map((article) => ({
                value: article._id || article.id,
                label: article.blogTitle || article.title || article.name || "Untitled Article",
            })),
        [blogArticles]
    );

    // Memoized initial values for both create and edit mode
    const initialValues = React.useMemo(() => {
        // For create flow, use formData state (which gets updated by article selection)
        if (!selectedArticle) {
            return formData;
        }

        // For update flow, use selectedArticle data
        const raw = selectedArticle.blogId ?? selectedArticle.blog;
        let blogId = "";
        if (typeof raw === "string") {
            blogId = raw;
        } else if (raw && (raw._id || raw.id)) {
            blogId = raw._id || raw.id;
        }

        // Validate that the selected article has an image for edit mode
        const selectedBlogArticle = blogArticles.find((article) => (article._id || article.id) === blogId);
        if (selectedBlogArticle && (!selectedBlogArticle.image || selectedBlogArticle.image === null)) {
            toast.error("In That News Article You Don't Have Any Image. Please add image From Articles page before adding that");
        }

        return {
            blog: blogId,
            newsArticleTitle: selectedArticle.newsArticleTitle || "",
            newsArticleDescription: selectedArticle.newsArticleDescription || "",
        };
    }, [selectedArticle, formData, blogArticles]);

    const formFields = [
        {
            name: "blog",
            label: "Choose News Article",
            type: "select",
            placeholder: "Select Blog",
            required: true,
            options: blogOptions,
            onChange: handleBlogSelection,
        },
        {
            name: "newsArticleTitle",
            label: "News Article Title",
            type: "text",
            placeholder: "Enter Title",
            required: true,
        },
        {
            name: "newsArticleDescription",
            label: "News Article Description",
            type: "text",
            placeholder: "Enter Description",
            required: true,
        },
    ];

    const toggleExpand = () => {
        setExpanded((prev) => !prev);
    };

    const handleDragStart = (id) => (e) => {
        setDraggingId(id);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", id.toString());
    };

    const handleDragOver = (e, id) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (id !== dragOverId) {
            setDragOverId(id);
        }
    };

    const handleDragLeave = () => {
        setDragOverId(null);
    };

    const handleDrop = (e, targetId) => {
        e.preventDefault();
        const sourceId = parseInt(e.dataTransfer.getData("text/plain"));

        if (sourceId !== targetId) {
            const sourceIndex = articles.findIndex((item) => item.id === sourceId);
            const targetIndex = articles.findIndex((item) => item.id === targetId);

            const newArticles = [...articles];
            const [removed] = newArticles.splice(sourceIndex, 1);
            newArticles.splice(targetIndex, 0, removed);

            setArticles(newArticles);
            // Persist new order to backend (array of ids in their new order)
            const idsArray = newArticles.map((item) => item._id || item.id);
            dispatch(saveNewsArticleOrder(idsArray))
                .unwrap()
                .then(() => {
                    toast.success("Article order updated successfully!");
                })
                .catch((error) => {
                    // Handle order save errors
                    const errorMessage = error?.message || error || "Failed to update article order";
                    toast.error(errorMessage);
                    // Revert the local state change if backend fails
                    setArticles(articles);
                });
        }

        setDragOverId(null);
        setDraggingId(null);
    };

    // Edit handler
    const handleEdit = (id) => {
        const art = articles.find((a) => a.id === id);
        if (!art) return;
        setSelectedArticle(art);
        setFormData({}); // Reset formData for edit mode
        setShowForm(true);
    };

    // Delete handler
    const handleDelete = (id) => {
        if (!window.confirm("Delete this news article?")) return;
        dispatch(deleteNewsArticleThunk(id))
            .unwrap()
            .then(() => {
                toast.success("News Article deleted successfully!");
            })
            .catch((error) => {
                // Handle backend deletion errors
                const errorMessage = error?.message || error || "Failed to delete news article";
                toast.error(errorMessage);
            });
    };

    const handleDragEnd = () => {
        setDragOverId(null);
        setDraggingId(null);
    };

    return (
        <Box p={0} width={1}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={3}>
                <Typography fontWeight="bold" fontSize="1rem">
                    News Articles
                </Typography>
                <Box display="flex" gap={0.5} alignItems="center">
                    <Button
                        onClick={handleAddNew}
                        variant="outlined"
                        startIcon={<Plus className="w-5 h-5" />}
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
                        disabled={isButtonDisabled("create")}
                    >
                        Add New
                    </Button>
                    <IconButton onClick={toggleExpand}>
                        <ChevronUp className="w-5 h-5"
                            sx={{
                                transform: expanded ? "rotate(0deg)" : "rotate(180deg)",
                                transition: "transform 0.2s",
                            }}
                        />
                    </IconButton>
                </Box>
            </Box>

            {/* Collapsible List */}
            <Collapse in={expanded}>
                <Box ref={wrapperRef} display="flex" flexDirection="column" gap={2}>
                    {articles.map((item, index) => {
                        const { id, _id, newsArticleTitle, newsArticleDescription, createdAt, type } = item;
                        const key = _id || id || index;
                        return (
                            <Paper
                                key={key}
                                elevation={0}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: "#F3F4F6",
                                    opacity: draggingId === id ? 0.5 : 1,
                                    transform: dragOverId === id ? "scale(1.02)" : "scale(1)",
                                    transition: "transform 0.2s, opacity 0.2s",
                                    border: dragOverId === id ? "2px dashed #1976d2" : "2px solid transparent",
                                }}
                                onDragOver={(e) => handleDragOver(e, id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, id)}
                            >
                                {/* Drag Handle - Now the only draggable element */}
                                <IconButton
                                    draggable
                                    onDragStart={handleDragStart(id)}
                                    onDragEnd={handleDragEnd}
                                    disabled={isButtonDisabled("update")}
                                    sx={{
                                        cursor: "grab",
                                        "&:active": {
                                            cursor: "grabbing",
                                        },
                                    }}
                                    aria-label="Drag"
                                >
                                    <GripVertical className="w-5 h-5" />
                                </IconButton>

                                {/* Article Content - Not draggable */}
                                <Box flex={1} display="flex" flexDirection="column" gap={1}>
                                    <Typography fontSize="1.125rem" fontWeight={500}>
                                        {newsArticleTitle}
                                    </Typography>
                                    <Typography fontSize="0.95rem" color="text.secondary">
                                        {newsArticleDescription}
                                    </Typography>
                                    <Box display="flex" gap={2} fontSize="0.9rem">
                                        <Typography color="primary">{type}</Typography>
                                        <Typography color="text.secondary">
                                            Published at {createdAt && isValid(new Date(createdAt)) ? format(new Date(createdAt), "dd MMM hh:MM") : "N/A"}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Action Icons */}
                                <Box display="flex" gap={1}>
                                    <IconButton aria-label="Edit" onClick={() => handleEdit(id)} disabled={isButtonDisabled("update")}>
                                        <Edit className="w-5 h-5" />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Delete"
                                        sx={{ color: "error.main" }}
                                        onClick={() => handleDelete(id)}
                                        disabled={isButtonDisabled("delete")}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </IconButton>
                                </Box>
                            </Paper>
                        );
                    })}
                </Box>
            </Collapse>

            {/* Add/Edit Modal */}
            <Modal
                open={showForm}
                onClose={() => {
                    setShowForm(false);
                    setSelectedArticle(null);
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
                        title={selectedArticle ? "Update News Article" : "Add News Article"}
                        fields={formFields}
                        initialValues={initialValues}
                        onSubmit={handleSubmitArticle}
                        onCancel={() => {
                            setShowForm(false);
                            setSelectedArticle(null);
                            setFormData({});
                        }}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default NewsArticles;
