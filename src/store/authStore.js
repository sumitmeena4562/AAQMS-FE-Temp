import { create } from "zustand";
import api from "../services/api";
import toast from "react-hot-toast";

/**
 * STORAGE HELPERS
 */
const storage = {
  getToken: () => localStorage.getItem("token"),
  getRefresh: () => localStorage.getItem("refresh"),
  getUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },
  saveSession: (token, refresh, user) => {
    if (token) localStorage.setItem("token", token);
    if (refresh) localStorage.setItem("refresh", refresh);
    if (user) localStorage.setItem("user", JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  }
};

import { extractError } from "../utils/errorUtils";

const useAuthStore = create((set, get) => ({
  // --- INITIAL STATE ---
  isAuthenticated: !!storage.getToken(),
  user: storage.getUser() || null,
  isLoading: false,
  isBootstrapping: !!storage.getToken() && !storage.getUser(), 
  error: null,

  // --- ACTIONS ---

  /**
   * LOGIN: Backend se tokens lena, fir profile fetch karna.
   */
  login: async ({ email, password, rememberMe }) => {
    set({ isLoading: true, error: null });

    try {
      const loginRes = await api.post("users/login/", { email, password });
      const { access, refresh } = loginRes.data;

      if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
      } else {
          localStorage.removeItem("rememberedEmail");
      }

      localStorage.setItem("token", access);
      localStorage.setItem("refresh", refresh);

      const profileResult = await get().fetchProfile();
      
      if (profileResult.success) {
          set({ isLoading: false });
          return { success: true, user: profileResult.user };
      } else {
          throw new Error("Could not load user profile after login.");
      }

    } catch (err) {
      storage.clearSession();
      // Specialized mapping for Login to be extra human-friendly
      const errorMsg = extractError(err, "Invalid email or password. Please check your credentials.");
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * FETCH PROFILE: User ka role aur details backend se lana.
   */
  fetchProfile: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        set({ isAuthenticated: false, user: null, isBootstrapping: false, isLoading: false });
        return { success: false };
    }

    set({ isBootstrapping: true, error: null });
    try {
      const { data } = await api.get("users/profile/");
      const refresh = localStorage.getItem("refresh");
      
      const userData = { ...data, role: (data.role || '').toLowerCase() };
      storage.saveSession(token, refresh, userData);

      set({ 
        user: userData, 
        isAuthenticated: true, 
        isBootstrapping: false,
        isLoading: false 
      });
      return { success: true, user: userData };
    } catch (err) {
      storage.clearSession();
      set({ 
        isAuthenticated: false, 
        user: null, 
        isBootstrapping: false,
        isLoading: false,
        error: "Session expired"
      });
      return { success: false, error: "Session expired" };
    }
  },

  /**
   * LOGOUT: Token blacklist karna aur state saaf karna.
   */
  logout: async () => {
    const token = localStorage.getItem("token");
    const refresh = localStorage.getItem("refresh");
    
    if (refresh && token) {
      try {
        await api.post("users/logout/", 
          { refresh },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Logout API failed (background):", err);
      }
    }

    storage.clearSession();
    set({ isAuthenticated: false, user: null, error: null });
    toast.success("Logged out successfully");
  },

  /**
   * REGISTER: Naya account create karna.
   */
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const names = userData.fullName.trim().split(/\s+/);
      const payload = {
        name: userData.fullName,
        first_name: names[0],
        last_name: names.slice(1).join(' ') || '',
        email: userData.email,
        password: userData.password,
        role: userData.role
      };

      await api.post("users/register/", payload);
      
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      // Clean up registration errors (e.g. "Email: Already exists" -> "This email is already in use")
      let errorMsg = extractError(err, "Registration failed. Please verify your details.");
      if (errorMsg.toLowerCase().includes("already exists")) {
          errorMsg = "An account with this email already exists. Please sign in instead.";
      }
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  // --- PASSWORD RECOVERY ---

  requestPasswordReset: async (email) => {
    set({ isLoading: true });
    try {
      await api.post("users/request-reset/", { email });
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = extractError(err, "Failed to send reset link. Please check your email.");
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  verifyOtp: async (email, otp) => {
    set({ isLoading: true });
    try {
      await api.post("users/verify-otp/", { email, otp });
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = extractError(err, "Invalid or expired OTP code.");
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  resetPassword: async (email, otp, password) => {
    set({ isLoading: true });
    try {
      await api.post("users/reset-password/", { email, otp, password });
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = extractError(err, "Password reset failed.");
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setError: (error) => set({ error }),
}));

export default useAuthStore;
