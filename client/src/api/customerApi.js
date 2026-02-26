import axios from 'axios';
import useAuthStore from '../hooks/useAuth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Get axios instance with authorization header
const getAxiosInstance = () => {
  const token = useAuthStore.getState().token;
  return axios.create({
    baseURL: API_BASE,
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
};

const customerApi = {
  getDashboardStats: async () => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.get('/customer/dashboard-stats');
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load dashboard stats' };
    }
  },

  searchHalls: async (filters) => {
    try {
      const axiosInstance = getAxiosInstance();
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.capacity) params.append('maxCapacity', filters.capacity);
      if (filters.price) params.append('maxPrice', filters.price);
      if (filters.functionType) params.append('functionType', filters.functionType);
      if (filters.date) params.append('date', filters.date);
      if (filters.amenities) params.append('amenities', filters.amenities);

      const res = await axiosInstance.get(`/customer/halls?${params.toString()}`);
      return res.data.halls || res.data || [];
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search halls' };
    }
  },

  getHallDetails: async (hallId) => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.get(`/customer/halls/${hallId}`);
      return res.data.hall || res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load hall details' };
    }
  },

  getHallTimeSlots: async (hallId, date) => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.get(`/customer/halls/${hallId}/time-slots`, {
        params: { date }
      });
      return res.data.timeSlots || res.data || [];
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load time slots' };
    }
  },

  makeBooking: async (bookingData) => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.post('/customer/bookings', bookingData);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create booking' };
    }
  },

  getBookings: async () => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.get('/customer/bookings');
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load bookings' };
    }
  },

  submitReview: async (reviewData) => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.post('/customer/reviews', reviewData);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit review' };
    }
  },

  getReviews: async (hallId) => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.get(`/customer/halls/${hallId}/reviews`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load reviews' };
    }
  },

  getBookingDetails: async (bookingId) => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.get(`/customer/bookings/${bookingId}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load booking details' };
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.patch(`/customer/bookings/${bookingId}/cancel`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel booking' };
    }
  },

  calculatePrice: async (hallId, functionType, guestCount, menuId) => {
    try {
      const axiosInstance = getAxiosInstance();
      const payload = {
        hallId,
        functionType,
        guestCount
      };
      if (menuId) {
        payload.menuId = menuId;
      }
      const res = await axiosInstance.post('/customer/calculate-price', payload);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to calculate price' };
    }
  },

  getBookings: async () => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.get('/customer/bookings');
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load bookings' };
    }
  },

  submitReview: async (hallId, bookingId, rating, comment) => {
    try {
      const axiosInstance = getAxiosInstance();
      const payload = {
        hallId,
        bookingId,
        rating,
        comment
      };
      const res = await axiosInstance.post('/customer/reviews', payload);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit review' };
    }
  },

  getMyReviews: async () => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.get('/customer/reviews');
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load reviews' };
    }
  },

  deleteReview: async (reviewId) => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.delete(`/customer/reviews/${reviewId}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete review' };
    }
  }
};

export default customerApi;