import axiosInstance from '../../utils/axiosInstance';

export const getPopularInsights = () => axiosInstance.get('/insight/getAll');

// Create a new popular insight
export const createPopularInsight = (data) => axiosInstance.post('/insight/create', data);

// Get insight by ID
export const getInsightById = (insightId) => axiosInstance.get('/insight/getById', { params: { insightId } });

// Update insight
export const updatePopularInsight = (data) => {
  // Check if data is FormData (for file uploads)
  const config = data instanceof FormData ? {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  } : {};

  return axiosInstance.put('/insight/update', data, config);
};

// Delete insight by ID
export const deletePopularInsight = (insightId) => axiosInstance.delete('/insight/deleteInsight', { params: { insightId } });
