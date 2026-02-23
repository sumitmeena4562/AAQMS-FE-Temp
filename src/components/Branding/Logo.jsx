import React from 'react';

const Logo = ({ collapsed = false, size = 'md' }) => {
    // Size presets for different contexts
    const sizes = {
        sm: { icon: 30, svg: 16, font: 'var(--font-size-xs)', sub: '9px', gap: 8, padding: '0' },
        md: { icon: 34, svg: 18, font: 'var(--font-size-sm)', sub: '9px', gap: 10, padding: '0' },
        lg: { icon: 42, svg: 22, font: 'var(--font-size-base)', sub: '10px', gap: 12, padding: '20px' },
    };

    const s = sizes[size];

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : s.gap,
            padding: s.padding,
            justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
            {/* Shield Icon */}
            <div style={{
                width: s.icon,
                height: s.icon,
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(7, 34, 103, 0.3)',
            }}>
                <svg
                    width={s.svg}
                    height={s.svg}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 2L4 6V12C4 16.42 7.4 20.74 12 22C16.6 20.74 20 16.42 20 12V6L12 2Z"
                        fill="rgba(255,255,255,0.15)"
                        stroke="#fff"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M9 12L11 14L15 10"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Brand Text */}
            {!collapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    <span style={{
                        fontSize: s.font,
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.2,
                    }}>
                        AI Safety
                    </span>
                    <span style={{
                        fontSize: s.sub,
                        fontWeight: 500,
                        color: 'var(--color-text-muted)',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                    }}>
                        Management System
                    </span>
                </div>
            )}
        </div>
    );
};

export default Logo;
