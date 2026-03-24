import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore"; // AuthStore to clear state

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // this is Django backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: set JWT token in header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle token refresh and Global Errors
api.interceptors.response.use(
    (response) => {
        // Success response normally returns intact
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // --- 1. HANDLE 401 UNAUTHORIZED (TOKEN EXPIRED) ---
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh');

            if (refreshToken) {
                try {
                    // Call the refresh endpoint
                    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                        refresh: refreshToken,
                    });
                    const { access } = response.data;

                    localStorage.setItem('token', access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                    
                    // Retry the original request with the new token
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh token also failed - logout the user completely
                    useAuthStore.getState().logout();
                    toast.error("Session expired. Please login again.");
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token available - trigger instant logout
                useAuthStore.getState().logout();
                toast.error("Session expired. Please login again.");
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        // --- 2. GLOBAL ERROR TOAST HANDLING (400, 403, 404, 500) ---
        // If it's a 401, we already showed a toast and redirected, so skip it.
        if (error.response?.status !== 401) {
            // Read exact backend error message or fallback to default
            const errorMessage = 
                error.response?.data?.message || 
                error.response?.data?.detail || 
                error.response?.data?.error || 
                error.message || 
                "An unexpected error occurred!";

            toast.error(errorMessage);
        }

        return Promise.reject(error);
    }
);

export default api;
