import { create } from "zustand";

const useAuthStore = create((set) => ({
    // Check if a token exists in local storage on initial load
    isAuthenticated: !!localStorage.getItem('token'), 
    user: null, // Will store user data later
    
    login: (token, userData) => {
        localStorage.setItem('token', token);
        set({ isAuthenticated: true, user: userData });
    },
    
    logout: () => {
        localStorage.removeItem('token');
        set({ isAuthenticated: false, user: null });
    }
}));

export default useAuthStore;