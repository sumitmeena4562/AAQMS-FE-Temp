import { create } from "zustand";
import api from "../services/api";

/**
 * STORAGE HELPERS
 * Browser ki memory (LocalStorage) ke liye simple methods taaki repetitive code na likhna pade.
 */
const storage = {
  getToken: () => localStorage.getItem("token"),
  getUser: () => JSON.parse(localStorage.getItem("user")),
  saveSession: (token, refresh, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("user", JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const useAuthStore = create((set) => ({
  // --- INITIAL STATE ---
  isAuthenticated: !!storage.getToken(),
  user: storage.getUser() || null,
  isLoading: false,
  error: null,

  // --- ACTIONS ---

  /**
   * LOGIN: Backend se authenticate hona aur session save karna.
   */
  login: async ({ email, password, rememberMe }) => {
    set({ isLoading: true, error: null });

    try {
      // 1. Backend se Tokens le kar aana (baseURL is /api)
      const { data } = await api.post("accounts/login/", { email, password });

      // Agar rememberMe true hai toh email save karein, warna remove karein
        if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
        } else {
            localStorage.removeItem("rememberedEmail");
        }
      
      // 2. Tokens ko temporarily save karna taaki profile fetch authenticated ho
      // Hamare api.js interceptors localStorage se token read karte hain
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);

      // 3. User ka profile data fetch karna
      const profile = await api.get("accounts/profile/");
      const user = profile.data;
      console.log(profile.data);
      

      // 4. Poore session ko save karna (including user info)
      storage.saveSession(data.access, data.refresh, user);

      // 5. Global State update karna
      set({ isAuthenticated: true, user, isLoading: false });
      return { success: true, user };

    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || "Login failed";
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * LOGOUT: Session clear karna aur state reset karna.
   */
  logout: () => {
    storage.clearSession();
    set({ isAuthenticated: false, user: null, error: null });
  },

  // --- STATE HELPERS ---
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setError: (error) => set({ error }),

  // --- PASSWORD RECOVERY (Mocks) ---

  requestPasswordReset: async (email) => {
    set({ isLoading: true });
    try {
      await delay(1000); // Simulate network
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return { success: false };
    }
  },

  verifyOtp: async (email, otp) => {
    set({ isLoading: true });
    try {
      await delay(1000);
      if (otp !== "123456") throw new Error("Invalid OTP");
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return { success: false };
    }
  },

  resetPassword: async (email, password) => {
    set({ isLoading: true });
    try {
      await delay(1000);
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return { success: false };
    }
  },
}));

export default useAuthStore;
