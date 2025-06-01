import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add a request interceptor to include token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle auth errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => axios.post('/api/auth/login', credentials),
  register: (userData) => axios.post('/api/auth/register', userData),
  getCurrentUser: () => axios.get('/api/auth/me'),
};

// Projects API
export const projectsAPI = {
  getProjects: () => axios.get('/api/projects'),
  getProjectById: (id) => axios.get(`/api/projects/${id}`),
  createProject: (projectData) => axios.post('/api/projects', projectData),
  updateProject: (id, projectData) => axios.put(`/api/projects/${id}`, projectData),
  deleteProject: (id) => axios.delete(`/api/projects/${id}`),
  getProjectStats: () => axios.get('/api/projects/stats'),
};

// Tasks API
export const tasksAPI = {
  getTasksByProject: (projectId) => axios.get(`/api/tasks?project=${projectId}`),
  createTask: (taskData) => axios.post('/api/tasks', taskData),
  updateTask: (id, taskData) => axios.put(`/api/tasks/${id}`, taskData),
  deleteTask: (id) => axios.delete(`/api/tasks/${id}`),
  assignTask: (id, userId) => axios.put(`/api/tasks/${id}/assign`, { assignee: userId }),
};

// Users API
export const usersAPI = {
  getUsers: () => axios.get('/api/users'),
  getUserById: (id) => axios.get(`/api/users/${id}`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () => axios.get('/api/notifications'),
  markAsRead: (id) => axios.put(`/api/notifications/${id}/read`),
  markAllAsRead: () => axios.put('/api/notifications/read-all'),
  getUnreadCount: () => axios.get('/api/notifications/unread-count'),
};

export default {
  auth: authAPI,
  projects: projectsAPI,
  tasks: tasksAPI,
  users: usersAPI,
  notifications: notificationsAPI,
};