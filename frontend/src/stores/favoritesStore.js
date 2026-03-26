import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (messageId, messageData) => {
        set((state) => {
          const exists = state.favorites.some((fav) => fav.id === messageId);
          if (exists) return state;
          return {
            favorites: [...state.favorites, { id: messageId, ...messageData }],
          };
        });
      },

      removeFavorite: (messageId) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== messageId),
        }));
      },

      isFavorite: (messageId) => {
        return get().favorites.some((fav) => fav.id === messageId);
      },

      getFavorites: () => {
        return get().favorites;
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'favorites-storage',
      version: 1,
    }
  )
);
