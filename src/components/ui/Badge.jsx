import React from 'react';

const Badge = ({ children, color = 'primary', variant = 'solid', size = 'md' }) => {

    // Theme mapping for colors
    const colors = {
        primary: { bg: 'var(--color-primary)', text: '#fff', lightBg: 'var(--color-primary-50)', lightText: 'var(--color-primary)' },
        success: { bg: 'var(--color-success)', text: '#fff', lightBg: 'var(--color-success-lighter)', lightText: 'var(--color-success)' },
        danger: { bg: 'var(--color-danger)', text: '#fff', lightBg: 'var(--color-danger-lighter)', lightText: 'var(--color-danger)' },
        warning: { bg: 'var(--color-warning)', text: '#1f2937', lightBg: 'var(--color-warning-lighter)', lightText: 'var(--color-warning-dark)' },
        neutral: { bg: 'var(--color-bg-tertiary)', text: 'var(--color-text-secondary)', lightBg: 'var(--color-bg-secondary)', lightText: 'var(--color-text-muted)' },
    };

    const c = colors[color] || colors.primary;

    // Size mapping
    const sizes = {
        sm: { padding: '2px 6px', fontSize: '9px', radius: 'var(--radius-sm)' },
        md: { padding: '4px 8px', fontSize: '10px', radius: 'var(--radius-sm)' },
        lg: { padding: '6px 12px', fontSize: 'var(--font-size-xs)', radius: 'var(--radius-md)' },
        pill: { padding: '6px 16px', fontSize: 'var(--font-size-xs)', radius: 'var(--radius-full)' }
    };

    const s = sizes[size] || sizes.md;

    // Style generation based on variant
    const getStyles = () => {
        const baseStyles = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: s.padding,
            fontSize: s.fontSize,
            borderRadius: s.radius,
            whiteSpace: 'nowrap'
        };

        if (variant === 'light') {
            return { ...baseStyles, background: c.lightBg, color: c.lightText };
        }
        if (variant === 'outline') {
            return { ...baseStyles, background: 'transparent', color: c.lightText, border: `1px solid ${c.bg}` };
        }
        // Default solid
        return { ...baseStyles, background: c.bg, color: c.text };
    };

    return (
        <span style={getStyles()}>
            {children}
        </span>
    );
};

export default Badge;
