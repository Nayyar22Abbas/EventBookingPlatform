import axios from 'axios';
import useAuthStore from '../hooks/useAuth';

// Create axios instance for auth API
const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
authApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Login user
  login: async (data) => {
    try {
      const response = await authApi.post('/auth/login', data);
      const { accessToken, user } = response.data;

      // Store in Zustand store
      useAuthStore.getState().login(user, accessToken);

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register user
  register: async (data) => {
    try {
      const response = await authApi.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Refresh token (uses httpOnly cookie automatically)
  refreshToken: async () => {
    try {
      const response = await authApi.post('/auth/refresh');
      const { accessToken, user } = response.data;

      // Update token in store
      useAuthStore.getState().login(user, accessToken);

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await authApi.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
    } finally {
      // Clear local state
      useAuthStore.getState().logout();
    }
  },

  // Google OAuth login
  googleLogin: (role = 'customer') => {
    window.location.href = `http://localhost:5000/api/v1/auth/google?role=${role}`;
  },

  // Update user role
  updateRole: async (role) => {
    try {
      const response = await authApi.post('/auth/update-role', { role });
      const { user } = response.data;

      // Update user in store
      useAuthStore.getState().updateUser(user);

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default authAPI;