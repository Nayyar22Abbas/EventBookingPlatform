import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      login: (userData, token) => {
        set({
          user: userData,
          token,
          isAuthenticated: true
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
      },

      // Getters
      getUser: () => get().user,
      getToken: () => get().token,
      getRole: () => get().user?.role,
      isAdmin: () => get().user?.role === 'admin',
      isHallOwner: () => get().user?.role === 'hall_owner',
      isCustomer: () => get().user?.role === 'customer'
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;