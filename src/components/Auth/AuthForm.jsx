import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/UI/Button";
import { t } from '../../theme/theme';

const containerVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1], // Custom spring-like ease
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

/**
 * Reusable AuthForm component for Login and Registration
 * Implements a premium glassmorphic card with sophisticated typography.
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
    grid = false
}) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
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
                style={{
                    backgroundColor: t.color.bg,
                    padding: 'clamp(24px, 4vw, 36px) clamp(20px, 4vw, 32px)',
                    borderRadius: '20px', // Using 20px as per premium look but could use t.radius.pill if it fits
                    boxShadow: t.shadow.xl,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    border: `1px solid ${t.color.borderLight}`,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Subtle top highlight inner reflection */}
                <div style={{
                    position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)'
                }} />

                <div style={{ textAlign: 'center', marginBottom: '0px' }}>
                    <motion.h2
                        variants={itemVariants}
                        style={{ 
                            fontSize: 'clamp(22px, 3.5vw, 28px)', 
                            fontWeight: 800, 
                            color: t.color.textPrimary, 
                            letterSpacing: '-0.03em', 
                            lineHeight: 1.1,
                            marginBottom: '8px'
                        }}
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        style={{ 
                            fontSize: '13px', 
                            color: t.color.textSecondary,
                            fontWeight: 500,
                            lineHeight: 1.5,
                            padding: '0 5%'
                        }}
                    >
                        {subtitle}
                    </motion.p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={grid ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' } : { display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {renderedChildren}
                    </div>

                    <motion.div variants={itemVariants} style={{ marginTop: '24px' }}>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            size="lg" 
                            className="w-full" 
                            disabled={isLoading}
                            style={{ 
                                height: '44px', 
                                fontSize: '14px', 
                                fontWeight: 700,
                                letterSpacing: '0.01em',
                                borderRadius: '12px',
                                boxShadow: `0 6px 16px -4px ${t.color.primary}50`
                            }}
                        >
                            {isLoading ? loadingText : submitText}
                        </Button>
                    </motion.div>
                </form>

                <motion.div
                    variants={itemVariants}
                    style={{ 
                        textAlign: 'center', 
                        fontSize: '11px', 
                        color: t.color.textPlaceholder, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '6px',
                        letterSpacing: '0.05em',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        marginTop: '8px'
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: t.color.success }}>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Enterprise Security Active
                </motion.div>
            </motion.div>

            {footer && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    style={{ 
                        textAlign: 'center', 
                        marginTop: '32px', 
                        fontSize: '14px', 
                        color: t.color.textSecondary,
                        fontWeight: 500,
                        position: 'relative',
                        zIndex: 10
                    }}
                >
                    {footer}
                </motion.div>
            )}
        </AuthLayout>
    );
}

export default AuthForm;
