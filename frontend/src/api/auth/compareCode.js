import axiosInstance from '../../utils/axiosInstance';

export const compareCode = async (data) => {
  try {
    const response = await axiosInstance.post('/compareCode', data);
    return response.data;
  } catch (error) {
    // Return error object instead of throwing
    return {
      error: true,
      message: error?.response?.data?.message || "Failed to verify code. Please try again.",
      status: error?.response?.status || 500
    };
  }
}; 