import { useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';

/**
 * AuthInitializer component
 * Fetches the user profile from the backend on app load if a token exists.
 * This ensures the user session is maintained across page refreshes.
 */
const AuthInitializer = ({ children }) => {
    const { isAuthenticated, setUser, logout } = useAuthStore();

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            
            if (token && !isAuthenticated) {
                try {
                    // Fetch real user profile from backend
                    const response = await api.get('users/profile/');
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to restore session:', error);
                    // If profile fetch fails (e.g., invalid token), logout
                    logout();
                }
            }
        };

        initializeAuth();
    }, [isAuthenticated, setUser, logout]);

    return children;
};

export default AuthInitializer;
