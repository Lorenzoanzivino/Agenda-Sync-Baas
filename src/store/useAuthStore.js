import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  activeSharedCalendarId: null, // Nuovo stato per il calendario condiviso

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setActiveSharedCalendarId: (id) => set({ activeSharedCalendarId: id }),
}));
