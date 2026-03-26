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
import ForgotPasswordModal from '../../components/Auth/ForgotPasswordModal';

function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading ,user} = useAuthStore();
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

    const onSubmit = async (data) => {
        const result = await login(data);
        if (result.success) {
            console.log("Logged in user:", result.user.name);
            toast.success(`Login Successfull! , ${result.user.name}!`);
            
            // Dynamic redirection based on role
            const role = result.user.role;
            if (role === 'coordinator') {
                navigate('/coordinator/dashboard');
            } else if (role === 'field_officer') {
                navigate('/field-officer/dashboard');
            } else {
                navigate('/admin/dashboard');
            }
        } else {
            toast.error(result.error || "Authentication failed. Please try again.");
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
                    identifier: rememberedEmail || '',
                    rememberMe: !!rememberedEmail
                }}
                footer={null}
            >
                {({ register, errors, itemVariants }) => (
                    <>
                        <motion.div variants={itemVariants}>
                            <InputField
                                label="Email or User ID"
                                type="text"
                                placeholder="name@company.com or EMP-001"
                                icon={<MailIcon />}
                                {...register('identifier')}
                                error={errors.identifier?.message}
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
                    </>
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
