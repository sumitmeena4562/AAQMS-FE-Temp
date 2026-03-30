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
      // 1. Get Tokens (Matching backend path api/auth/login/)
      const loginRes = await api.post("auth/login/", { email, password });
      const { access, refresh } = loginRes.data;

      // Handle "Remember Me"
      if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
      } else {
          localStorage.removeItem("rememberedEmail");
      }

      // 2. Temporarily save tokens to make the profile call possible
      localStorage.setItem("token", access);
      localStorage.setItem("refresh", refresh);

      // 3. IMMEDIATELY Fetch Profile to get user details/role
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
      // Using endpoint api/auth/profile/
      const { data } = await api.get("auth/profile/");
      const refresh = localStorage.getItem("refresh");
      
      // Normalize role for consistency
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
    
    // 1. Clear Local Session IMMEDIATELY for instant UI feedback
    storage.clearSession();
    set({ isAuthenticated: false, user: null, error: null });
    toast.success("Logged out successfully");

    // 2. Send Logout API in background (Pass token manually because storage is now empty)
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

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setError: (error) => set({ error }),
}));

export default useAuthStore;
