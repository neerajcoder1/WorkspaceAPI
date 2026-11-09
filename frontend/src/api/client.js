import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT access token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('worksphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Intercept 401 unauthorized responses (expired tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('worksphere_token');
        localStorage.removeItem('worksphere_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const workspaceAPI = {
  list: () => api.get('/workspaces'),
  get: (id) => api.get(`/workspaces/${id}`),
  create: (data) => api.post('/workspaces', data),
  update: (id, data) => api.put(`/workspaces/${id}`, data),
  delete: (id, confirmation = 'DELETE') =>
    api.delete(`/workspaces/${id}`, { data: { confirmation } }),
  getMembers: (id) => api.get(`/workspaces/${id}/members`),
  addMember: (id, memberData) => api.post(`/workspaces/${id}/members`, memberData),
  getActivities: (id, params) => api.get(`/workspaces/${id}/activities`, { params }),
};

export const projectAPI = {
  list: (workspaceId, params) =>
    api.get(`/workspaces/${workspaceId}/projects`, { params }),
  get: (workspaceId, projectId) =>
    api.get(`/workspaces/${workspaceId}/projects/${projectId}`),
  create: (workspaceId, data) =>
    api.post(`/workspaces/${workspaceId}/projects`, data),
  update: (workspaceId, projectId, data) =>
    api.put(`/workspaces/${workspaceId}/projects/${projectId}`, data),
  delete: (workspaceId, projectId) =>
    api.delete(`/workspaces/${workspaceId}/projects/${projectId}`),
};

export const taskAPI = {
  listByProject: (workspaceId, projectId, params) =>
    api.get(`/workspaces/${workspaceId}/projects/${projectId}/tasks`, { params }),
  get: (taskId) => api.get(`/tasks/${taskId}`),
  create: (workspaceId, projectId, data) =>
    api.post(`/workspaces/${workspaceId}/projects/${projectId}/tasks`, data),
  update: (taskId, data) => api.put(`/tasks/${taskId}`, data),
  updateStatus: (taskId, status) => api.patch(`/tasks/${taskId}/status`, { status }),
  delete: (taskId) => api.delete(`/tasks/${taskId}`),
  getMyAssigned: () => api.get('/tasks/my'),
  getComments: (taskId) => api.get(`/tasks/${taskId}/comments`),
  addComment: (taskId, comment) => api.post(`/tasks/${taskId}/comments`, { comment }),
};

export default api;
