import React from 'react';

const Card = ({
    children,
    className = '',
    style = {},
    padding = '24px',
    borderRadius = '16px',
    hoverEffect = false,
    ...props
}) => {

    // Base styles
    const baseStyle = {
        background: '#fff',
        borderRadius: borderRadius,
        padding: padding,
        boxShadow: '0 10px 32px rgba(0,0,0,0.06)', // Increased shadow
        border: '1px solid var(--color-border-light)',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
        ...style
    };

    // Hover effect handlers
    const handleMouseEnter = (e) => {
        if (hoverEffect) {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.12)'; // Increased hover shadow
        }
    };

    const handleMouseLeave = (e) => {
        if (hoverEffect) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)'; // Back to increased shadow
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
