import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * GuestRoute Component
 * Redirects authenticated users away from public-only pages (like Login/Register)
 */
const GuestRoute = () => {
    const { isAuthenticated, user, isBootstrapping } = useAuthStore();

    // 🔹 Only wait during initial session restore
    if (isBootstrapping) return null;

    if (isAuthenticated && user) {
        // Redirect based on role
        const role = (user?.role || '').toLowerCase();
        const validRoles = ['admin', 'coordinator', 'field_officer'];
        
        let redirectPath = '/admin/dashboard';
        if (role === 'coordinator') redirectPath = '/coordinator/dashboard';
        else if (role === 'field_officer') redirectPath = '/field-officer/dashboard';
        else if (!validRoles.includes(role)) redirectPath = '/'; // Unknown role? Go to landing.
                            
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default GuestRoute;
