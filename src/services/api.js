import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * ── CORE API CLIENT ──
 * Environment aware base URL configuration.
 * In production, we default to the relative path '/api/' to leverage the Vercel proxy (CORS bypass).
 */
const API_BASE_URL = import.meta.env.PROD 
    ? '/api/' 
    : (import.meta.env.VITE_API_URL || '/api/');

// [DEBUG] Log API configuration
if (import.meta.env.DEV || localStorage.getItem('DEBUG_API')) {
    console.log(`[AAQMS-API] Initializing with Base URL: ${API_BASE_URL} (Mode: ${import.meta.env.MODE})`);
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
                    await axios.post(`${API_BASE_URL}users/token/refresh/`, {}, {
                        withCredentials: true,
                        // Prevent this request from ever being intercepted/retried recursively
                        _silent: true
                    });

                    isRefreshing = false;
                    processQueue(null);

                    // Final Retry logic
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError);
                    isRefreshing = false;

                    // 🛡️ Cleanup localStorage ONLY if it's a terminal AUTHENTICATION failure.
                    // This prevents losing the session during transient 500/Database errors.
                    if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
                        localStorage.removeItem('user');
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
