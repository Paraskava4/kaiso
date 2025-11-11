import axiosInstance from '../../utils/axiosInstance';

/**
 * Fetch list of inquiries
 * @param {number} page - page number (1-indexed)
 * @param {number} limit - page size
 */
export const getInquiries = () =>
  axiosInstance.get('/inquiry/getAll?limit=10');
