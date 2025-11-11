import axiosInstance from "../../utils/axiosInstance";

// Fetch all reviews with search support
export const getReviews = (page = 1, limit = 10, search = "") => {
    let url = `/review/getAll?page=${page}&limit=${limit}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    return axiosInstance
        .get(url)
        .then((response) => response)
        .catch((error) => {
            return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
        });
};

// Get review by id
export const getReviewById = (id) => axiosInstance.get(`/review/getById`, { params: { reviewId: id } });

// Create new review (expects FormData for image upload)
export const createReview = (formData) =>
    axiosInstance.post("/review/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response)
    .catch((error) => {
        return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    });

// Update review (expects FormData with reviewId)
export const updateReview = (formData) =>
    axiosInstance.put("/review/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response)
    .catch((error) => {
        return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    });

// Delete review by id
export const deleteReview = (id) => axiosInstance.delete(`/review/deleteReview`, { params: { reviewId: id } });
