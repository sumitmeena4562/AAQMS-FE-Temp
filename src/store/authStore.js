import { create } from "zustand";
import api from "../services/api";
import toast from "react-hot-toast";

/**
 * STORAGE HELPERS
 * Browser ki memory (LocalStorage) ke liye simple methods.
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

/**
 * Extract readable error message from API error response.
 */
const extractError = (err, fallback = "Something went wrong") => {
  const data = err.response?.data;
  if (!data) return err.message || fallback;
  
  // DRF returns { detail: "..." } for most errors
  if (data.detail) return data.detail;
  
  // Validation errors: { field: ["error1", "error2"] }
  if (typeof data === 'object') {
    const messages = Object.entries(data)
      .map(([key, val]) => {
        const msg = Array.isArray(val) ? val[0] : val;
        return key === 'non_field_errors' ? msg : `${key}: ${msg}`;
      });
    if (messages.length > 0) return messages[0];
  }
  
  return fallback;
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
  login: async ({ identifier, password, rememberMe }) => {
    set({ isLoading: true, error: null });

    try {
      // 1. Backend se Tokens le kar aana (Dual-compatibility payload)
      const { data } = await api.post("accounts/login/", { 
        email: identifier, // Required by current BE
        identifier,        // Required by future BE (Dual-Login)
        password 
      });

      // Agar rememberMe true hai toh email save karein
        if (rememberMe) {
            localStorage.setItem("rememberedEmail", identifier);
        } else {
            localStorage.removeItem("rememberedEmail");
        }
      
      // 2. Tokens ko save karna
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);

      // 3. User ka profile data fetch karna
      const profile = await api.get("accounts/profile/");
      const user = profile.data;

      // 4. Poore session ko save karna
      storage.saveSession(data.access, data.refresh, user);

      // 5. Global State update karna
      set({ isAuthenticated: true, user, isLoading: false });
      return { success: true, user };

    } catch (err) {
      const errorMsg = extractError(err, "Invalid email or password. Please try again.");
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * LOGOUT: Backend pe token blacklist karna aur session clear karna.
   */
  logout: async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        await api.post("accounts/logout/", { refresh });
      }
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout API failed:", err);
      toast.success("Logged out successfully"); // Still show success toast
    } finally {
      storage.clearSession();
      set({ isAuthenticated: false, user: null, error: null });
    }
  },

  /**
   * REGISTER: Naya account create karna.
   * Note: Backend endpoint 'accounts/register/' abhi implement hona baki hai.
   */
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      // Name split logic (Full Name -> First/Last)
      const names = userData.fullName.trim().split(/\s+/);
      const first_name = names[0];
      const last_name = names.slice(1).join(' ') || '';

      const payload = {
        first_name,
        last_name,
        email: userData.email,
        password: userData.password,
        role: userData.role
      };

      // Real API call (Assuming endpoint exists in future)
      // const response = await api.post("accounts/register/", payload);
      
      // For now, simulating success to showcase the flow
      await delay(1500);
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = extractError(err, "Registration failed. Please try again.");
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  // --- STATE HELPERS ---
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setError: (error) => set({ error }),

  // --- PASSWORD RECOVERY (Mocks) ---

  requestPasswordReset: async (email) => {
    set({ isLoading: true });
    try {
      await delay(1000);
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = "Failed to send reset link. Please try again.";
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
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
      const errorMsg = "Invalid OTP code. Please check and try again.";
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  resetPassword: async (email, password) => {
    set({ isLoading: true });
    try {
      await delay(1000);
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = "Password reset failed. Please try again.";
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },
}));

export default useAuthStore;
