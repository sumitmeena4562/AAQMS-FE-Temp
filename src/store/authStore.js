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
  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });

    // --- 0. MOCK BYPASS (Temporary for testing) ---
    if (email === 'admin@aaqms.com' && password === 'Admin@123') {
      const mockUser = { id: 1, name: "Demo Admin", email: "admin@demo.com", role: "admin" };
      storage.saveSession("mock_access", "mock_refresh", mockUser);
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
      return { success: true, user: mockUser };
    }

    try {
      // 1. Backend se Tokens le kar aana
      const { data } = await api.post("/accounts/api/login/", { email, password });
      
      // 2. User ka profile data fetch karna
      const profile = await api.get("/accounts/profile/");
      const user = profile.data;

      // 3. Tokens aur Profile ko browser memory mein save karna
      storage.saveSession(data.access, data.refresh, user);

      // 4. Global State update karna
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
