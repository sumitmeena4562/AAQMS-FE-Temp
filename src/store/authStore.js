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

/**
 * Extract readable error message from API error response.
 */
const extractError = (err, fallback = "Connection error. Please try again.") => {
  const data = err.response?.data;
  if (!data) return err.message || fallback;
  
  if (data.detail) return data.detail;
  if (data.non_field_errors) return data.non_field_errors[0];
  
  if (typeof data === 'object') {
    const messages = Object.entries(data)
      .map(([key, val]) => {
        const msg = Array.isArray(val) ? val[0] : val;
        const readableKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `${readableKey}: ${msg}`;
      });
    if (messages.length > 0) return messages[0];
  }
  
  return fallback;
};

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
      const loginRes = await api.post("auth/login/", { email, password });
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
      const errorMsg = extractError(err, "Invalid email or password.");
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
      const { data } = await api.get("auth/profile/");
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
    
    storage.clearSession();
    set({ isAuthenticated: false, user: null, error: null });
    toast.success("Logged out successfully");

    if (refresh && token) {
      try {
        await api.post("auth/logout/", 
          { refresh },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Logout API failed (background):", err);
      }
    }
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

      // Mock delay to showcase flow since backend register is coming soon
      await new Promise(r => setTimeout(r, 1000));
      // await api.post("auth/register/", payload);
      
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = extractError(err, "Registration failed. Please try again.");
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  // --- PASSWORD RECOVERY ---

  requestPasswordReset: async (email) => {
    set({ isLoading: true });
    try {
      await api.post("auth/request-reset/", { email });
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = extractError(err, "Failed to send reset link.");
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  verifyOtp: async (email, otp) => {
    set({ isLoading: true });
    try {
      await api.post("auth/verify-otp/", { email, otp });
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
      await api.post("auth/reset-password/", { email, otp, password });
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
