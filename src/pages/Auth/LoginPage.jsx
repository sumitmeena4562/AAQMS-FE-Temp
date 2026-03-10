import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { loginSchema } from '../../schema/authSchema';
import AuthForm from '../../components/Auth/AuthForm';
import InputField from '../../components/UI/InputField';
import Checkbox from '../../components/UI/Checkbox';
import useAuthStore from '../../store/authStore';

function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading } = useAuthStore();

    const onSubmit = async (data) => {
        try {
            await login(data);
            toast.success("Login Successful!");
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error || "Invalid Email Or Password!");
        }
    };

    return (
        <AuthForm
            title="Sign in to your account"
            subtitle="Access your enterprise dashboard securely"
            schema={loginSchema}
            onSubmit={onSubmit}
            isLoading={isLoading}
            submitText="Sign In"
            loadingText="Signing in..."
            footer={
                <>
                    Don't have access? <a href="/registration" style={{ color: 'var(--color-text-primary)', fontWeight: 700, textDecoration: 'none', borderBottom: '1.5px solid var(--color-text-primary)' }}>Register Here</a>
                </>
            }
        >
            {({ register, errors, itemVariants }) => (
                <>
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
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}
                    >
                        <Checkbox
                            label="Remember me"
                            {...register('rememberMe')}
                        />
                        <a href="/forgot-password" style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 600, textDecoration: 'none' }}>
                            Forgot password?
                        </a>
                    </motion.div>
                </>
            )}
        </AuthForm>
    );
}

export default LoginPage;
