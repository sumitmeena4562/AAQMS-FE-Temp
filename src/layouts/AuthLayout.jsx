import React from 'react';
import Logo from '../components/Branding/Logo';

const AuthLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            {/* Left Side (Hidden on Mobile) */}
            <div
                className="auth-left"
                style={{
                    flex: 1,
                    backgroundColor: 'var(--color-bg-auth-side)', /* Fixed Dark background */
                    padding: 'var(--spacing-12)',
                    display: 'none',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Logo top-left */}
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center' }}>
                    <div className="auth-logo-wrapper">
                        <Logo size="lg" />
                    </div>
                </div>

                {/* Text overlay at bottom */}
                <div style={{ position: 'relative', zIndex: 10, maxWidth: '600px', marginTop: 'auto' }}>
                    <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, color: 'var(--color-text-inverse)', lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.03em' }}>
                        Structured Safety.<br />Intelligent Monitoring.
                    </h1>
                    <p style={{ fontSize: 'var(--font-size-lg)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                        Enterprise-grade risk management powered by predictive AI. Secure your workforce with real-time analytics.
                    </p>
                </div>

                {/* Decorative radial glow */}
                <div style={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '80%',
                    height: '80%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: 1
                }}></div>
            </div>

            {/* Right Side (Form Container) */}
            <div style={{ flex: 1, backgroundColor: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    {children}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (min-width: 900px) {
                    .auth-left { display: flex !important; }
                }
                /* Override Logo text colors for dark background */
                .auth-logo-wrapper span {
                    color: white !important;
                }
                .auth-logo-wrapper span:last-child {
                    color: rgba(255, 255, 255, 0.7) !important;
                }
            `}} />
        </div>
    );
};

export default AuthLayout;
