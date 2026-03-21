import axios from "axios";

const api = axios.create({
    baseURL:'http://localhost:8000/api', //this is Django backend URl
    headers:{
        'Content-Type': 'application/json',
    },
});

// Request intercepter: set on JWT token in header

api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization=`Bearer ${token}`;

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
                    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                        refresh: refreshToken,
                    });
                    const { access } = response.data;

                    localStorage.setItem('token', access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                    
                    // Retry the original request with the new token
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh token also failed - logout the user
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
