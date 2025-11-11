import axiosInstance from '../utils/axiosInstance';

/**
 * Fetch all admin users
 * @returns {Promise<AxiosResponse>}
 */
export const getAllAdmins = () => {
  return axiosInstance.get('/admin/getAllAdmin');
};

/**
 * Fetch all admin users with pagination
 * @param {number} page - page number (1-indexed)
 * @param {number} limit - page size
 * @returns {Promise<AxiosResponse>}
 */
export const getAllAdminsPaginated = (page = 1, limit = 10) => {
  return axiosInstance.get(`/admin/getAll?page=${page}&limit=${limit}`);
};

/**
 * Change admin status
 * @param {string} userId - User ID to change status
 * @returns {Promise<AxiosResponse>}
 */
export const changeAdminStatus = (userId) => {
  return axiosInstance.post(`/admin/statusChange?userId=${userId}`);
};

/**
 * Create new admin (for future use)
 * @param {Object} data - Admin data
 * @returns {Promise<AxiosResponse>}
 */
export const createAdmin = (data) => {
  return axiosInstance.post('/admin/create', data);
};

/**
 * Update admin (for future use)
 * @param {Object} data - Admin data
 * @returns {Promise<AxiosResponse>}
 */
export const updateAdmin = (data) => {
  return axiosInstance.put('/admin/update', data);
};

/**
 * Get admin by ID
 * @param {string} userId - User ID to fetch
 * @returns {Promise<AxiosResponse>}
 */
export const getAdminById = (userId) => {
  return axiosInstance.get(`/admin/getById?userId=${userId}`);
};

/**
 * Delete admin (for future use)
 * @param {string} userId - User ID to delete
 * @returns {Promise<AxiosResponse>}
 */
export const deleteAdmin = (userId) => {
  return axiosInstance.delete(`/admin/deleteAdmin?userId=${userId}`);
};
