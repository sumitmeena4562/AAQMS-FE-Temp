import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from '../store/authStore';

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
 * ── PRODUCTION PAGE LOADER ──
 * Premium full-screen loading state for session bootstrapping.
 */
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(var(--color-primary-rgb),0.1)_0%,_transparent_50%)]" />
        <div className="relative flex flex-col items-center gap-6 z-10">
            <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 animate-pulse">
                Establishing Secure Link
            </div>
        </div>
    </div>
);

const AppRoutes = () => {
    const { user, fetchProfile, isBootstrapping } = useAuthStore();

    React.useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !user) {
            fetchProfile();
        }
    }, [user, fetchProfile]);

    // 🛡️ Prevent routing jumps while verifying session on refresh
    if (isBootstrapping) return <PageLoader />;

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
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#ffffff',
                        color: '#1e293b',
                        borderRadius: '16px',
                        padding: '16px 24px',
                        fontSize: '13px',
                        fontWeight: '700',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #f1f5f9',
                    }
                }}
            />
        </BrowserRouter>
    );
};

export default AppRoutes;
