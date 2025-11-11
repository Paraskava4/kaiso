import axiosInstance from '../../utils/axiosInstance';

export const resetPassword = async (data) => {
  try {
    const response = await axiosInstance.post('/resetPassword', data);
    return response.data;
  } catch (error) {
    // Return error object instead of throwing
    return {
      error: true,
      message: error?.response?.data?.message || "Failed to reset password. Please try again.",
      status: error?.response?.status || 500
    };
  }
}; 