import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';


const ProtectedRoute = () => {
    // Get state from Zustand store
    const { isAuthenticated } = useAuthStore();
    // If not logged in, force redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    // If logged in, render the child routes (e.g. Dashboard)
    return <Outlet />;



}
export default ProtectedRoute;