import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * CORE API CLIENT
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * REQUEST INTERCEPTOR
 */
const PUBLIC_ENDPOINTS = ['auth/login/', 'auth/refresh/', 'auth/register/'];

api.interceptors.request.use(
    (config) => {
        const isPublic = PUBLIC_ENDPOINTS.some(endpoint => config.url.includes(endpoint));
        
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
 * RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            const { status } = error.response;

            // If 401 (Unauthorized) and not retrying yet
            if (status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const refreshToken = localStorage.getItem('refresh');

                if (refreshToken) {
                    try {
                        const refreshURL = import.meta.env.VITE_API_URL 
                            ? `${import.meta.env.VITE_API_URL}/auth/refresh/`
                            : 'http://localhost:8000/api/auth/refresh/';

                        const response = await axios.post(refreshURL, { refresh: refreshToken });
                        const { access } = response.data;

                        localStorage.setItem('token', access);
                        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                        originalRequest.headers['Authorization'] = `Bearer ${access}`;

                        return api(originalRequest);
                    } catch (refreshError) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refresh');
                        localStorage.removeItem('user');
                        return Promise.reject(refreshError);
                    }
                }
            } else if (status >= 500) {
                toast.error("Cloud server is not responding. Please try again later.");
            }
        }
        return Promise.reject(error);
    }
);

export default api;
