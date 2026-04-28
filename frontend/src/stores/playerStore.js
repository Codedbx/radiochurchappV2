import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthStore } from './authStore'
import { useAppStore } from './appStore'

export const usePlayerStore = create(
  persist(
    (set) => ({
      isLiveStream: true,
      currentMessage: null,
      isPlaying: false,
      
      setLiveStream: () => set({ isLiveStream: true, currentMessage: null, isPlaying: true }),
      
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      
      setCurrentMessage: (message) => {
        // Intercept playback: Ask user to login/signup if they aren't authenticated
        const { isLoggedIn } = useAuthStore.getState();
        if (!isLoggedIn) {
          useAppStore.getState().openAuthModal('login');
          return;
        }

        set({
          isLiveStream: false,
          currentMessage: message,
          isPlaying: true,
        });
      },
      
      resetPlayer: () => set({ isLiveStream: true, currentMessage: null }),
    }),
    {
      name: 'player-store',
    }
  )
)