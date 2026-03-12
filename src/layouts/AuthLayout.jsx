import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../components/Branding/Logo';
import { t } from '../theme/theme';

const AuthLayout = ({ children }) => {
    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            width: '100%',
            backgroundColor: t.color.bgPage, // Using global theme page background
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Ambient Gradients */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    top: '-10%', left: '-5%', width: '50vw', height: '50vw',
                    background: `radial-gradient(circle, ${t.color.primary}15 0%, transparent 60%)`,
                    filter: 'blur(80px)',
                    zIndex: 0
                }}
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2],
                    y: [0, -50, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                style={{
                    position: 'absolute',
                    bottom: '-10%', right: '-5%', width: '60vw', height: '60vw',
                    background: `radial-gradient(circle, ${t.color.secondary}15 0%, transparent 60%)`,
                    filter: 'blur(100px)',
                    zIndex: 0
                }}
            />

            {/* Left Side (Hidden on Mobile) */}
            <div
                className="auth-sidebar"
                style={{
                    flex: 1.2,
                    backgroundColor: t.color.primaryDark,
                    padding: 'clamp(24px, 5vw, 64px)',
                    display: 'none',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: 'inset -20px 0 60px rgba(0,0,0,0.3)',
                    clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' // Dynamic angled cut
                }}
            >
                {/* Logo top-left */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ position: 'relative', zIndex: 10 }}
                >
                    <Logo size="lg" inverse />
                </motion.div>

                {/* Text overlay at bottom */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ position: 'relative', zIndex: 10, maxWidth: '600px', paddingRight: '8%' }}
                >
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '24px'
                    }}>
                        Platform Access
                    </div>
                    <h1 style={{ 
                        fontSize: 'clamp(2rem, 4vw, 3.2rem)', 
                        fontWeight: 900, 
                        color: t.color.textInverse, 
                        lineHeight: 1.05, 
                        marginBottom: '20px', 
                        letterSpacing: '-0.03em' 
                    }}>
                        Structured Safety.<br />
                        <span style={{ 
                            background: 'linear-gradient(135deg, #A5B4FC 0%, #E0E7FF 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Intelligent Monitoring.</span>
                    </h1>
                    <p style={{ 
                        fontSize: t.fontSize.lg, 
                        color: 'rgba(255,255,255,0.7)', 
                        lineHeight: 1.6,
                        maxWidth: '480px',
                        fontWeight: 500
                    }}>
                        Enterprise-grade risk management powered by predictive AI. Secure your workforce with real-time analytics.
                    </p>
                </motion.div>

                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: '20%', right: '10%',
                    width: '300px', height: '300px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.05)',
                    zIndex: 1
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '30%', right: '15%',
                    width: '200px', height: '200px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.08)',
                    zIndex: 1
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '-20%',
                    right: '-20%',
                    width: '120%',
                    height: '100%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: 1
                }}></div>
            </div>

            {/* Right Side (Form Container) */}
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: 'clamp(20px, 4vw, 40px)',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    {children}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (min-width: 992px) {
                    .auth-sidebar { display: flex !important; }
                }
            `}} />
        </div>
    );
};

export default AuthLayout;
