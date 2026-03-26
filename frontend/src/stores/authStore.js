import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      isLoading: false,

      login: (email, password) => {
        set({ isLoading: true });
        // Simulate API call
        setTimeout(() => {
          const user = {
            id: Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0],
            email: email,
          };
          set({ isLoggedIn: true, user, isLoading: false });
        }, 800);
      },

      signup: (name, email, password) => {
        set({ isLoading: true });
        // Simulate API call
        setTimeout(() => {
          const user = {
            id: Math.random().toString(36).substr(2, 9),
            name: name,
            email: email,
          };
          set({ isLoggedIn: true, user, isLoading: false });
        }, 800);
      },

      logout: () => {
        set({ isLoggedIn: false, user: null });
      },

      checkSession: () => {
        // Session is automatically restored from localStorage by persist middleware
      },
    }),
    {
      name: 'auth-storage',
      version: 1,
    }
  )
);
