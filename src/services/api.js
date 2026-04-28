import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * ── CORE API CLIENT ──
 * Environment aware base URL configuration.
 * FOOLPROOF LOGIC: If we are not on localhost, we MUST use relative paths to trigger the Vercel proxy.
 */
const isLocal = window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1' || 
                 window.location.hostname.startsWith('192.168.');

const API_BASE_URL = isLocal 
    ? (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/') 
    : '/api/';

// [DEBUG] Log API configuration
if (isLocal || localStorage.getItem('DEBUG_API')) {
    console.log(`[AAQMS-API] Initializing with Base URL: ${API_BASE_URL} (Hostname: ${window.location.hostname})`);
}

// Explicit global config for credentials
axios.defaults.withCredentials = true;

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

// ─── REQUEST TRACKING (Monitoring Concurrent Calls) ───
const pendingRequests = new Map();

api.interceptors.request.use(
    (config) => {
        // ── CSRF PROTECTION ──
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))
                ?.split('=')[1];

            if (csrfToken) {
                config.headers['X-CSRFToken'] = csrfToken;
            }
        }

        // ── AUTHORIZATION HEADER ──
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Remove 'undefined', 'null' or literal "undefined" strings from query params
        if (config.params) {
            const cleanParams = { ...config.params };
            Object.keys(cleanParams).forEach(key => {
                const val = cleanParams[key];
                if (val === undefined || val === null || val === 'undefined' || val === 'null' || val === '') {
                    delete cleanParams[key];
                }
            });
            config.params = cleanParams;
        }

        // ── REQUEST DEDUPLICATION (LOGGING ONLY) ──
        // We previously used a Map to block duplicate GETs, but it caused hangs with React Query.
        // Now we just monitor for potential request explosions.
        if (config.method?.toLowerCase() === 'get') {
            const requestKey = `${config.url}${JSON.stringify(config.params || {})}`;
            if (pendingRequests.has(requestKey)) {
                console.debug(`[AAQMS-API] Concurrent request detected for: ${requestKey}. Letting it pass.`);
            }
            pendingRequests.set(requestKey, true);
            config._requestKey = requestKey;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * ── RESPONSE INTERCEPTOR ──
 * Handles token automatic refreshment with race condition protection (Queuing).
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => {
        // ── REQUEST TRACKING CLEANUP ──
        if (response.config?._requestKey) {
            pendingRequests.delete(response.config._requestKey);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // ── REQUEST TRACKING CLEANUP (ON ERROR) ──
        if (originalRequest?._requestKey) {
            pendingRequests.delete(originalRequest._requestKey);
        }

        const isSilent = originalRequest?._silent === true;

        if (error.response) {
            const { status, headers } = error.response;
            const contentType = headers['content-type'] || '';

            // 0. Handle SPA Rewrites (Server returns index.html instead of JSON error)
            if (contentType.includes('text/html') || typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
                console.error("[AAQMS-API] Received HTML instead of JSON. This usually means the API URL is wrong or a proxy is missing.");
                toast.error("API configuration error. Please check environment variables.", { id: 'api-config-error' });
                return Promise.reject(new Error("Expected JSON response but received HTML. Check VITE_API_URL."));
            }

            // 1. Handling Unauthorized (401) with Token Refresh (and Queuing)
            const isUnauthorized = status === 401 || (error.response.data?.status === false && error.response.data?.errors?.code === 'token_not_valid');

            // SECURITY: Never attempt refresh for PUBLIC_ENDPOINTS (avoid login loops)
            const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => originalRequest.url?.includes(endpoint));
            const shouldRefresh = !originalRequest._retry && !isPublicEndpoint && !originalRequest._noRefresh;

            if (isUnauthorized && shouldRefresh) {
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    })
                        .then(() => api(originalRequest))
                        .catch(err => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    // Critical: Await the response from the refresh endpoint
                    // Using axios directly ensures we don't trigger the interceptor again
                    const refreshResponse = await axios.post(`${API_BASE_URL}users/token/refresh/`, {
                        refresh: localStorage.getItem('refresh_token')
                    }, {
                        withCredentials: true,
                        _silent: true
                    });

                    if (refreshResponse.data.access) {
                        localStorage.setItem('access_token', refreshResponse.data.access);
                        if (refreshResponse.data.refresh) {
                            localStorage.setItem('refresh_token', refreshResponse.data.refresh);
                        }
                    }

                    isRefreshing = false;
                    processQueue(null);

                    // Final Retry logic with the original request
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError);
                    isRefreshing = false;

                        // 🛡️ TERMINAL FAILURE: If refresh fails with 401/403, the session is dead.
                        // We must clear state to stop React Query from retrying.
                        if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
                            console.error("[AAQMS-API] Refresh token expired or invalid. Logging out.");
                            localStorage.removeItem('user');
                            localStorage.removeItem('last_verified');
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('refresh_token');

                            // Force a reload to login if we are stuck in a loop
                            // CRITICAL: Don't redirect if we are on the landing page (/)
                            const isLandingPage = window.location.pathname === '/';
                            if (!isPublicEndpoint && !window.location.pathname.startsWith('/login') && !isLandingPage) {
                                window.location.href = '/login?session_expired=true';
                            }
                        }
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
