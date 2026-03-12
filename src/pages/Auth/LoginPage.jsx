import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { loginSchema } from '../../schema/authSchema';
import AuthForm from '../../components/Auth/AuthForm';
import InputField from '../../components/UI/InputField';
import Checkbox from '../../components/UI/Checkbox';
import useAuthStore from '../../store/authStore';
import { MailIcon, LockIcon } from '../../assets/icon';
import { t } from '../../theme/theme';

function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading } = useAuthStore();

    const onSubmit = async (data) => {
        const result = await login(data);
        if (result.success) {
            toast.success(`Welcome back, ${result.user.name}!`);
            navigate('/admin/dashboard');
        } else {
            toast.error(result.error || "Authentication failed. Please try again.");
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
                <span style={{ fontWeight: 500 }}>
                    Don't have access? <a href="/registration" style={{ color: t.color.primary, fontWeight: 700, textDecoration: 'none', marginLeft: '6px', borderBottom: '1.5px solid transparent', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.borderBottomColor = t.color.primary} onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}>Register Here</a>
                </span>
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
                        <a href="/forgot-password" style={{ color: t.color.text, fontSize: t.fontSize.sm, fontWeight: 600, textDecoration: 'none' }}>
                            Forgot password?
                        </a>
                    </motion.div>
                </>
            )}
        </AuthForm>
    );
}

export default LoginPage;
