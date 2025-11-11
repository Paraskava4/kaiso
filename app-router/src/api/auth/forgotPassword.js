import axiosInstance from '../../utils/axiosInstance';

export const sendForgotPasswordEmail = async (email) => {
  try {
    const response = await axiosInstance.post('/sendEmail', { email });
    return response.data;
  } catch (error) {
    // Return error object instead of throwing
    return {
      error: true,
      message: error?.response?.data?.message || "Failed to send email. Please try again.",
      status: error?.response?.status || 500
    };
  }
}; 