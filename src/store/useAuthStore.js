import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const useAuthStore = create((set) => ({
  user: null,
  userData: null, // Conterrà il documento Firestore (incluso birthDate)
  isLoading: true,
  activeSharedCalendarId: null,

  setUser: (user) => set({ user }),
  setUserData: (userData) => set({ userData }),
  setLoading: (isLoading) => set({ isLoading }),
  setActiveSharedCalendarId: (id) => set({ activeSharedCalendarId: id }),

  fetchUserData: async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ userData: docSnap.data() });
      }
    } catch (error) {
      console.error("Errore fetch userData:", error);
    }
  },
}));
