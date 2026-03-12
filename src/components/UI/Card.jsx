import React from 'react';
import t from '../../theme/theme';

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

    // Premium base styles using theme variables
    const baseStyle = {
        background: 'var(--color-bg-secondary)',
        borderRadius: borderRadius,
        padding: padding,
        boxShadow: isHovered && hoverEffect
            ? t.shadow.cardHover
            : t.shadow.card,
        border: '1px solid var(--color-border-light)',
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
