import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * ── CORE API CLIENT ──
 * This acts as the single source of truth for all backend communication.
 * Instead of importing 'axios' globally, we will exclusively use this 'api' instance.
 */

const api = axios.create({
    // In production, use env variables: import.meta.env.VITE_API_BASE_URL
    baseURL: '',
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
    (error) => {
        // Any error outside 2xx scope
        if (error.response) {
            const { status, data } = error.response;

            // Global Error Handling: We use react-hot-toast here so your components remain dumb.
            switch (status) {
                case 401: // Unauthorized
                    toast.error("Session expired. Please log in again.");
                    // Automatic logout logic:
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                    break;
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
                    toast.error(data?.message || "An unexpected error occurred.");
            }
        } else if (error.request) {
            // No response received (Check your internet!)
            toast.error("Network Error: Could not connect to the backend server.");
        }

        return Promise.reject(error);
    }
);

export default api;
