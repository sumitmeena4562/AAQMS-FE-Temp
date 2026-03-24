import { create } from "zustand";
import api from "../services/api"; // API interceptor ko import kar liya

// Helper function to simulate network delay for recovery methods (if still using mocks)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const useAuthStore = create((set) => ({
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false,
    error: null,

    /**
     * Real Login Method - Backend API Integration
     * @param {Object} credentials - email, password
     */
    login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        
        try {
            // STEP 1: Backend ki Login API ko Request bhejna
            const response = await api.post('/accounts/api/login/', { email, password });
            const { access, refresh } = response.data;

            // STEP 2: Tokens ko Browser me Save karna
            localStorage.setItem('token', access);
            localStorage.setItem('refresh', refresh);

            // STEP 3: User ki details/profile laana
            const profileRes = await api.get('/accounts/profile/');
            const user = profileRes.data;

            // STEP 4: User ka data save karna
            localStorage.setItem('user', JSON.stringify(user));

            set({ isAuthenticated: true, user: user, isLoading: false, error: null });
            return { success: true, user: user };

        } catch (err) {
            const error = err.response?.data?.detail 
                       || err.response?.data?.error 
                       || 'Login Failed. Check your connection or credentials.';
            
            set({ error, isLoading: false });
            return { success: false, error };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        set({ isAuthenticated: false, user: null, error: null });
    },

    setUser: (user) => set({ user, isAuthenticated: !!user }),

    setError: (error) => set({ error }),

    /**
     * PASSWORD RECOVERY LIFECYCLE (Mocks for now)
     */

    requestPasswordReset: async (email) => {
        set({ isLoading: true, error: null });
        try {
            await delay(1200);
            set({ isLoading: false });
            return { success: true };
        } catch (err) {
            set({ error: err.message, isLoading: false });
            return { success: false, error: err.message };
        }
    },

    verifyOtp: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
            await delay(1200);
            if (otp !== '123456') { // Mock OTP for testing
                throw new Error('Invalid or Expired OTP!');
            }
            set({ isLoading: false });
            return { success: true };
        } catch (err) {
            set({ error: err.message, isLoading: false });
            return { success: false, error: err.message };
        }
    },

    resetPassword: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            await delay(1500);
            set({ isLoading: false });
            return { success: true };
        } catch (err) {
            set({ error: err.message, isLoading: false });
            return { success: false, error: err.message };
        }
    }
}));

export default useAuthStore;