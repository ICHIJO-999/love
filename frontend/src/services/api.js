import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 認証関連のAPI
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  checkAuth: () => api.get('/auth/check'),
  getCurrentUser: () => api.get('/auth/me'),
};

// コンテンツ関連のAPI
export const contentAPI = {
  getArticles: () => api.get('/articles'),
  getArticle: (id) => api.get(`/articles/${id}`),
  getVideos: () => api.get('/videos'),
  getVideo: (id) => api.get(`/videos/${id}`),
  updateVideoProgress: (id, progress) => api.post(`/videos/${id}/progress`, { progress }),
  getUserProgress: () => api.get('/progress'),
};

// 管理者用API
export const adminAPI = {
  createArticle: (articleData) => api.post('/admin/articles', articleData),
  updateArticle: (id, articleData) => api.put(`/admin/articles/${id}`, articleData),
  deleteArticle: (id) => api.delete(`/admin/articles/${id}`),
};

export default api;


