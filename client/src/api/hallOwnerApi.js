import axios from 'axios';
import useAuthStore from '../hooks/useAuth';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: '/api/v1/hall-owner',
});

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const hallOwnerApi = {
  // Dashboard
  getDashboardStats: async () => {
    const res = await axiosInstance.get('/dashboard-stats');
    return res.data;
  },

  // Halls
  getHalls: async () => {
    const res = await axiosInstance.get('/halls');
    return res.data;
  },
  createHall: async (data) => {
    const res = await axiosInstance.post('/halls', data);
    return res.data;
  },
  addHall: async (data) => {
    const res = await axiosInstance.post('/halls', data);
    return res.data;
  },
  updateHall: async (id, data) => {
    const res = await axiosInstance.put(`/halls/${id}`, data);
    return res.data;
  },
  deleteHall: async (id) => {
    const res = await axiosInstance.delete(`/halls/${id}`);
    return res.data;
  },

  // Menus
  getMenus: async () => {
    const res = await axiosInstance.get('/menus');
    return res.data;
  },
  createMenu: async (data) => {
    const res = await axiosInstance.post('/menus', data);
    return res.data;
  },
  addMenu: async (data) => {
    const res = await axiosInstance.post('/menus', data);
    return res.data;
  },
  updateMenu: async (id, data) => {
    const res = await axiosInstance.put(`/menus/${id}`, data);
    return res.data;
  },
  deleteMenu: async (id) => {
    const res = await axiosInstance.delete(`/menus/${id}`);
    return res.data;
  },

  // Time Slots
  getTimeSlots: async () => {
    const res = await axiosInstance.get('/time-slots');
    return res.data;
  },
  createTimeSlot: async (data) => {
    const res = await axiosInstance.post('/time-slots', data);
    return res.data;
  },
  addTimeSlot: async (data) => {
    const res = await axiosInstance.post('/time-slots', data);
    return res.data;
  },
  updateTimeSlot: async (id, data) => {
    const res = await axiosInstance.put(`/time-slots/${id}`, data);
    return res.data;
  },
  deleteTimeSlot: async (id) => {
    const res = await axiosInstance.delete(`/time-slots/${id}`);
    return res.data;
  },

  // Event Types
  getEventTypes: async () => {
    const res = await axiosInstance.get('/event-types');
    return res.data;
  },
  addEventType: async (data) => {
    const res = await axiosInstance.post('/event-types', data);
    return res.data;
  },
  updateEventType: async (id, data) => {
    const res = await axiosInstance.put(`/event-types/${id}`, data);
    return res.data;
  },
  deleteEventType: async (id) => {
    const res = await axiosInstance.delete(`/event-types/${id}`);
    return res.data;
  },

  // Bookings
  getBookings: async () => {
    const res = await axiosInstance.get('/bookings');
    return res.data;
  },
  approveBooking: async (id) => {
    const res = await axiosInstance.patch(`/bookings/${id}/accept`);
    return res.data;
  },
  rejectBooking: async (id, reason = '') => {
    const res = await axiosInstance.patch(`/bookings/${id}/reject`, { reason });
    return res.data;
  },
  completeBooking: async (id) => {
    const res = await axiosInstance.patch(`/bookings/${id}/complete`);
    return res.data;
  },

  // Add-ons
  getAddOns: async () => {
    const res = await axiosInstance.get('/add-ons');
    return res.data;
  },
  addAddOn: async (data) => {
    const res = await axiosInstance.post('/add-ons', data);
    return res.data;
  },
  updateAddOn: async (id, data) => {
    const res = await axiosInstance.put(`/add-ons/${id}`, data);
    return res.data;
  },
  deleteAddOn: async (id) => {
    const res = await axiosInstance.delete(`/add-ons/${id}`);
    return res.data;  },

  // Image Upload
  uploadImages: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    const res = await axiosInstance.post('/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;  },
};

export default hallOwnerApi;
