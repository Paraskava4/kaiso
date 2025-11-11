import axiosInstance from '../../utils/axiosInstance';

export const getLatestPublications = () => axiosInstance.get('/publication/getAll');

// Create a new latest publication
export const createLatestPublication = (data) =>
  axiosInstance.post('/publication/create', data);

// Get publication by ID
export const getPublicationById = (publicationId) =>
  axiosInstance.get('/publication/getById', { params: { publicationId } });

// Update publication
export const updateLatestPublication = (data) =>
  axiosInstance.put('/publication/update', data);

// Delete publication by ID
export const deleteLatestPublication = (publicationId) =>
  axiosInstance.delete('/publication/deletePublication', { params: { publicationId } });

// Get reports for Latest Publication dropdown - using web API
export const getReportsForPublication = async () => {
  try {
    const response = await axiosInstance.get('/web/getReport');
    return response;
  } catch (error) {
    return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
  }
};
