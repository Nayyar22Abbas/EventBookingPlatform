import axios from 'axios';
import useAuthStore from '../hooks/useAuth';

// Create axios instance
const adminApi = axios.create({
  baseURL: '/api/v1/admin',
});

// Request interceptor to add Authorization header
adminApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// TODO: Add auto refresh token interceptor if needed

// Dashboard stats
export const getDashboardStats = () => adminApi.get('/dashboard-stats');

// Pending Hall Owners
export const getPendingHallOwners = () => adminApi.get('/hall-owners/pending');
export const approveHallOwner = (id) => adminApi.patch(`/hall-owners/${id}/approve`);
export const rejectHallOwner = (id) => adminApi.patch(`/hall-owners/${id}/reject`);

// Enquiries
export const getEnquiries = (status) => adminApi.get('/enquiries', { params: status ? { status } : {} });
export const respondToEnquiry = (id, data) => adminApi.patch(`/enquiries/${id}/respond`, data);
export const closeEnquiry = (id) => adminApi.patch(`/enquiries/${id}/close`);

// Halls
export const getAllHalls = () => adminApi.get('/halls');
export const deleteHall = (id) => adminApi.delete(`/halls/${id}`);

export default adminApi;
