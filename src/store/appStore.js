import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FALLBACK_SETTINGS } from '@/lib/constants';

export const useAppStore = create(
  persist(
    (set) => ({
      darkMode: false,
      settings: FALLBACK_SETTINGS,
      policies: {},
      categories: [],
      products: [],
      banners: [],
      zones: [],
      options: [],
      promotions: [],
      currentCategory: 'ofertas-familiares',
      searchTerm: '',
      loading: true,
      toast: null,

      setDarkMode: (darkMode) => {
        document.documentElement.classList.toggle('dark', darkMode);
        set({ darkMode });
      },

      toggleDarkMode: () =>
        set((s) => {
          const darkMode = !s.darkMode;
          document.documentElement.classList.toggle('dark', darkMode);
          return { darkMode };
        }),

      setAppData: (data) => set({ ...data, loading: false }),
      setCurrentCategory: (currentCategory) => set({ currentCategory }),
      setSearchTerm: (searchTerm) => set({ searchTerm }),

      showToast: (message) => {
        set({ toast: message });
        setTimeout(() => set({ toast: null }), 3000);
      },
    }),
    {
      name: 'pollon-app-v2',
      partialize: (s) => ({ darkMode: s.darkMode }),
    }
  )
);
