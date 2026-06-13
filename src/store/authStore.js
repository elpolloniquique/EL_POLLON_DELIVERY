import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  profile: null,
  loading: true,
  setProfile: (profile) => set({ profile, loading: false }),
  setLoading: (loading) => set({ loading }),
  clearProfile: () => set({ profile: null, loading: false }),
}));
