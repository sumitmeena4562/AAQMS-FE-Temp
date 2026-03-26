import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

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
                    
                    {/* Guest Access (Redirects if already logged in) */}
                    <Route element={<GuestRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
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
                        borderRadius: '12px',
                        padding: '12px 20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #f1f5f9',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#ffffff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#ffffff',
                        },
                        style: {
                            border: '1px solid #fee2e2',
                        }
                    },
                }}
            />
        </BrowserRouter>
    );
};

export default AppRoutes;
