import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getMe: () => api.get('/auth/me'),
  getUsers: () => api.get('/auth/users'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
};

// Leads API
export const leadsAPI = {
  getAll: (filters) => api.get('/leads', { params: filters }),
  getOne: (id) => api.get(`/leads/${id}`),
  getNotes: (id) => api.get(`/leads/${id}/notes`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  addNote: (id, content) => api.post(`/leads/${id}/notes`, { content }),
  getDashboardStats: () => api.get('/leads/dashboard/stats'),
  getUsers: () => api.get('/leads/users'),
};

export default api;
