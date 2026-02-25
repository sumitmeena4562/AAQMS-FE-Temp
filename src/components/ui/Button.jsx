import React from 'react';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary', // primary, secondary, outline, text
    size = 'md', // sm, md, lg
    disabled = false,
    className = '',
    style = {},
    icon,
    fullWidth = false,
    ...props
}) => {

    // Dynamic Sizing
    const sizes = {
        sm: { padding: '8px 16px', fontSize: 'var(--font-size-xs)' },
        md: { padding: '12px 24px', fontSize: 'var(--font-size-sm)' },
        lg: { padding: '16px 32px', fontSize: 'var(--font-size-base)' },
    };

    // Dynamic Styling based on variants
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-text-inverse)',
                    border: '1px solid var(--color-primary)',
                };
            case 'secondary':
                return {
                    backgroundColor: 'var(--color-bg-tertiary)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid transparent',
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                };
            case 'danger':
                return {
                    backgroundColor: 'var(--color-danger)',
                    color: 'var(--color-text-inverse)',
                    border: 'none',
                };
            case 'dark': // Dark theme based button
                return {
                    backgroundColor: '#111827',
                    color: '#fff',
                    border: 'none',
                }
            case 'text':
                return {
                    backgroundColor: 'transparent',
                    color: 'var(--color-primary)',
                    border: 'none',
                    padding: '8px',
                };
            default:
                return {};
        }
    };

    const handleMouseOver = (e) => {
        if (disabled) return;
        if (variant === 'primary') e.target.style.backgroundColor = 'var(--color-primary-dark)';
        if (variant === 'outline') e.target.style.backgroundColor = 'var(--color-bg-hover)';
        if (variant === 'dark') e.target.style.backgroundColor = 'var(--color-text-secondary)';
    };

    const handleMouseOut = (e) => {
        if (disabled) return;
        if (variant === 'primary') e.target.style.backgroundColor = 'var(--color-primary)';
        if (variant === 'outline') e.target.style.backgroundColor = 'transparent';
        if (variant === 'dark') e.target.style.backgroundColor = '#111827';
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 600,
                borderRadius: 'var(--radius-lg)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-family)',
                transition: 'all var(--transition-fast)',
                opacity: disabled ? 0.6 : 1,
                width: fullWidth ? '100%' : 'auto',
                ...sizes[size],
                ...getVariantStyles(),
                ...style
            }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            {...props}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
