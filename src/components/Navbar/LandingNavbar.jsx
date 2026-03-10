import React, { useState } from 'react';
import Logo from '../Branding/Logo';

const Navbar = ({
    navLinks = [],
    buttons = [],
    sticky = true,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Track scroll for background change
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const buttonStyles = {
        outline: {
            padding: '10px 22px',
            fontSize: '13px',
            fontWeight: 700,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
        },
        filled: {
            padding: '10px 22px',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary)',
            color: 'var(--color-text-inverse)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
        },
    };

    return (
        <header style={{
            height: 'var(--navbar-height)',
            background: isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
            backdropFilter: isScrolled ? 'blur(16px)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
            borderBottom: isScrolled ? '1px solid var(--color-border-light)' : 'none',
            position: sticky ? 'sticky' : 'relative',
            top: 0,
            zIndex: 1000,
            width: '100%',
            transition: 'background 0.3s ease, height 0.3s ease, border 0.3s ease'
        }}>
            <nav style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 clamp(16px, 5vw, 40px)',
                height: '100%',
                maxWidth: '1280px',
                margin: '0 auto',
            }}>
                {/* Left — Logo */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                    <Logo size="md" />
                </div>

                {/* Center — Desktop Nav Links */}
                <div className="desktop-nav" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '40px',
                    justifyContent: 'center',
                    flex: 2,
                }}>
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href || '#'}
                            onClick={(e) => {
                                if (link.onClick) {
                                    e.preventDefault();
                                    link.onClick();
                                }
                            }}
                            style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--color-text-secondary)',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Right — Desktop Buttons */}
                <div className="desktop-actions" style={{ flex: 1, display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {buttons.map((btn) => (
                        <button
                            key={btn.label}
                            onClick={btn.onClick}
                            style={buttonStyles[btn.variant || 'outline']}
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
                    background: 'var(--color-bg-primary)',
                    zIndex: 999,
                    display: 'none',
                    flexDirection: 'column',
                    padding: '24px',
                    gap: '32px',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                    opacity: isMenuOpen ? 1 : 0,
                    visibility: isMenuOpen ? 'visible' : 'hidden',
                    overflowY: 'auto',
                    borderTop: '1px solid var(--color-border-light)'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.15em', opacity: 0.6 }}>MAIN NAVIGATION</span>
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href || '#'}
                            onClick={(e) => {
                                setIsMenuOpen(false);
                                if (link.onClick) {
                                    e.preventDefault();
                                    link.onClick();
                                }
                            }}
                            style={{
                                fontSize: '20px',
                                fontWeight: 700,
                                color: 'var(--color-text-primary)',
                                textDecoration: 'none',
                                animation: isMenuOpen ? 'fadeInUp 0.4s ease forwards' : 'none'
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div style={{ height: '1px', background: 'var(--color-border-light)', width: '100%' }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.15em', opacity: 0.6 }}>ACCESS PORTAL</span>
                    {buttons.map((btn) => (
                        <button
                            key={btn.label}
                            onClick={() => { btn.onClick?.(); setIsMenuOpen(false); }}
                            style={{
                                padding: '16px',
                                width: '100%',
                                textAlign: 'center',
                                borderRadius: '14px',
                                border: btn.variant === 'filled' ? 'none' : '1px solid var(--color-border)',
                                background: btn.variant === 'filled' ? 'var(--color-primary)' : 'transparent',
                                color: btn.variant === 'filled' ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
                                fontSize: '15px',
                                fontWeight: 700,
                                boxShadow: btn.variant === 'filled' ? 'var(--shadow-premium)' : 'none'
                            }}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
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
