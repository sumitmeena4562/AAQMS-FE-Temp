import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, //this is Django backend URl
    headers:{
        'Content-Type': 'application/json',
    },
});

// Request intercepter: set on JWT token in header

// Public endpoints jo bina token ke accessible hain
const PUBLIC_ENDPOINTS = ['accounts/login/', 'accounts/token/refresh/'];

api.interceptors.request.use(
    (config)=>{
        const isPublic = PUBLIC_ENDPOINTS.some(url => config.url?.includes(url));
        if (!isPublic) {
            const token = localStorage.getItem('token');
            if(token){
                config.headers.Authorization=`Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 (Unauthorized) and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh');

            if (refreshToken) {
                try {
                    // Call the refresh endpoint
                    const response = await api.post('accounts/token/refresh/', {
                        refresh: refreshToken,
                    });
                    const { access } = response.data;

                    localStorage.setItem('token', access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                    
                    // Retry the original request with the new token
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh token also failed - session expired
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh');
                    localStorage.removeItem('user');
                    toast.error("Session expired. Please login again.");
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
