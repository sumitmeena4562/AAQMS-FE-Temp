import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * ── CORE API CLIENT ──
 * This acts as the single source of truth for all backend communication.
 * Instead of importing 'axios' globally, we will exclusively use this 'api' instance.
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api', // this is Django backend URl
    headers: {
        'Content-Type': 'application/json',
    },
    // Prevent infinite loaders if the server crashes
    timeout: 15000,
});

/**
 * ── REQUEST INTERCEPTOR ──
 * Fires *before* the request leaves the browser.
 */
const PUBLIC_ENDPOINTS = ['accounts/login/', 'accounts/token/refresh/'];

api.interceptors.request.use(
    (config) => {
        const isPublic = PUBLIC_ENDPOINTS.some(url => config.url?.includes(url));
        
        if (!isPublic) {
            // 1. Get auth token from local storage
            const token = localStorage.getItem('token');

            // 2. Silently attach the token to every single request
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * ── RESPONSE INTERCEPTOR ──
 * Fires *before* the component receives the data.
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            const { status, data } = error.response;

            // If 401 (Unauthorized) and we haven't retried yet
            if (status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const refreshToken = localStorage.getItem('refresh');

                if (refreshToken) {
                    try {
                        const refreshURL = import.meta.env.VITE_API_URL
                            ? `${import.meta.env.VITE_API_URL}/accounts/token/refresh/`
                            : 'http://localhost:8000/api/accounts/token/refresh/';

                        const response = await axios.post(refreshURL, {
                            refresh: refreshToken,
                        });
                        const { access } = response.data;

                        // Save new token
                        localStorage.setItem('token', access);
                        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                        originalRequest.headers['Authorization'] = `Bearer ${access}`;

                        // Retry the original request with the new token
                        return api(originalRequest);
                    } catch (refreshError) {
                        // Refresh token also failed - logout the user
                        localStorage.removeItem('token');
                        localStorage.removeItem('refresh');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                } else {
                    toast.error("Session expired. Please log in again.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            } else {
                // Global Error Handling (Specific to system-level issues)
                switch (status) {
                    case 403:
                        toast.error("Access Denied: You don't have permission for this.");
                        break;
                    case 404:
                        toast.error("Resource not found. Please check the URL.");
                        break;
                    case 500:
                        toast.error("Server Error: Something went wrong on our end. Please try again later.");
                        break;
                    default:
                        // Do NOT toast for 400 (Validation) or 401 (Auth) here
                        // as components/stores will handle these specifically.
                        break;
                }
            }
        } else if (error.request) {
            toast.error("Connection Failed: Unable to reach the security cluster. Please check your network.");
        }

        return Promise.reject(error);
    }
);

export default api;
