import { create } from "zustand";

// Helper function to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_USERS = {
    'admin@aaqms.com': { 
        password: 'Admin@123', 
        user: { id: 1, name: 'Sumit Meena', email: 'admin@aaqms.com', role: 'admin' } 
    },
    'coordinator@aaqms.com': { 
        password: 'Coord@123', 
        user: { id: 2, name: 'Anjali Sharma', email: 'coordinator@aaqms.com', role: 'coordinator' } 
    },
    'officer@aaqms.com': { 
        password: 'Officer@123', 
        user: { id: 3, name: 'Rahul Gupta', email: 'officer@aaqms.com', role: 'field_officer' } 
    }
};

const useAuthStore = create((set) => ({
    // Initialize state from localStorage
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false,
    error: null,

    /**
     * Simulated Login Method
     * @param {Object} credentials - email, password, rememberMe
     */
    login: async ({ email, password, rememberMe }) => {
        set({ isLoading: true, error: null });
        
        try {
            await delay(1500);
            const userData = MOCK_USERS[email.toLowerCase()];

            if (userData && userData.password === password) {
                const mockToken = `simulated-jwt-${Date.now()}`;
                const loggedInUser = userData.user;

                // Handle Persistence for "Remember Me"
                if (rememberMe) {
                    localStorage.setItem('token', mockToken);
                    localStorage.setItem('user', JSON.stringify(loggedInUser));
                } else {
                    // For short-lived sessions, we still use localStorage for simplicity 
                    // in this POC, but the logic structure allows for sessionStorage later.
                    localStorage.setItem('token', mockToken);
                    localStorage.setItem('user', JSON.stringify(loggedInUser));
                }

                set({ 
                    isAuthenticated: true, 
                    user: loggedInUser, 
                    isLoading: false, 
                    error: null 
                });
                
                return { success: true, user: loggedInUser };
            } else {
                throw new Error('Invalid Email or Password!');
            }
        } catch (err) {
            const error = err.message || 'Authentication Failed';
            set({ error, isLoading: false });
            return { success: false, error };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ isAuthenticated: false, user: null, error: null });
    },

    setError: (error) => set({ error }),

    /**
     * PASSWORD RECOVERY LIFECYCLE
     */

    requestPasswordReset: async (email) => {
        set({ isLoading: true, error: null });
        try {
            await delay(1200);
            // In a real app, this would hit /auth/forgot-password
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
            // Update MOCK_USERS password for the session
            if (MOCK_USERS[email.toLowerCase()]) {
                MOCK_USERS[email.toLowerCase()].password = password;
            }
            set({ isLoading: false });
            return { success: true };
        } catch (err) {
            set({ error: err.message, isLoading: false });
            return { success: false, error: err.message };
        }
    }
}));

export default useAuthStore;