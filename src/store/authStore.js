import { create } from "zustand";

const useAuthStore = create((set) => ({
    // Check if a token exists in local storage on initial load
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false,
    error: null,

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            // Placeholder: Replace with actual API call
            // const response = await api.login(credentials);
            // const { token, user } = response.data;

            // Simulating successful login for now
            const mockToken = 'dummy-jwt-token';
            const mockUser = { name: 'Admin User', role: 'admin' };

            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));

            set({ isAuthenticated: true, user: mockUser, isLoading: false });
        } catch (err) {
            set({ error: err.message || 'Login failed', isLoading: false });
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