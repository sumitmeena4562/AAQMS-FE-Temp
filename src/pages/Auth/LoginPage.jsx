import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [lockoutTimer, setLockoutTimer] = useState(0);

    const onSubmit = async (data) => {
        if (lockoutTimer > 0) {
            toast.error(`Too many attempts! Please wait ${lockoutTimer}s before trying again.`);
            return;
        }

        setLocalError(null);
        setError(null);
        
        const result = await login(data);
        
        if (result.success) {
            // 🔹 Handle Remember Me
            if (data.rememberMe) {
                localStorage.setItem("rememberedEmail", data.email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            setFailedAttempts(0);

            toast.success(`Hi ${result.user.name || 'User'}, welcome back!`);
            
            const role = (result.user.role || '').toLowerCase();
            if (role === 'coordinator') {
                navigate('/coordinator/dashboard');
            } else if (role === 'field_officer') {
                navigate('/field-officer/dashboard');
            } else {
                navigate('/admin/dashboard');
            }
        } else {
            const newFailedAttempts = failedAttempts + 1;
            setFailedAttempts(newFailedAttempts);

            // 1. Handle Server Lockout (403) or specific Locked messages
            const errorMsg = result.error || "Oops! That's not the right email or password.";
            if (errorMsg.toLowerCase().includes("locked")) {
                setLocalError(errorMsg); // Use the backend's specific "Account is locked" message
                return;
            }

            // 2. Local Brute-force Delay (Rate Limiting on Client)
            if (newFailedAttempts >= 3) {
                setLockoutTimer(30);
                const interval = setInterval(() => {
                    setLockoutTimer((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }

            setLocalError(errorMsg);
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

            <div className="text-center mt-6">
                <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    Don't have an account? 
                    <Link 
                        to="/register" 
                        className="text-primary font-black ml-2 hover:underline underline-offset-4"
                    >
                        Create One
                    </Link>
                </span>
            </div>

            <ForgotPasswordModal 
                isOpen={isForgotPasswordOpen} 
                onClose={() => setIsForgotPasswordOpen(false)} 
            />
        </>
    );
}

export default LoginPage;
