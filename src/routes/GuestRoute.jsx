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
        // Redirect based on role
        const redirectPath = user?.role === 'coordinator' ? '/coordinator/dashboard' : 
                            user?.role === 'field_officer' ? '/field-officer/dashboard' : 
                            '/admin/dashboard';
                            
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default GuestRoute;
