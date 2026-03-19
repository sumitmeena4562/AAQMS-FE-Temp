import { create } from "zustand";
import api from "../services/api"; // API interceptor ko import kar liya

const useAuthStore = create((set) => ({
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false,
    error: null,

    login: async ({ email, password, rememberMe }) => {
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

    setError: (error) => set({ error })
}));

export default useAuthStore;
