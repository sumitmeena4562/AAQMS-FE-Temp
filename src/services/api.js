import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * ── CORE API CLIENT ──
 * Environment aware base URL configuration.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * ── REQUEST INTERCEPTOR ──
 * Attaches JWT token to all non-public requests.
 */
const PUBLIC_ENDPOINTS = ['users/login/', 'users/token/refresh/', 'users/register/', 'users/request-reset/', 'users/verify-otp/', 'users/reset-password/'];

api.interceptors.request.use(
    (config) => {
        // No manual JWT injection needed; browser handles HttpOnly cookies.
        
        // ── CSRF PROTECTION ──
        // For state-changing requests, attach the X-CSRFToken header.
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))
                ?.split('=')[1];
            
            if (csrfToken) {
                config.headers['X-CSRFToken'] = csrfToken;
            }
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * ── RESPONSE INTERCEPTOR ──
 * Handles token automatic refreshment and global error alerts.
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isSilent = originalRequest?._silent === true;

        if (error.response) {
            const { status } = error.response;

            // 1. Handling Unauthorized (401) with Token Refresh
            // Note: We also consider status: false if the backend has wrapped a 401
            const isUnauthorized = status === 401 || (error.response.data?.status === false && error.response.data?.errors?.code === 'token_not_valid');
            
            if (isUnauthorized && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    // Browser automatically sends the refresh_token cookie
                    await axios.post(`${API_BASE_URL}users/token/refresh/`, {}, { withCredentials: true });
                    
                    // If successful, the new access_token will be in a cookie.
                    // Retry the original request without manual header setting.
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh failed -> Local cleanup
                    localStorage.removeItem('user'); 
                    
                    // DO NOT force window.location.href here. 
                    // Let the application state (Zustand/AppRoutes) handle the redirect 
                    // to avoid infinite loops and maintain React state control.
                    return Promise.reject(refreshError);
                }
            }

            // 2. Global Server Error (500+) - Only toast if NOT silent
            if (status >= 500 && !isSilent) {
                toast.error("Server is currently unavailable. Please try again later.", { id: 'server-error' });
            }
        } else if (error.message === 'Network Error' && !isSilent) {
            toast.error("Network Error: Please check your internet connection.", { id: 'network-error' });
        }
        
        return Promise.reject(error);
    }
);

export default api;
