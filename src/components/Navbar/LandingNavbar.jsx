import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../Branding/Logo';
import { t } from '../../theme/theme';

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
        
        // Prevent body scroll when menu is open
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    const buttonStyles = {
        outline: {
            padding: '10px 22px',
            fontSize: '13px',
            fontWeight: 700,
            border: `1px solid ${t.color.border}`,
            borderRadius: t.radius.md,
            background: 'transparent',
            color: t.color.text,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
        },
        filled: {
            padding: '10px 22px',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            borderRadius: t.radius.md,
            background: t.color.primary,
            color: t.color.textInverse,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
        },
    };

    const menuVariants = {
        closed: { 
            opacity: 0,
            x: '100%',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40
            }
        },
        open: { 
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, y: 20 },
        open: { opacity: 1, y: 0 }
    };

    return (
        <>
            <header style={{
                height: t.layout.navbarHeight,
                background: isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(16px)' : 'none',
                WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
                borderBottom: isScrolled ? `1px solid ${t.color.borderLight}` : 'none',
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
                    position: 'relative',
                }}>
                    {/* Left — Logo */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', zIndex: 1100 }}>
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
                                    color: t.color.textSecondary,
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.color = t.color.primary}
                                onMouseLeave={(e) => e.target.style.color = t.color.textSecondary}
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
                            color: t.color.text,
                            zIndex: 2100,
                            position: 'relative'
                        }}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        )}
                    </button>
                </nav>
            </header>

            {/* Mobile Menu Drawer Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="mobile-menu-drawer"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            background: '#ffffff', // Explicit solid white
                            backgroundImage: 'linear-gradient(to bottom, #ffffff, #f8faff)',
                            zIndex: 2000,
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '100px 32px 40px',
                            gap: '48px',
                            overflowY: 'auto',
                            boxShadow: 'var(--shadow-premium)'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                            <motion.span 
                                variants={itemVariants}
                                style={{ 
                                    fontSize: '11px', 
                                    fontWeight: 800, 
                                    color: 'var(--color-text-muted)', 
                                    letterSpacing: '0.2em', 
                                    opacity: 0.8,
                                    textTransform: 'uppercase'
                                }}
                            >
                                Main Navigation
                            </motion.span>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {navLinks.map((link) => (
                                    <motion.a
                                        key={link.label}
                                        variants={itemVariants}
                                        href={link.href || '#'}
                                        onClick={(e) => {
                                            setIsMenuOpen(false);
                                            if (link.onClick) {
                                                e.preventDefault();
                                                link.onClick();
                                            }
                                        }}
                                        whileHover={{ x: 10, color: t.color.primary }}
                                        style={{
                                            fontSize: '22px',
                                            fontWeight: 800,
                                            color: t.color.text,
                                            textDecoration: 'none',
                                            display: 'block',
                                            transition: 'color 0.2s ease'
                                        }}
                                    >
                                        {link.label}
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        <div style={{ height: '1px', background: t.color.borderLight, width: '100%', opacity: 0.5 }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <motion.span 
                                variants={itemVariants}
                                style={{ 
                                    fontSize: '11px', 
                                    fontWeight: 800, 
                                    color: 'var(--color-text-muted)', 
                                    letterSpacing: '0.2em', 
                                    opacity: 0.8,
                                    textTransform: 'uppercase'
                                }}
                            >
                                Secure Access
                            </motion.span>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {buttons.map((btn) => (
                                    <motion.button
                                        key={btn.label}
                                        variants={itemVariants}
                                        onClick={() => { btn.onClick?.(); setIsMenuOpen(false); }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            padding: '18px',
                                            width: '100%',
                                            textAlign: 'center',
                                            borderRadius: '16px',
                                            border: btn.variant === 'filled' ? 'none' : `1px solid ${t.color.border}`,
                                            background: btn.variant === 'filled' ? t.color.primary : 'transparent',
                                            color: btn.variant === 'filled' ? t.color.textInverse : t.color.text,
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            boxShadow: btn.variant === 'filled' ? `0 10px 20px -10px ${t.color.primary}` : 'none'
                                        }}
                                    >
                                        {btn.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 991px) {
                    .desktop-nav, .desktop-actions {
                        display: none !important;
                    }
                    .mobile-toggle {
                        display: block !important;
                    }
                }
            `}} />
        </>
    );
};

export default Navbar;
