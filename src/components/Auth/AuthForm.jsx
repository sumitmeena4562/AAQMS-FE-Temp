import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/UI/Button";

const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: [0.21, 1, 0.36, 1],
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: [0.21, 1, 0.36, 1] }
    }
};

/**
 * Reusable AuthForm component for Login and Registration
 * Implements a premium glassmorphic card with sophisticated architecture.
 */
function AuthForm({
    title,
    subtitle,
    schema,
    onSubmit,
    isLoading,
    submitText,
    loadingText,
    footer,
    children,
    grid = false,
    defaultValues = {}
}) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues
    });

    const renderedChildren = typeof children === 'function'
        ? children({ register, errors, itemVariants })
        : children;

    return (
        <AuthLayout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="bg-card/80 backdrop-blur-2xl p-8 md:p-10 rounded-[var(--radius-card)] shadow-2xl border border-white/50 relative overflow-hidden group ring-1 ring-border-main/50"
            >
                {/* Grain Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('/noise.svg')]" />

                {/* Subtle top highlight */}
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

                <div className="text-center mb-10 relative z-10">
                    <motion.h2
                        variants={itemVariants}
                        className="text-[clamp(1.5rem,4vw,1.8rem)] font-black text-title tracking-tight leading-none mb-3"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-sm text-body font-medium leading-relaxed max-w-[280px] mx-auto"
                    >
                        {subtitle}
                    </motion.p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="relative z-10">
                    <div className={grid ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
                        {renderedChildren}
                    </div>

                    <motion.div variants={itemVariants} className="mt-8">
                        <Button 
                            type="submit" 
                            variant="primary" 
                            size="lg" 
                            className="w-full h-12 rounded-[var(--radius-button)] font-black tracking-tight text-sm shadow-xl shadow-primary/20 transition-all active:scale-95" 
                            loading={isLoading}
                        >
                            {isLoading ? loadingText : submitText}
                        </Button>
                    </motion.div>
                </form>

                {/* Trust Badge */}
                <motion.div
                    variants={itemVariants}
                    className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-gray uppercase tracking-widest relative z-10"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Enterprise Grade Security
                </motion.div>

                {/* Floating Decoration Blobs (Internal) */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            </motion.div>

            {footer && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-center mt-8 text-sm text-gray font-medium relative z-10"
                >
                    {footer}
                </motion.div>
            )}
        </AuthLayout>
    );
}

export default AuthForm;
