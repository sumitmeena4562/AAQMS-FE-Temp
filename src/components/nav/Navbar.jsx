import React from 'react';
import Logo from '../Branding/Logo';

const Navbar = ({
    navLinks = [],
    buttons = [],
    showLogo = true,
    sticky = true,
}) => {
    const buttonStyles = {
        outline: {
            padding: '6px 14px',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 500,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            background: 'transparent',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
            transition: 'all var(--transition-fast)',
        },
        filled: {
            padding: '6px 14px',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 500,
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-primary)',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
            transition: 'all var(--transition-fast)',
        },
    };

    return (
        <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            height: '4rem',
            background: 'var(--color-bg-secondary)',
            borderBottom: '1px solid var(--color-border)',
            position: sticky ? 'sticky' : 'relative',
            top: 0,
            zIndex: 50,
        }}>
            {/* Left — Logo (compact size for navbar)
            {showLogo && <Logo size="md" />} */}

            {/* Center — Nav Links */}
            {navLinks.length > 0 && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 28,
                }}>
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            style={{
                                fontSize: 'var(--font-size-xs)',
                                fontWeight: 500,
                                color: 'var(--color-text-secondary)',
                                textDecoration: 'none',
                                transition: 'color var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--color-text-primary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            )}

            {/* Right — Buttons */}
            {buttons.length > 0 && (
                <div style={{ display: 'flex', gap: 8 }}>
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
            )}
        </nav>
    );
};

export default Navbar;
