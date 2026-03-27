import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';


const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { isAuthenticated, user, isBootstrapping } = useAuthStore();

    // 🔹 Wait for bootstrapping if token exists
    if (isBootstrapping) return null;

    // 1. If not logged in, force redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. If authenticated but no user data, session is stale — redirect to login
    if (!user && isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 3. If allowedRoles is provided, check if user has permission
    const currentRole = (user?.role || '').toLowerCase();
    if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
        const validRoles = ['admin', 'coordinator', 'field_officer'];

        let fallbackPath = '/admin/dashboard';
        if (currentRole === 'coordinator') fallbackPath = '/coordinator/dashboard';
        else if (currentRole === 'field_officer') fallbackPath = '/field-officer/dashboard';
        else if (!validRoles.includes(currentRole)) fallbackPath = '/';
        
        return <Navigate to={fallbackPath} replace />;
    }

    // 4. Authorized - render the child routes (e.g. Dashboard)
    return <Outlet />;
};

export default ProtectedRoute;