import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set) => ({
      currentPage: 'home', // 'home', 'messages', 'profile'
      isAuthModalOpen: false,
      authModalMode: 'login', // 'login' or 'signup'

      setCurrentPage: (page) => set({ currentPage: page }),
      setPage: (page) => set({ currentPage: page }),
      openAuthModal: (mode = 'login') =>
        set({ isAuthModalOpen: true, authModalMode: mode }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      setAuthModalMode: (mode) => set({ authModalMode: mode }),
    }),
    {
      name: 'app-store',
    }
  )
)
