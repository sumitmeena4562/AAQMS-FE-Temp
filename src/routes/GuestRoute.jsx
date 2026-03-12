import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * GuestRoute Component
 * Redirects authenticated users away from public-only pages (like Login/Register)
 */
const GuestRoute = () => {
    const { isAuthenticated, user } = useAuthStore();

    if (isAuthenticated) {
        // Redirect based on role if available, or default to admin/dashboard
        const redirectPath = user?.role === 'coordinator' ? '/coordinator' : 
                            user?.role === 'field_officer' ? '/field-officer' : 
                            '/admin/dashboard';
                            
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default GuestRoute;
