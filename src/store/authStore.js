import { create } from "zustand";
import api from "../services/api";
import toast from "react-hot-toast";

/**
 * STORAGE HELPERS
 * Only for non-sensitive data like user profile info.
 */
const storage = {
  getUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },
  saveUser: (user) => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem("user");
  }
};

import { extractError } from "../utils/errorUtils";

const useAuthStore = create((set, get) => ({
  // --- INITIAL STATE ---
  isAuthenticated: false, // Initially false, verified during bootstrap
  user: storage.getUser() || null,
  isLoading: false,
  isBootstrapping: true, // Start as true to check cookie session
  isLoggingOut: false, // Prevents immediate re-bootstrap on manual logout
  error: null,

  // --- ACTIONS ---

  /**
   * LOGIN: Backend sets HttpOnly cookies. We just fetch the profile.
   */
  login: async ({ email, password, rememberMe }) => {
    set({ isLoading: true, error: null, isLoggingOut: false });

    try {
      const { data: loginResponse } = await api.post("users/login/", { email, password });

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // 1-STEP LOGIN: Backend returns full user profile now
      if (loginResponse && loginResponse.user) {
        const userData = { 
          ...loginResponse.user, 
          role: (loginResponse.user.role || '').toLowerCase() 
        };

        storage.saveUser(userData);

        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
          isLoggingOut: false
        });
        
        return { success: true, user: userData };
      } else {
        throw new Error("We couldn't load your profile. Please try refreshing.");
      }

    } catch (err) {
      storage.clearSession();
      const errorMsg = extractError(err, "Invalid email or password.");
      set({ error: errorMsg, isLoading: false, isAuthenticated: false });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * FETCH PROFILE: Verifies the session cookie and gets user details.
   */
  fetchProfile: async () => {
    // DO NOT re-bootstrap if we just manually logged out
    if (get().isLoggingOut) return { success: false, error: "Logging out" };

    // Set a fail-safe timeout to prevent infinite "Checking Session..." loop
    // if the backend is slow or unreachable.
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 10000)
    );

    set({ isBootstrapping: true, error: null });
    try {
      // Race the API call against the timeout
      const response = await Promise.race([
        api.get("users/profile/", { _silent: true }),
        timeoutPromise
      ]);
      
      const { data } = response;
      const userData = { ...data, role: (data.role || '').toLowerCase() };

      storage.saveUser(userData);

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
      });
      return { success: false, error: "Your session has ended. Please sign in again." };
    }
  },

  /**
   * LOGOUT: Clear backend cookies and local state.
   */
  logout: async () => {
    // 1. Instant UI update for snappy UX
    set({ isLoggingOut: true, isAuthenticated: false, user: null, error: null });
    storage.clearSession();
    toast.success("You have been signed out.");

    // 2. Explicitly clear backend session
    try {
        await api.post("users/logout/");
    } catch (err) {
        console.error("Logout cleanup failed:", err);
    } finally {
        // Now it's truly safe to allow bootstraps again (for next session)
        // Delaying this slightly ensures the redirection happens first
        setTimeout(() => set({ isLoggingOut: false }), 2000);
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

      await api.post("users/register/", payload);

      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = extractError(err, "We couldn't create your account. Please check the details.");
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
      const errorMsg = extractError(err, "Failed to send reset link.");
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
