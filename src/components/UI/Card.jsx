import React from 'react';

const Card = ({
    children,
    className = '',
    style = {},
    padding = '24px',
    borderRadius = '16px',
    hoverEffect = true,
    ...props
}) => {
    const [isHovered, setIsHovered] = React.useState(false);

    // Premium base styles using explicit values
    const baseStyle = {
        background: '#ffffff',
        borderRadius: borderRadius,
        padding: padding,
        boxShadow: isHovered && hoverEffect
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        border: '1px solid #f1f5f9',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered && hoverEffect ? 'translateY(-4px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
        ...style
    };

    return (
        <div
            className={`card-container ${className}`}
            style={baseStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
