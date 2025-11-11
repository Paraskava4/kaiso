"use client";
import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import SearchHeader from "@/components/search/SearchHeader";
import CommonButton from "@/components/shared/CommonButton";
import { Box, Typography, IconButton, Paper, Rating, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addReview, editReview, removeReview } from "@/redux/masters/reviewSlice";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { fetchReviews } from "@/redux/masters/reviewSlice";
import { Edit, Trash2 } from "lucide-react";
import { getReviewById } from "@/api/masters/review";
import EntityForm from "@/components/shared/EntityForm";
import { useAccess } from "@/utils/constants/accessContext";

const ActionButton = ({ Icon, onClick, label, disabled }) => (
    <IconButton onClick={onClick} disabled={disabled} aria-label={label} size="small">
        <Icon sx={{ fontSize: 20, color: "#5A5D63" }} />
    </IconButton>
);

const ReviewCard = ({ clientName, rating, review: reviewText, onEdit, onDelete }) => {
    const { isButtonDisabled } = useAccess();
    return (
        <Paper sx={{ p: 1.5, borderRadius: 3, backgroundColor: "#f3f4f6", height: "100%" }} elevation={1}>
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

const Reviews = () => {
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [editingReview, setEditingReview] = useState(null);
    const [searchData, setSearchData] = useState("");
    const { isButtonDisabled } = useAccess();
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.review.data);
    const status = useSelector((state) => state.review.status);
    const total = useSelector((state) => state.review.total);
    const error = useSelector((state) => state.review.error);

    // Fetch reviews with search support
    useEffect(() => {
        dispatch(fetchReviews({ page: currentPage, limit: itemsPerPage, search: searchData }));
    }, [dispatch, currentPage, itemsPerPage, searchData]);

    // Reset pagination to page 1 when search changes
    useEffect(() => {
        if (searchData !== "") {
            setCurrentPage(1);
        }
    }, [searchData]);

    // Right side content of the page header
    const headerRight = (
        <div className="flex items-center gap-2">
            {/* Search box for server-side search */}
            <Box>
                <SearchHeader
                    searchTerm={searchData}
                    onSearchChange={(e) => {
                        setSearchData(e);
                    }}
                    onClear={() => {
                        setSearchData("");
                    }}
                />
            </Box>

            {/* Primary action button */}
            <CommonButton
                onClick={() => {
                    setEditingReview(null);
                    setShowForm(true);
                }}
                variant="primary"
                className="!w-[150px] !bg-red-500 !text-white hover:!bg-red-600"
                disabled={isButtonDisabled("create")}
            >
                Add New Review
            </CommonButton>
        </div>
    );

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Page header */}
            <PageHeader title="Reviews" rightContent={headerRight} />

            {/* Reviews grid */}
            {status === "loading" ? (
                <p>Loading...</p>
            ) : status === "failed" ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            {...review}
                            onEdit={async () => {
                                try {
                                    const res = await getReviewById(review.id);
                                    const reviewData = res.data?.data;
                                    // Prepare the review data with existing image for preview
                                    const imageField = reviewData.image || reviewData.clientImage;
                                    const editData = {
                                        ...reviewData,
                                        existingImage: imageField ? `${imageField}` : null,
                                    };
                                    setEditingReview(editData);
                                    setShowForm(true);
                                } catch (e) {
                                    console.error("Failed to fetch review details", e);
                                }
                            }}
                            onDelete={async () => {
                                try {
                                    await dispatch(removeReview(review.id)).unwrap();
                                    toast.success("Review deleted");
                                } catch (err) {
                                    toast.error(typeof err === "string" ? err : err?.message || "Failed to delete review");
                                }
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {/* <Pagination
                currentPage={currentPage}
                totalItems={total}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(size) => {
                    setItemsPerPage(size);
                    setCurrentPage(1);
                }}
            /> */}

            {/* Add/Edit Modal */}
            <Modal open={showForm} onClose={() => setShowForm(false)}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
                    <EntityForm
                        title={editingReview ? "Edit Review" : "Add Review"}
                        initialValues={editingReview || {}}
                        fields={[
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
                        ]}
                        onSubmit={async (data) => {
                            const formData = new FormData();
                            Object.entries(data).forEach(([k, v]) => formData.append(k, v));
                            try {
                                if (editingReview) {
                                    formData.append("reviewId", editingReview.id || editingReview._id);
                                    await dispatch(editReview(formData)).unwrap();
                                    toast.success("Review updated");
                                } else {
                                    await dispatch(addReview(formData)).unwrap();
                                    toast.success("Review added");
                                }
                                setShowForm(false);
                            } catch (err) {
                                toast.error(typeof err === "string" ? err : err?.message || "Operation failed");
                            }
                        }}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingReview(null);
                        }}
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default Reviews;
