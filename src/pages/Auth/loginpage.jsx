import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';

import { loginSchema } from '../../schema/authSchema';
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
    const [isLoading, setIsLoading] = useState(false);

    // Ye Zod validation k sath connect ho gaya hai
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        setIsLoading(true); // Disable button & show spinner state
        console.log(data);


        try {
            // Replace with actual API call later
            // const response = await axios.post('/api/auth/login', data);

            // Simulating a 2-second backend wait
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (data.email === "example@gmail.com" && data.password === "@Example123") {
                toast.success("Login Successful!");
                // Here you would save the real token
                localStorage.setItem("token", "dummy-jwt-token");
                navigate('/dashboard');
            } else {
                toast.error("Invalid Email Or Password!");
            }
            // eslint-disable-next-line no-unused-vars
        } catch (_error) {
            toast.error("An error occurred during login.");
        } finally {
            setIsLoading(false); // Enable button again
        }
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

                {/* Yahan hum handleSubmit(onSubmit) paas kar rahe hain */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField
                        label="Email address"
                        type="email"
                        placeholder="name@company.com"
                        icon={<MailIcon />}
                        {...register('email')}
                        error={errors.email?.message}
                    />

                    <InputField
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<LockIcon />}
                        {...register('password')}
                        error={errors.password?.message}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <Checkbox
                            label="Remember me"
                            {...register('rememberMe')}
                        />
                        <a href="/forgot-password" style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 600, textDecoration: 'none' }}>
                            Forgot password?
                        </a>
                    </div>

                    <Button type="submit" variant="dark" fullWidth disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
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