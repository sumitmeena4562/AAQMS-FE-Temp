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
api.interceptors.request.use(
    (config) => {
        // 1. Get auth token from local storage (or Zustand state)
        // Note: For advanced security, HTTP-only cookies are preferred!
        const token = localStorage.getItem('auth_token');

        // 2. Silently attach the token to every single request so you never have to write it again!
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
        // 2xx status codes
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Any error outside 2xx scope
        if (error.response) {
            const { status, data } = error.response;

            // If 401 (Unauthorized) and we haven't retried yet
            if (status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const refreshToken = localStorage.getItem('refresh');

                if (refreshToken) {
                    try {
                        // Use pure axios pointing to backend to prevent infinite interceptor loops
                        // Make sure your backend URL is correct here (e.g. including /api/ route if needed)
                        const refreshURL = import.meta.env.VITE_API_URL
                            ? `${import.meta.env.VITE_API_URL}/accounts/token/refresh/`
                            : 'http://localhost:8000/api/accounts/token/refresh/';

                        const response = await axios.post(refreshURL, {
                            refresh: refreshToken,
                        });
                        const { access } = response.data;

                        // Save new token
                        localStorage.setItem('auth_token', access);
                        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                        originalRequest.headers['Authorization'] = `Bearer ${access}`;

                        // Retry the original request with the new token
                        return api(originalRequest);
                    } catch (refreshError) {
                        // Refresh token also failed - logout the user
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('refresh');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                } else {
                    toast.error("Session expired. Please log in again.");
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                }
            } else {
                // Global Error Handling: We use react-hot-toast here so your components remain dumb.
                switch (status) {
                    case 403: // Forbidden
                        toast.error("You don't have permission to perform this action.");
                        break;
                    case 404: // Not Found
                        toast.error("The requested resource was not found.");
                        break;
                    case 500: // Server crashed
                        toast.error("Server error. Engineers have been notified.");
                        break;
                    default:
                        // Fallback to backend validation message
                        if (status !== 401) {
                            toast.error(data?.message || "An unexpected error occurred.");
                        }
                        break;
                }
            }
        } else if (error.request) {
            // No response received (Check your internet!)
            toast.error("Network Error: Could not connect to the backend server.");
        }

        return Promise.reject(error);
    }
);

export default api;
