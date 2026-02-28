import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { loginSchema } from '../../schema/authSchema';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import { MailIcon, LockIcon } from '../../assets/icon';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
};

function LoginPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        console.log(data);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (data.email === "example@gmail.com" && data.password === "@Example123") {
                toast.success("Login Successful!");
                localStorage.setItem("token", "dummy-jwt-token");
                navigate('/admin/dashboard');
            } else {
                toast.error("Invalid Email Or Password!");
            }
        } catch (_error) {
            toast.error("An error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    padding: '32px 28px',
                    borderRadius: 'var(--radius-card)',
                    boxShadow: 'var(--shadow-premium)',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    border: '1px solid var(--color-border-subtle, rgba(255,255,255,0.05))'
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <motion.h2
                        variants={itemVariants}
                        style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}
                    >
                        Sign in to your account
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: '8px' }}
                    >
                        Access your enterprise dashboard securely
                    </motion.p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <motion.div variants={itemVariants}>
                        <InputField
                            label="Email address"
                            type="email"
                            placeholder="name@company.com"
                            icon={<MailIcon />}
                            {...register('email')}
                            error={errors.email?.message}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <InputField
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            icon={<LockIcon />}
                            {...register('password')}
                            error={errors.password?.message}
                        />
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}
                    >
                        <Checkbox
                            label="Remember me"
                            {...register('rememberMe')}
                        />
                        <a href="/forgot-password" style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 600, textDecoration: 'none' }}>
                            Forgot password?
                        </a>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Button type="submit" variant="dark" fullWidth disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </motion.div>
                </form>

                <motion.div
                    variants={itemVariants}
                    style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Protected by secure JWT authentication
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{ textAlign: 'center', marginTop: '24px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}
            >
                Don't have access? <a href="#" style={{ color: 'var(--color-text-primary)', fontWeight: 700, textDecoration: 'none', borderBottom: '1.5px solid var(--color-text-primary)' }}>Contact Administrator</a>
            </motion.div>
        </AuthLayout>
    );
}

export default LoginPage;