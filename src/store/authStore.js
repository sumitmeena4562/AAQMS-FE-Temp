import { create } from "zustand";
import api from "../services/api";
import toast from "react-hot-toast";
import { mapToActivityFeed } from "../utils/dashboardCalculations";

/**
 * STORAGE HELPERS
 * Only for non-sensitive data like user profile info.
 */
const storage = {
  getUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
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
  isAuthenticated: !!storage.getUser(), // Initial state based on local data
  user: storage.getUser() || null,
  isLoading: false,
  isBootstrapping: false, // Still bootstrap to verify with server
  isLoggingOut: false,
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

      // 1-STEP LOGIN: Backend returns full user profile and bootstrap data
      if (loginResponse && loginResponse.user) {
        const userData = { 
          ...loginResponse.user, 
          role: (loginResponse.user.role || '').toLowerCase() 
        };

        // BOOTSTRAP OPTIMIZATION: Seed the dashboard summary cache immediately
        if (loginResponse.bootstrap) {
          const { queryClient } = await import("../lib/queryClient");
          
          const bootstrapData = loginResponse.bootstrap || {};
          
          // CRITICAL: Only seed the cache if we have the full data (stats + activity + metrics)
          // Otherwise, React Query will think the empty state is "fresh" and won't fetch the real data.
          const isFullData = bootstrapData.recent_activity || bootstrapData.metrics;

          if (isFullData) {
              const mappedBootstrap = {
                stats: bootstrapData.stats || {},
                metrics: bootstrapData.metrics || [],
                recent_history: mapToActivityFeed(
                  bootstrapData.recent_activity || 
                  bootstrapData.recent_history || 
                  []
                ),
                organisations: bootstrapData.organisations || []
              };
              queryClient.setQueryData(['dashboard', 'bootstrap'], mappedBootstrap);

              // SEED GLOBAL HIERARCHY: So every dropdown in the app is instant
              if (bootstrapData.organisations) {
                queryClient.setQueryData(['hierarchy', 'orgs'], bootstrapData.organisations);
              }
              if (bootstrapData.sites) {
                queryClient.setQueryData(['hierarchy', 'sites'], bootstrapData.sites);
              }
          } else {
              // If data is partial (only stats), we just seed the stats and let the dashboard refetch
              if (bootstrapData.stats) {
                queryClient.setQueryData(['user-stats'], bootstrapData.stats);
              }
              // We DON'T set ['dashboard', 'bootstrap'] here so it triggers a fresh fetch on the dashboard page
          }
        }

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
      const errorMsg = extractError(err, "Invalid email or password.");
      set({ error: errorMsg, isLoading: false, isAuthenticated: false });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * FETCH PROFILE: Verifies the session cookie and gets user details.
   */
  fetchProfile: async () => {
    const { isBootstrapping, isAuthenticated, isLoggingOut, user } = get();

    // ── Singleton Guard: prevent concurrent bootstrapping ──
    if (isBootstrapping) return { success: true, message: "Verification already in flight" };
    
    // ── Cache Guard: don't re-fetch if already have a user in memory ──
    // Added a small timestamp check to allow re-verification after 1 hour
    const lastVerified = localStorage.getItem("last_verified");
    const isRecentlyVerified = lastVerified && (Date.now() - parseInt(lastVerified)) < 3600000;

    if (isAuthenticated && user && isRecentlyVerified) {
        return { success: true, user };
    }

    // ── UI Lock: don't bootstrap if manually logging out ──
    if (isLoggingOut) return { success: false, error: "Logging out" };

    set({ isBootstrapping: true, error: null });
    
    // Set a fail-safe timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 10000)
    );

    try {
      const response = await Promise.race([
        api.get("users/profile/", { _silent: true }),
        timeoutPromise
      ]);
      
      const { data } = response;
      const userData = { ...data, role: (data.role || '').toLowerCase() };

      storage.saveUser(userData);
      localStorage.setItem("last_verified", Date.now().toString());

      set({
        user: userData,
        isAuthenticated: true,
        isBootstrapping: false,
        isLoading: false
      });
      return { success: true, user: userData };
    } catch (err) {
      const isAuthError = err.response?.status === 401 || err.response?.status === 403;

      if (isAuthError) {
        storage.clearSession();
        set({
          isAuthenticated: false,
          user: null,
          isBootstrapping: false,
          isLoading: false,
        });
      } else {
        // Network errors/timeouts: finish bootstrapping but keep local state
        set({ isBootstrapping: false, isLoading: false });
      }
      return { success: false, error: err.message };
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
