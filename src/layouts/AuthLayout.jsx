import React from 'react';
import Logo from '../components/Branding/Logo';
import { t } from '../theme/theme';

const AuthLayout = ({ children }) => {
    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            width: '100%',
            backgroundColor: t.color.bg
        }}>
            {/* Left Side (Hidden on Mobile) */}
            <div
                className="auth-sidebar"
                style={{
                    flex: 1,
                    backgroundColor: t.color.primaryDark,
                    padding: 'clamp(24px, 5vw, 64px)',
                    display: 'none',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Logo top-left */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <Logo size="lg" inverse />
                </div>

                {/* Text overlay at bottom */}
                <div style={{ position: 'relative', zIndex: 10, maxWidth: '600px' }}>
                    <h1 style={{ 
                        fontSize: 'clamp(2rem, 4vw, 3.375rem)', 
                        fontWeight: 800, 
                        color: t.color.textInverse, 
                        lineHeight: 1.1, 
                        marginBottom: '16px', 
                        letterSpacing: '-0.03em' 
                    }}>
                        Structured Safety.<br />Intelligent Monitoring.
                    </h1>
                    <p style={{ 
                        fontSize: t.fontSize.lg, 
                        color: 'rgba(255,255,255,0.6)', 
                        lineHeight: 1.5,
                        maxWidth: '480px'
                    }}>
                        Enterprise-grade risk management powered by predictive AI. Secure your workforce with real-time analytics.
                    </p>
                </div>

                {/* Decorative radial glow */}
                <div style={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '100%',
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
                padding: 'clamp(16px, 4vw, 40px)',
                position: 'relative'
            }}>
                <div style={{ width: '100%', maxWidth: '440px', zIndex: 2 }}>
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
