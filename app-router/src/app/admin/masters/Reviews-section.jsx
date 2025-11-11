"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Paper, Collapse, Button, Modal } from "@mui/material";
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Rating } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { editReview } from "../../../redux/masters/reviewSlice";
import { fetchLandingPageReviews, toggleReviewSelection } from "../../../redux/masters/webReviewSlice";
import { getReviewById } from "../../../api/masters/review";
import EntityForm from "@/components/shared/EntityForm";
import ReviewSelectionModal from "@/components/shared/ReviewSelectionModal";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../../../../config";
import { useAccess } from "@/utils/constants/accessContext";

// Action buttons (Edit/Delete)
const ActionButton = ({ Icon, onClick, label, ...props }) => (
    <IconButton onClick={onClick} aria-label={label} size="small" {...props}>
        <Icon sx={{ fontSize: 20, color: "#5A5D63" }} />
    </IconButton>
);

// Review Card
const ReviewCard = ({ clientName, rating, review: reviewText, onEdit, onDelete, isSelected }) => {
    const { isButtonDisabled } = useAccess();

    return (
        <Paper
            sx={{
                p: 1.5,
                borderRadius: 3,
                backgroundColor: isSelected ? "#e8f5e8" : "#f3f4f6",
                height: "100%",
                border: isSelected ? "2px solid #4caf50" : "none",
            }}
            elevation={1}
        >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography fontWeight={600}>{clientName}</Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <Rating value={rating} precision={0.5} readOnly size="small" />
                    </Box>
                </Box>
                <Box display="flex" gap={1}>
                    <ActionButton Icon={Edit} onClick={onEdit} label="Edit" disabled={isButtonDisabled("update")} />
                    <ActionButton Icon={Trash2} onClick={onDelete} label="Delete" disabled={isButtonDisabled("delete")} />
                </Box>
            </Box>
            <Typography variant="body2" mt={2} color="text.secondary">
                {reviewText}
            </Typography>
        </Paper>
    );
};

// Header + Cards Section
const ReviewsSection = () => {
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

    const [isExpanded, setIsExpanded] = useState(true);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingReview, setEditingReview] = useState(null);

    const handleToggleExpand = () => setIsExpanded((prev) => !prev);

    const dispatch = useDispatch();

    // Use landing page reviews as the main data source
    const reviews = useSelector((state) => state.webReview.data);
    const status = useSelector((state) => state.webReview.status);
    const error = useSelector((state) => state.webReview.error);

    // Fetch landing page reviews on mount
    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchLandingPageReviews());
        }
    }, [dispatch, status]);

    const formFields = [
        { name: "clientName", label: "Client Name", type: "text", required: true },
        { name: "image", label: "Client Image", type: "file", required: !editingReview, accept: "image/*" },
        {
            name: "rating",
            label: "Rating",
            type: "select",
            required: true,
            options: [1, 2, 3, 4, 5].map((n) => ({ value: n, label: n.toString() })),
        },
        { name: "review", label: "Review", type: "text", required: true },
    ];

    return (
        <Box width={1} display="flex" flexDirection="column" gap={2}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontSize="1rem" fontWeight="bold">
                    Reviews
                </Typography>
                <Box display="flex" gap={1}>
                    <Button
                        variant="outlined"
                        startIcon={<Plus className="w-5 h-5" />}
                        onClick={() => setShowSelectionModal(true)}
                        sx={{
                            textTransform: "none",
                            borderColor: "#ccc",
                            color: "#5A5D63",
                            backgroundColor: "white",
                            "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                        disabled={isButtonDisabled("create")}
                    >
                        Add New
                    </Button>
                    <IconButton onClick={handleToggleExpand} size="small">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </IconButton>
                </Box>
            </Box>

            {/* Cards */}
            <Collapse in={isExpanded}>
                {status === "loading" ? (
                    <Typography>Loading...</Typography>
                ) : status === "failed" ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <Box display="grid" gap={2} gridTemplateColumns={{ xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}>
                        {reviews.map((review) => (
                            <Box key={review.id}>
                                <ReviewCard
                                    {...review}
                                    isSelected={review.isSelected}
                                    onEdit={async () => {
                                        try {
                                            const res = await getReviewById(review.id);
                                            const reviewData = res.data?.data;
                                            // Prepare the review data with existing image for preview
                                            const imageField = reviewData.image || reviewData.clientImage;
                                            const editData = {
                                                ...reviewData,
                                                existingImage: imageField ? `${BASE_URL}/images/${imageField}` : null,
                                            };
                                            setEditingReview(editData);
                                            setShowEditModal(true);
                                        } catch (e) {
                                            console.error("Failed to fetch review details", e);
                                            toast.error("Failed to fetch review details");
                                        }
                                    }}
                                    onDelete={async () => {
                                        try {
                                            // Call select/deselect API to deselect the review
                                            await dispatch(toggleReviewSelection(review.id)).unwrap();
                                            toast.success("Review deselected from landing page");
                                            dispatch(fetchLandingPageReviews()); // Refresh the list
                                        } catch (err) {
                                            toast.error(typeof err === "string" ? err : err?.message || "Failed to deselect review");
                                        }
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                )}
            </Collapse>

            {/* Edit Modal */}
            <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                    }}
                >
                    <EntityForm
                        title="Edit Review"
                        initialValues={editingReview || {}}
                        fields={formFields}
                        onSubmit={async (data) => {
                            const formData = new FormData();
                            Object.entries(data).forEach(([k, v]) => formData.append(k, v));
                            try {
                                formData.append("reviewId", editingReview.id || editingReview._id);
                                await dispatch(editReview(formData)).unwrap();
                                toast.success("Review updated");
                                setShowEditModal(false);
                                dispatch(fetchLandingPageReviews()); // Refresh the list
                            } catch (err) {
                                toast.error(typeof err === "string" ? err : err?.message || "Operation failed");
                            }
                        }}
                        onCancel={() => {
                            setShowEditModal(false);
                            setEditingReview(null);
                        }}
                    />
                </Box>
            </Modal>

            {/* Review Selection Modal */}
            <ReviewSelectionModal
                open={showSelectionModal}
                onClose={() => setShowSelectionModal(false)}
                onSuccess={() => {
                    // Refresh landing page reviews after successful selection
                    dispatch(fetchLandingPageReviews());
                }}
            />
        </Box>
    );
};

export default ReviewsSection;
