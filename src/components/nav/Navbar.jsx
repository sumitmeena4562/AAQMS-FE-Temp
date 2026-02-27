import React, { useState } from 'react';
import Logo from '../Branding/Logo';

const Navbar = ({
    navLinks = [],
    buttons = [],
    showLogo = true,
    sticky = true,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const buttonStyles = {
        outline: {
            padding: '8px 18px',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            background: 'transparent',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
            whiteSpace: 'nowrap',
        },
        filled: {
            padding: '8px 18px',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-primary)',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
            whiteSpace: 'nowrap',
        },
    };

    return (
        <header style={{
            height: 'var(--navbar-height)',
            background: 'var(--color-bg-secondary)',
            borderBottom: '1px solid var(--color-border)',
            position: sticky ? 'sticky' : 'relative',
            top: 0,
            zIndex: 100,
            width: '100%',
        }}>
            <nav style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                height: '100%',
                maxWidth: '1440px',
                margin: '0 auto',
            }}>
                {/* Left — Logo */}
                {showLogo && (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                        <Logo size="md" />
                    </div>
                )}

                {/* Center — Desktop Nav Links */}
                <div className="desktop-nav" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '32px',
                    justifyContent: 'center',
                    flex: 2,
                }}>
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            style={{
                                fontWeight: 500,
                                color: 'var(--color-text-secondary)',
                                textDecoration: 'none',
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Right — Desktop Buttons */}
                <div className="desktop-actions" style={{ flex: 1, display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {buttons.map((btn) => (
                        <button
                            key={btn.label}
                            onClick={btn.onClick}
                            style={buttonStyles[btn.variant || 'outline']}
                            onMouseEnter={(e) => {
                                if (btn.variant !== 'filled') {
                                    e.target.style.background = 'var(--color-bg-primary)';
                                    e.target.style.borderColor = 'var(--color-border-dark)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (btn.variant !== 'filled') {
                                    e.target.style.background = 'transparent';
                                    e.target.style.borderColor = 'var(--color-border)';
                                }
                            }}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    className="mobile-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        display: 'none',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        color: 'var(--color-text-primary)'
                    }}
                >
                    {isMenuOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    )}
                </button>
            </nav>

            {/* Mobile Menu Drawer */}
            <div
                className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}
                style={{
                    position: 'fixed',
                    top: 'var(--navbar-height)',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: '#fff',
                    zIndex: 90,
                    display: 'none',
                    flexDirection: 'column',
                    padding: '32px 24px',
                    gap: '24px',
                    transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
                    visibility: isMenuOpen ? 'visible' : 'hidden',
                    overflowY: 'auto'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>NAVIGATION</span>
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                fontSize: '18px',
                                fontWeight: 600,
                                color: 'var(--color-text-primary)',
                                textDecoration: 'none',
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div style={{ height: '1px', background: 'var(--color-border-light)', width: '100%', margin: '8px 0' }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>ACCOUNT</span>
                    {buttons.map((btn) => (
                        <button
                            key={btn.label}
                            onClick={() => { btn.onClick?.(); setIsMenuOpen(false); }}
                            style={{
                                padding: '12px',
                                width: '100%',
                                textAlign: 'left',
                                borderRadius: '12px',
                                border: btn.variant === 'filled' ? 'none' : '1px solid var(--color-border)',
                                background: btn.variant === 'filled' ? 'var(--color-primary)' : 'transparent',
                                color: btn.variant === 'filled' ? '#fff' : 'var(--color-text-primary)',
                                fontSize: '16px',
                                fontWeight: 600,
                            }}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 991px) {
                    .desktop-nav, .desktop-actions {
                        display: none !important;
                    }
                    .mobile-toggle {
                        display: block !important;
                    }
                    .mobile-menu {
                        display: flex !important;
                    }
                }
            `}} />
        </header>
    );
};

export default Navbar;
