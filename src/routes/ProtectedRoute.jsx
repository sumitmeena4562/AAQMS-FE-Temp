import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';


const ProtectedRoute = ({ allowedRoles = [] }) => {
    // Get state from Zustand store
    const { isAuthenticated, user } = useAuthStore();

    // 1. If not logged in, force redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. If no user data yet (loading), show nothing or a loader
    if (!user && isAuthenticated) {
        return null; // Or a loader component
    }

    // 3. If allowedRoles is provided, check if user has permission
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // Redirect to their own dashboard based on their actual role
        const fallbackPath = user?.role === 'coordinator' ? '/coordinator/dashboard' : 
                            user?.role === 'field_officer' ? '/field-officer/dashboard' : 
                            '/admin/dashboard';
        
        return <Navigate to={fallbackPath} replace />;
    }

    // 4. Authorized - render the child routes (e.g. Dashboard)
    return <Outlet />;
};

export default ProtectedRoute;