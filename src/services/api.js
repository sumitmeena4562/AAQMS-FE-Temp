import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * ── CORE API CLIENT ──
 * Environment aware base URL configuration.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * ── REQUEST INTERCEPTOR ──
 * Attaches JWT token to all non-public requests.
 */
const PUBLIC_ENDPOINTS = ['users/login/', 'users/refresh/', 'users/register/', 'users/request-reset/', 'users/verify-otp/', 'users/reset-password/'];

api.interceptors.request.use(
    (config) => {
        const isPublic = PUBLIC_ENDPOINTS.some(endpoint => config.url?.includes(endpoint));
        
        if (!isPublic) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
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
                const refreshToken = localStorage.getItem('refresh');

                if (refreshToken) {
                    try {
                        const response = await axios.post(`${API_BASE_URL}users/token/refresh/`, { refresh: refreshToken });
                        const { access } = response.data;

                        // Save and retry
                        localStorage.setItem('token', access);
                        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                        originalRequest.headers['Authorization'] = `Bearer ${access}`;

                        return api(originalRequest);
                    } catch (refreshError) {
                        // Refresh failed -> Absolute logout
                        localStorage.removeItem('token');
                        localStorage.removeItem('refresh');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
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
