import axios from 'axios';

// Base URL of the backend from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5264/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request (desarrollo)
if (import.meta.env.DEV) {
  api.interceptors.request.use(
    (config) => {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
      return config;
    },
    (error) => {
      console.error('❌ Request error:', error);
      return Promise.reject(error);
    }
  );
}

// Interceptor de response (desarrollo)
if (import.meta.env.DEV) {
  api.interceptors.response.use(
    (response) => {
      console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
      return response;
    },
    (error) => {
      console.error('❌ Response error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
}

// API Endpoints
export const franchiseApi = {
  getAll: () => api.get('/franchises'),
  getById: (id) => api.get(`/franchises/${id}`),
  create: (data) => api.post('/franchises', data),
  update: (id, data) => api.put(`/franchises/${id}`, data),
  delete: (id) => api.delete(`/franchises/${id}`),
};

export const branchApi = {
  getAll: (franchiseId) => api.get('/branches', { params: { franchiseId } }),
  getById: (id) => api.get(`/branches/${id}`),
  create: (data) => api.post('/branches', data),
  update: (id, data) => api.put(`/branches/${id}`, data),
  delete: (id) => api.delete(`/branches/${id}`),
};

export const productApi = {
  getAll: (branchId) => api.get('/products', { params: { branchId } }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  updateStock: (id, stock) => api.patch(`/products/${id}/stock`, { stock }),
  delete: (id) => api.delete(`/products/${id}`),
};

export const statsApi = {
  getDashboard: async () => {
    const [franchisesRes, branchesRes, productsRes] = await Promise.all([
      api.get('/franchises'),
      api.get('/branches'),
      api.get('/products')
    ]);

    return {
      data: {
        totalFranchises: franchisesRes.data.length,
        totalBranches: branchesRes.data.length,
        totalProducts: productsRes.data.length,
        recentFranchises: franchisesRes.data.slice(0, 5)
      }
    };
  }
};

export default api;
