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

        if (error.response) {
            const { status } = error.response;

            // 1. Handling Unauthorized (401) with Token Refresh
            if (status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    // Browser automatically sends the refresh_token cookie
                    await axios.post(`${API_BASE_URL}users/token/refresh/`, {}, { withCredentials: true });
                    
                    // If successful, the new access_token will be in a cookie.
                    // Retry the original request without manual header setting.
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh failed -> Absolute logout (Local cleanup only)
                    localStorage.removeItem('user'); 
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }

            // 2. Global Server Error (500+)
            if (status >= 500) {
                toast.error("Server is currently unavailable. Please try again later.", { id: 'server-error' });
            }
        } else if (error.message === 'Network Error') {
            toast.error("Network Error: Please check your internet connection.", { id: 'network-error' });
        }
        
        return Promise.reject(error);
    }
);

export default api;
