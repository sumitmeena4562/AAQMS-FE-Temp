import { create } from "zustand";

// Helper function to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
            // Simulate network latency (mast experience ke liye)
            await delay(1500);

            // Mock User Database
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

            const userData = MOCK_USERS[email.toLowerCase()];

            if (userData && userData.password === password) {
                const mockToken = `simulated-jwt-${Date.now()}`;
                const loggedInUser = userData.user;

                // Handle Persistence for "Remember Me"
                if (rememberMe) {
                    localStorage.setItem('token', mockToken);
                    localStorage.setItem('user', JSON.stringify(loggedInUser));
                } else {
                    // For security-sensitive apps, if not rememberMe, you might skip localStorage
                    // but usually, we keep it for the session. Let's stick to standard behavior:
                    localStorage.setItem('token', mockToken);
                    localStorage.setItem('user', JSON.stringify(loggedInUser));
                    
                    // Note: In a real app, you'd use sessionStorage for non-persistent sessions.
                    // For this proof-of-concept, we'll keep it simple.
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
            set({ 
                error: err.message || 'Authentication Failed', 
                isLoading: false 
            });
            return { success: false, error: err.message };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ isAuthenticated: false, user: null, error: null });
    },

    setError: (error) => set({ error })
}));

export default useAuthStore;