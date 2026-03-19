import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { 
    forgotPasswordSchema, 
    otpSchema, 
    resetPasswordSchema 
} from '../../schema/authSchema';
import InputField from '../UI/InputField';
import Button from '../UI/Button';
import { MailIcon, LockIcon } from '../../assets/icon';

const STEPS = {
    EMAIL: 'EMAIL',
    OTP: 'OTP',
    RESET: 'RESET',
    SUCCESS: 'SUCCESS'
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { type: "spring", duration: 0.5, bounce: 0.3 }
    },
    exit: { 
        opacity: 0, 
        scale: 0.95, 
        y: 20,
        transition: { duration: 0.2 }
    }
};

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: [0.21, 1, 0.36, 1] }
    }
};

function ForgotPasswordModal({ isOpen, onClose }) {
    const [step, setStep] = useState(STEPS.EMAIL);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');

    // Reset state when modal is closed/opened
    React.useEffect(() => {
        if (isOpen) {
            setStep(STEPS.EMAIL);
            setEmail('');
        }
    }, [isOpen]);

    const handleEmailSubmit = async (data) => {
        setIsLoading(true);
        setEmail(data.email);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setStep(STEPS.OTP);
        toast.success("OTP sent to your email!");
    };

    const handleOtpSubmit = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setStep(STEPS.RESET);
        toast.success("OTP verified!");
    };

    const handleResetSubmit = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setStep(STEPS.SUCCESS);
        toast.success("Password reset successful!");
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal Container */}
                <motion.div
                    variants={modalVariants}
                    className="bg-white/90 backdrop-blur-2xl p-8 md:p-10 rounded-[32px] shadow-2xl border border-white/50 relative overflow-hidden group ring-1 ring-slate-200/50 w-full max-w-md z-10"
                >
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors z-20 bg-slate-100 hover:bg-slate-200 rounded-full p-2"
                        aria-label="Close modal"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    {/* Grain Texture */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('/noise.svg')]" />
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10 w-full"
                        >
                            {step === STEPS.EMAIL && <EmailStep onSubmit={handleEmailSubmit} isLoading={isLoading} />}
                            {step === STEPS.OTP && <OtpStep email={email} onSubmit={handleOtpSubmit} onResend={() => handleEmailSubmit({ email })} isLoading={isLoading} />}
                            {step === STEPS.RESET && <ResetStep onSubmit={handleResetSubmit} isLoading={isLoading} />}
                            {step === STEPS.SUCCESS && <SuccessStep onClose={onClose} />}
                        </motion.div>
                    </AnimatePresence>

                    {/* Decorative blobs */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// Sub-components for each step

function EmailStep({ onSubmit, isLoading }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onChange'
    });

    return (
        <div>
            <div className="text-center mb-10">
                <motion.h2 variants={itemVariants} initial="hidden" animate="visible" className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-3">
                    Reset Password
                </motion.h2>
                <motion.p variants={itemVariants} initial="hidden" animate="visible" className="text-sm text-slate-500 font-medium leading-relaxed max-w-[280px] mx-auto">
                    Enter your email to receive a secure recovery code
                </motion.p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <motion.div variants={itemVariants} initial="hidden" animate="visible">
                    <InputField
                        label="Email address"
                        type="email"
                        placeholder="name@company.com"
                        icon={<MailIcon />}
                        {...register('email')}
                        error={errors.email?.message}
                    />
                </motion.div>
                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mt-4">
                    <Button type="submit" variant="primary" size="lg" className="w-full h-12 rounded-2xl font-black tracking-tight text-sm shadow-xl shadow-primary/20" loading={isLoading}>
                        Send OTP
                    </Button>
                </motion.div>
            </form>
        </div>
    );
}

function OtpStep({ email, onSubmit, onResend, isLoading }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(otpSchema),
        mode: 'onChange'
    });

    return (
        <div>
            <div className="text-center mb-10">
                <motion.h2 variants={itemVariants} initial="hidden" animate="visible" className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-3">
                    Verify OTP
                </motion.h2>
                <motion.p variants={itemVariants} initial="hidden" animate="visible" className="text-sm text-slate-500 font-medium leading-relaxed max-w-[280px] mx-auto">
                    We&apos;ve sent a 6-digit code to {email}
                </motion.p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <motion.div variants={itemVariants} initial="hidden" animate="visible">
                    <InputField
                        label="One-Time Password"
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        className="text-center tracking-[1em] font-black text-xl"
                        {...register('otp')}
                        error={errors.otp?.message}
                    />
                </motion.div>
                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mt-4">
                    <Button type="submit" variant="primary" size="lg" className="w-full h-12 rounded-2xl font-black tracking-tight text-sm shadow-xl shadow-primary/20" loading={isLoading}>
                        Verify OTP
                    </Button>
                </motion.div>
            </form>
            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="text-center mt-6 text-sm text-slate-500 font-medium">
                Didn&apos;t receive a code? 
                <button type="button" onClick={onResend} className="text-primary font-black ml-1.5 border-b-2 border-transparent hover:border-primary transition-all duration-300 bg-transparent p-0">
                    Resend
                </button>
            </motion.div>
        </div>
    );
}

function ResetStep({ onSubmit, isLoading }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange'
    });

    return (
        <div>
            <div className="text-center mb-10">
                <motion.h2 variants={itemVariants} initial="hidden" animate="visible" className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-3">
                    New Password
                </motion.h2>
                <motion.p variants={itemVariants} initial="hidden" animate="visible" className="text-sm text-slate-500 font-medium leading-relaxed max-w-[280px] mx-auto">
                    Create a strong password to protect your account
                </motion.p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <motion.div variants={itemVariants} initial="hidden" animate="visible">
                    <InputField
                        label="New Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<LockIcon />}
                        {...register('password')}
                        error={errors.password?.message}
                    />
                </motion.div>
                <motion.div variants={itemVariants} initial="hidden" animate="visible">
                    <InputField
                        label="Confirm New Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<LockIcon />}
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                    />
                </motion.div>
                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mt-4">
                    <Button type="submit" variant="primary" size="lg" className="w-full h-12 rounded-2xl font-black tracking-tight text-sm shadow-xl shadow-primary/20" loading={isLoading}>
                        Reset Password
                    </Button>
                </motion.div>
            </form>
        </div>
    );
}

function SuccessStep({ onClose }) {
    return (
        <div className="flex flex-col items-center gap-6 py-4">
            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="text-center mb-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-3">
                    Password Reset
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[280px] mx-auto">
                    Your password has been updated successfully
                </p>
            </motion.div>
            
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>
            </motion.div>

            <motion.p variants={itemVariants} initial="hidden" animate="visible" className="text-slate-500 text-sm font-medium text-center">
                You can now use your new password to access your account.
            </motion.p>

            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="w-full mt-4">
                <Button onClick={onClose} variant="primary" size="lg" className="w-full h-12 rounded-2xl font-black tracking-tight text-sm shadow-xl shadow-primary/20">
                    Sign In Now
                </Button>
            </motion.div>
        </div>
    );
}

export default ForgotPasswordModal;
