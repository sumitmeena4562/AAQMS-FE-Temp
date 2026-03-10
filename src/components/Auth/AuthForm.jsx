import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/UI/Button";

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

/**
 * Reusable AuthForm component for Login and Registration
 * Simplifies the UI structure while keeping premium animations.
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

    // We pass register and errors to children via a render prop pattern or cloning
    // But for "beginner-friendly" simplicity, we'll just pass them to children if they are a function
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
                    backgroundColor: 'var(--color-bg-secondary)',
                    padding: 'clamp(24px, 5vw, 40px) clamp(20px, 4vw, 32px)',
                    borderRadius: 'var(--radius-card)',
                    boxShadow: '0 20px 40px -20px rgba(0,0,0,0.1)',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    border: '1px solid var(--color-border-light)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <motion.h2
                        variants={itemVariants}
                        style={{ 
                            fontSize: 'clamp(24px, 4vw, 32px)', 
                            fontWeight: 800, 
                            color: 'var(--color-text-primary)', 
                            letterSpacing: '-0.03em', 
                            lineHeight: 1.1,
                            marginBottom: '10px'
                        }}
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        style={{ 
                            fontSize: 'clamp(14px, 2vw, 15px)', 
                            color: 'var(--color-text-secondary)',
                            fontWeight: 500
                        }}
                    >
                        {subtitle}
                    </motion.p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={grid ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' } : { display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {renderedChildren}
                    </div>

                    <motion.div variants={itemVariants} style={{ marginTop: '24px' }}>
                        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                            {isLoading ? loadingText : submitText}
                        </Button>
                    </motion.div>
                </form>

                <motion.div
                    variants={itemVariants}
                    style={{ 
                        textAlign: 'center', 
                        fontSize: '11px', 
                        color: 'var(--color-text-muted)', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '6px',
                        letterSpacing: '0.02em',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Enterprise Security Active
                </motion.div>
            </motion.div>

            {footer && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    style={{ 
                        textAlign: 'center', 
                        marginTop: '32px', 
                        fontSize: '14px', 
                        color: 'var(--color-text-secondary)',
                        fontWeight: 500 
                    }}
                >
                    {footer}
                </motion.div>
            )}
        </AuthLayout>
    );
}

export default AuthForm;
