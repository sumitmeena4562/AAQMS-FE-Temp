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
import { FiUser } from 'react-icons/fi';
import ForgotPasswordModal from '../../components/Auth/ForgotPasswordModal';

function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading, error: storeError, setError } = useAuthStore();
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [localError, setLocalError] = useState(null);

    const onSubmit = async (data) => {
        setLocalError(null);
        setError(null);
        
        const result = await login(data);
        
        if (result.success) {
            toast.success(`Welcome back, ${result.user.name || 'User'}!`);
            
            const role = (result.user.role || '').toLowerCase();
            if (role === 'coordinator') {
                navigate('/coordinator/dashboard');
            } else if (role === 'field_officer') {
                navigate('/field-officer/dashboard');
            } else {
                navigate('/admin/dashboard');
            }
        } else {
            setLocalError(result.error);
        }
    };

    return (
        <>
            <AuthForm
                title="Sign in to your account"
                subtitle="Access your enterprise dashboard securely"
                schema={loginSchema}
                onSubmit={onSubmit}
                isLoading={isLoading}
                submitText="Sign In"
                loadingText="Signing in..."
                defaultValues={{
                    email: rememberedEmail || '',
                    rememberMe: !!rememberedEmail
                }}
                footer={null}
            >
                {({ register, errors, itemVariants }) => (
                    <motion.div 
                        animate={localError ? { x: [-5, 5, -5, 5, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="space-y-4"
                    >
                        {localError && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50/50 border border-red-200/50 rounded-xl p-3 mb-2"
                            >
                                <p className="text-red-600 text-[11px] font-black uppercase tracking-wider text-center">
                                    {localError}
                                </p>
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants}>
                            <InputField
                                label="Email Address"
                                type="email"
                                placeholder="name@company.com"
                                icon={<FiUser className="text-gray/40" />}
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
                            className="flex justify-between items-center mb-1"
                        >
                            <Checkbox
                                label="Remember me"
                                {...register('rememberMe')}
                            />
                            <button 
                                type="button"
                                onClick={() => setIsForgotPasswordOpen(true)}
                                className="text-slate-500 text-xs font-black hover:text-primary transition-colors bg-transparent p-0 border-none cursor-pointer"
                            >
                                Forgot password?
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AuthForm>

            <ForgotPasswordModal 
                isOpen={isForgotPasswordOpen} 
                onClose={() => setIsForgotPasswordOpen(false)} 
            />
        </>
    );
}

export default LoginPage;
