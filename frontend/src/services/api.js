import axios from 'axios';

// Base URL del backend
const API_BASE_URL = 'http://localhost:5264/api';

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============ FRANCHISES ============
export const franchiseApi = {
  getAll: () => api.get('/franchises'),
  getById: (id) => api.get(`/franchises/${id}`),
  create: (data) => api.post('/franchises', data),
  update: (id, data) => api.put(`/franchises/${id}`, data),
  delete: (id) => api.delete(`/franchises/${id}`)
};

// ============ BRANCHES ============
export const branchApi = {
  getAll: (franchiseId) => {
    const params = franchiseId ? { franchiseId } : {};
    return api.get('/branches', { params });
  },
  getById: (id) => api.get(`/branches/${id}`),
  create: (data) => api.post('/branches', data),
  update: (id, data) => api.put(`/branches/${id}`, data),
  delete: (id) => api.delete(`/branches/${id}`)
};

// ============ PRODUCTS ============
export const productApi = {
  getAll: (branchId) => {
    const params = branchId ? { branchId } : {};
    return api.get('/products', { params });
  },
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  updateStock: (id, stock) => api.patch(`/products/${id}/stock`, { stock }),
  delete: (id) => api.delete(`/products/${id}`)
};

// ============ STATISTICS ============
export const statsApi = {
  getDashboard: async () => {
    try {
      const [franchises, branches, products] = await Promise.all([
        franchiseApi.getAll(),
        branchApi.getAll(),
        productApi.getAll()
      ]);
      
      return {
        totalFranchises: franchises.data.length,
        totalBranches: branches.data.length,
        totalProducts: products.data.length,
        recentFranchises: franchises.data.slice(0, 5)
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};

export default api;