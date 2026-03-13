import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MdErrorOutline, MdArrowBack } from 'react-icons/md';
import { t } from '../theme/theme';

const NotFound = () => {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            background: t.color.bgSecondary
        }}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: t.radius.circle,
                    background: `${t.color.error}10`,
                    color: t.color.error,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '32px'
                }}
            >
                <MdErrorOutline size={64} />
            </motion.div>

            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                    fontSize: '48px',
                    fontWeight: 800,
                    color: t.color.primaryDark,
                    marginBottom: '16px',
                    letterSpacing: '-0.04em'
                }}
            >
                404
            </motion.h1>

            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: t.color.primaryDark,
                    marginBottom: '16px'
                }}
            >
                Page Not Found
            </motion.h2>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{
                    fontSize: '16px',
                    color: t.color.textSecondary,
                    maxWidth: '450px',
                    lineHeight: 1.6,
                    marginBottom: '40px'
                }}
            >
                The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
            </motion.p>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <Link
                    to="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '14px 28px',
                        background: t.color.primary,
                        color: t.color.textInverse,
                        borderRadius: t.radius.md,
                        fontSize: '15px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: t.shadow.sm
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = t.shadow.md;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = t.shadow.sm;
                    }}
                >
                    <MdArrowBack size={20} />
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
