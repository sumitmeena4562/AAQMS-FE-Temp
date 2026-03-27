import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import { 
    forgotPasswordSchema, 
    otpSchema, 
    resetPasswordSchema 
} from '../../schema/authSchema';
import AuthForm from '../../components/Auth/AuthForm';
import InputField from '../../components/UI/InputField';
import Button from '../../components/UI/Button';
import { MailIcon, LockIcon } from '../../assets/icon';

const STEPS = {
    EMAIL: 'EMAIL',
    OTP: 'OTP',
    RESET: 'RESET',
    SUCCESS: 'SUCCESS'
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: [0.21, 1, 0.36, 1] }
    }
};

import useAuthStore from '../../store/authStore';

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const { 
        requestPasswordReset, 
        verifyOtp, 
        resetPassword,
        isLoading,
    } = useAuthStore();

    const [step, setStep] = useState(STEPS.EMAIL);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    const handleEmailSubmit = async (data) => {
        const res = await requestPasswordReset(data.email);
        if (res.success) {
            setEmail(data.email);
            setStep(STEPS.OTP);
            toast.success("OTP sent to your email!");
        } else {
            toast.error(res.error || "Failed to send OTP");
        }
    };

    const handleOtpSubmit = async (data) => {
        const res = await verifyOtp(email, data.otp);
        if (res.success) {
            setOtp(data.otp);
            setStep(STEPS.RESET);
            toast.success("OTP verified!");
        } else {
            toast.error(res.error || "Invalid OTP");
        }
    };

    const handleResetSubmit = async (data) => {
        const res = await resetPassword(email, otp, data.password);
        if (res.success) {
            setStep(STEPS.SUCCESS);
            toast.success("Password reset successful!");
        } else {
            toast.error(res.error || "Reset failed");
        }
    };

    const getSubtitle = () => {
        switch (step) {
            case STEPS.EMAIL: return "Enter your email to receive a secure recovery code";
            case STEPS.OTP: return `We've sent a 6-digit code to ${email}`;
            case STEPS.RESET: return "Create a strong password to protect your account";
            case STEPS.SUCCESS: return "Your password has been updated successfully";
            default: return "";
        }
    };

    const getTitle = () => {
        switch (step) {
            case STEPS.EMAIL: return "Reset Password";
            case STEPS.OTP: return "Verify OTP";
            case STEPS.RESET: return "New Password";
            case STEPS.SUCCESS: return "Password Reset";
            default: return "";
        }
    };

    return (
        <AuthForm
            title={getTitle()}
            subtitle={getSubtitle()}
            schema={step === STEPS.EMAIL ? forgotPasswordSchema : (step === STEPS.OTP ? otpSchema : resetPasswordSchema)}
            onSubmit={step === STEPS.EMAIL ? handleEmailSubmit : (step === STEPS.OTP ? handleOtpSubmit : handleResetSubmit)}
            isLoading={isLoading}
            submitText={step === STEPS.EMAIL ? "Send OTP" : (step === STEPS.OTP ? "Verify OTP" : "Reset Password")}
            loadingText="Processing..."
            footer={
                <span className="font-semibold text-slate-500">
                    Back to 
                    <a 
                        href="/login" 
                        className="text-primary font-black ml-1.5 border-b-2 border-transparent hover:border-primary transition-all duration-300"
                    >
                        Sign in
                    </a>
                </span>
            }
        >
            {({ register, errors }) => (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full space-y-4"
                    >
                        {step === STEPS.EMAIL && (
                            <InputField
                                label="Email address"
                                type="email"
                                placeholder="name@company.com"
                                icon={<MailIcon />}
                                {...register('email')}
                                error={errors.email?.message}
                            />
                        )}

                        {step === STEPS.OTP && (
                            <InputField
                                label="One-Time Password"
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                className="text-center tracking-widest font-black text-xl"
                                {...register('otp')}
                                error={errors.otp?.message}
                            />
                        )}

                        {step === STEPS.RESET && (
                            <>
                                <InputField
                                    label="New Password"
                                    type="password"
                                    placeholder="••••••••"
                                    icon={<LockIcon />}
                                    {...register('password')}
                                    error={errors.password?.message}
                                />
                                <InputField
                                    label="Confirm New Password"
                                    type="password"
                                    placeholder="••••••••"
                                    icon={<LockIcon />}
                                    {...register('confirmPassword')}
                                    error={errors.confirmPassword?.message}
                                />
                            </>
                        )}

                        {step === STEPS.SUCCESS && (
                            <div className="flex flex-col items-center gap-6 py-4">
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </div>
                                <p className="text-slate-500 text-sm font-medium text-center">
                                    You can now use your new password to access your account.
                                </p>
                                <Button onClick={() => navigate('/login')} variant="primary" size="lg" className="w-full h-12 rounded-2xl font-black tracking-tight text-sm shadow-xl shadow-primary/20">
                                    Sign In Now
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}
        </AuthForm>
    );
}

export default ForgotPasswordPage;
