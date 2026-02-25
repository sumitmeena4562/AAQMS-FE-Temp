import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';

// Simple SVG Icons
const MailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);

const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

function Login() {
    const navigate = useNavigate();

    // State for inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Login logic here
        console.log("Login user", { email, password, rememberMe });
        // After successful login, redirect to dashboard
        // navigate('/dashboard');
    };

    return (
        <AuthLayout>
            {/* The Login Card */}
            <div style={{
                backgroundColor: 'var(--color-bg-secondary)',
                padding: 'var(--space-xl)',
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-premium)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        Sign in to your account
                    </h2>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                        Access your dashboard securely
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <InputField
                        label="Email address"
                        type="email"
                        placeholder="name@company.com"
                        icon={<MailIcon />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <InputField
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<LockIcon />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <Checkbox
                            label="Remember me"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <a href="/forgot-password" style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 600, textDecoration: 'none' }}>
                            Forgot password?
                        </a>
                    </div>

                    <Button type="submit" variant="dark" fullWidth>
                        Sign In
                    </Button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Protected by secure JWT authentication
                </div>
            </div>

            {/* Bottom Contact Administrator text */}
            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                Don't have access? <a href="#" style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Contact Administrator</a>
            </div>
        </AuthLayout>
    );
}

export default Login;