import axiosInstance from '../../utils/axiosInstance';

// Fetch all news articles
export const getNewsArticles = () =>
  axiosInstance.get('/newsArticle/getAll')
    .then(response => response)
    .catch(error => {
      return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    });

// Create news article
export const createNewsArticle = (data) =>
  axiosInstance.post('/newsArticle/create', data);

// Get single news article by id
export const getNewsArticleById = (id) =>
  axiosInstance.get(`/newsArticle/getById`, { params: { newsArticleId: id } });

// Update news article
export const updateNewsArticle = (data) =>
  axiosInstance.put('/newsArticle/update', data);

// Delete news article
export const deleteNewsArticle = (id) =>
  axiosInstance.delete(`/newsArticle/deleteNewsArticle`, { params: { newsArticleId: id } });

// Update the order (index) of news articles
export const updateNewsArticleOrder = (data) => {
  if (!data || !Array.isArray(data.newsArticleIds)) {
    return Promise.reject(new Error('Invalid data provided for reordering'));
  }
  return axiosInstance.put('/newsArticle/updateIndex', data)
    .then(response => response)
    .catch(error => {
      return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    });
};
