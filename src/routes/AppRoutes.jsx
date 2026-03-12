import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Lazy loading components
const LandingPage = lazy(() => import('../pages/Home/LandingPage'));
const Login = lazy(() => import('../pages/Auth/LoginPage'));
const Registration = lazy(() => import('../pages/Auth/RegistrationPage'));

// Lazy loading route modules
const AdminRoutes = lazy(() => import('./AdminRoutes'));
const CoordinatorRoutes = lazy(() => import('./CoordinatorRoutes'));
const FieldOfficerRoutes = lazy(() => import('./FieldOfficerRoutes'));
const ProtectedRoute = lazy(() => import('./ProtectedRoute'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Simple Loading Fallback
const PageLoader = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        fontSize: 'var(--font-size-lg)',
        fontWeight: 600
    }}>
        <div className="animate-pulse">Loading AAQMS...</div>
    </div>
);

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Public Access */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registration" element={<Registration />} />

                    {/* Role-Based Access (Protected) */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin/*" element={<AdminRoutes />} />
                        <Route path="/coordinator/*" element={<CoordinatorRoutes />} />
                        <Route path="/field-officer/*" element={<FieldOfficerRoutes />} />
                    </Route>

                    {/* Catch-all 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>

            {/* Global Toaster for notifications */}
            <Toaster position='top-center' />
        </BrowserRouter>
    );
};

export default AppRoutes;
