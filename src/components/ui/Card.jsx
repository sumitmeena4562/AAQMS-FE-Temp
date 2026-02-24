import React from 'react';

const Card = ({
    children,
    className = '',
    style = {},
    padding = 'var(--space-card)',
    borderRadius = 'var(--radius-card)',
    hoverEffect = false,
    ...props
}) => {

    // Base styles
    const baseStyle = {
        background: '#fff',
        borderRadius: borderRadius,
        padding: padding,
        boxShadow: 'var(--shadow-premium)',
        border: '1px solid var(--color-border-light)',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
        ...style
    };

    // Hover effect handlers
    const handleMouseEnter = (e) => {
        if (hoverEffect) {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-premium-hover)';
        }
    };

    const handleMouseLeave = (e) => {
        if (hoverEffect) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = baseStyle.boxShadow;
        }
    };

    return (
        <div
            className={`card-container ${className}`}
            style={baseStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
