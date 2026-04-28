import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import GlobalLoader from '../components/UI/GlobalLoader';

// Lazy loading components
const LandingPage = lazy(() => import('../pages/Home/LandingPage'));
const Login = lazy(() => import('../pages/Auth/LoginPage'));
const Registration = lazy(() => import('../pages/Auth/RegistrationPage'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPasswordPage'));

// Lazy loading route modules
const AdminRoutes = lazy(() => import('./AdminRoutes'));
const CoordinatorRoutes = lazy(() => import('./CoordinatorRoutes'));
const FieldOfficerRoutes = lazy(() => import('./FieldOfficerRoutes'));
const GuestRoute = lazy(() => import('./GuestRoute'));
const ProtectedRoute = lazy(() => import('./ProtectedRoute'));
const NotFound = lazy(() => import('../pages/NotFound'));

/**
 * ── MINIMALIST PAGE LOADER ──
 * Clean, light-themed loading state for session bootstrapping.
 */
const PageLoader = ({ text = "Secure Session Check..." }) => (
    <GlobalLoader mode="fullScreen" text={text} size="lg" />
);

const AppRoutes = () => {
    const { fetchProfile, isLoggingOut } = useAuthStore();

    React.useEffect(() => {
        // ALWAYS attempt to fetch profile on mount to verify the session HttpOnly cookie.
        fetchProfile();
    }, [fetchProfile]);

    // 🚪 Show loader during logout to prevent flickering/stale views
    if (isLoggingOut) return <PageLoader text="Signing out safely..." />;


    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Public Access */}
                    <Route path="/" element={<LandingPage />} />
                    
                    {/* Guest Access (Redirects if already logged in) */}
                    <Route element={<GuestRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/register" element={<Registration />} />
                    </Route>

                    {/* Role-Based Access (Protected) */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin/*" element={<AdminRoutes />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['coordinator']} />}>
                        <Route path="/coordinator/*" element={<CoordinatorRoutes />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['field_officer']} />}>
                        <Route path="/field-officer/*" element={<FieldOfficerRoutes />} />
                    </Route>

                    {/* Catch-all 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>

            {/* Global Toaster for notifications */}
            <Toaster 
                position='top-center'
                containerStyle={{
                    zIndex: 10001,
                }}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'var(--color-card)',
                        color: 'var(--color-title)',
                        borderRadius: '16px',
                        padding: '16px 24px',
                        fontSize: '13px',
                        fontWeight: '700',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid var(--color-border-main)',
                    }
                }}
            />
        </BrowserRouter>
    );
};

export default AppRoutes;
