"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../../redux/masters/reviewSlice";
import { toggleReviewSelection, clearToggleStatus } from "../../../redux/masters/webReviewSlice";
import { toast } from "react-hot-toast";

const ReviewSelectionModal = ({ open, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const { data: allReviews, status } = useSelector((state) => state.review);
    const { toggleStatus, toggleError } = useSelector((state) => state.webReview);

    const [selectedReviewId, setSelectedReviewId] = useState("");
    const [selectedReview, setSelectedReview] = useState(null);

    // Fetch all reviews when modal opens
    useEffect(() => {
        if (open && status === "idle") {
            dispatch(fetchReviews());
        }
    }, [open, status, dispatch]);

    // Handle toggle status changes
    useEffect(() => {
        if (toggleStatus === "succeeded") {
            toast.success("Review selected successfully");
            dispatch(clearToggleStatus());
            onSuccess?.(); // Call the success callback to refresh landing page reviews
            onClose();
        } else if (toggleStatus === "failed") {
            toast.error(toggleError || "Failed to update review selection");
            dispatch(clearToggleStatus());
        }
    }, [toggleStatus, toggleError, dispatch, onClose, onSuccess]);

    // Handle dropdown selection
    const handleReviewSelect = (reviewId) => {
        setSelectedReviewId(reviewId);
        const review = allReviews.find((r) => r.id === reviewId);
        setSelectedReview(review);
    };

    // Handle save (select review)
    const handleSave = () => {
        if (selectedReviewId) {
            dispatch(toggleReviewSelection(selectedReviewId));
        }
    };

    // Handle delete (deselect review)
    const handleDelete = () => {
        if (selectedReviewId) {
            dispatch(toggleReviewSelection(selectedReviewId));
        }
    };

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setSelectedReviewId("");
            setSelectedReview(null);
        }
    }, [open]);

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 w-full h-full bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
                {/* Modal Content */}
                <div className="bg-white rounded-lg shadow-xl w-full max-w-[720px] mx-auto" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                        {/* Choose Review Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Review</label>
                            <select
                                value={selectedReviewId}
                                onChange={(e) => handleReviewSelect(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                                disabled={status === "loading"}
                            >
                                <option value="">Choose Review</option>
                                {allReviews.map((review) => (
                                    <option key={review.id} value={review.id}>
                                        {review.clientName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Client Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Client name</label>
                                <input
                                    type="text"
                                    value={selectedReview?.clientName || ""}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                />
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                <input
                                    type="text"
                                    value={selectedReview?.rating || ""}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Review Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                            <textarea
                                value={selectedReview?.review || ""}
                                disabled
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 resize-none"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-start p-4 gap-2 border-t border-gray-200">
                        <button
                            onClick={handleSave}
                            disabled={!selectedReviewId || toggleStatus === "loading"}
                            className="px-16 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {toggleStatus === "loading" ? "Saving..." : "Add"}
                        </button>

                        <button
                            onClick={onClose}
                            disabled={toggleStatus === "loading"}
                            className="px-16 py-2 text-gray-700 border-1 border-black rounded-md hover:text-gray-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReviewSelectionModal;
