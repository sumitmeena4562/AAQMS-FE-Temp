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
        ...style
    };

    return (
        <div
            className={`card-container ${className}`}
            style={baseStyle}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
