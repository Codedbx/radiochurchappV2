import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePlayerStore = create(
  persist(
    (set) => ({
      isLiveStream: true,
      currentMessage: null,
      
      setLiveStream: () => set({ isLiveStream: true, currentMessage: null }),
      
      setCurrentMessage: (message) =>
        set({
          isLiveStream: false,
          currentMessage: message,
        }),
      
      resetPlayer: () => set({ isLiveStream: true, currentMessage: null }),
    }),
    {
      name: 'player-store',
    }
  )
)