import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 認証関連のAPI（モック実装）
export const authAPI = {
  login: (credentials) => {
    // モック実装：テスト用ログイン
    if (credentials.username === 'testuser' && credentials.password === 'password') {
      return Promise.resolve({
        data: {
          success: true,
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            role: 'admin',
            course: 'course1'
          },
          token: 'mock-jwt-token'
        }
      });
    } else {
      return Promise.reject({
        response: {
          data: { message: 'ユーザー名またはパスワードが間違っています' }
        }
      });
    }
  },
  register: (userData) => api.post('/auth/register', userData),
  logout: () => Promise.resolve({ data: { success: true } }),
  checkAuth: () => Promise.resolve({ 
    data: { 
      authenticated: false,
      user: null
    } 
  }),
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


