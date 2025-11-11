import axiosInstance from "../../utils/axiosInstance";

// Fetch landing page data and extract reviews
export const getLandingPageReviews = () => {
    return axiosInstance
        .get("/web/landingPage")
        .then((response) => {
            // Extract reviews from landing page data
            const reviews = response.data?.data?.reviews || [];
            return { ...response, data: { ...response.data, data: reviews } };
        })
        .catch((error) => {
            return {
                error: true,
                message: error?.response?.data?.message || error.message || 'API error',
                status: error?.response?.status || 500
            };
        });
};

// Select or deselect a review for landing page
export const selectDeselectReview = (reviewId) => {
    return axiosInstance
        .put(`/review/selectOrDeselect?reviewId=${reviewId}`)
        .then((response) => response)
        .catch((error) => {
            return { 
                error: true, 
                message: error?.response?.data?.message || error.message || 'API error', 
                status: error?.response?.status || 500 
            };
        });
};
