import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
    children,
    className = '',
    style = {},
    padding, // Optional override
    borderRadius, // Optional override
    hoverEffect = true,
    ...props
}) => {
    return (
        <motion.div
            className={`
                relative overflow-hidden elite-card 
                ${hoverEffect ? 'elite-card-hover' : ''}
                ${className}
            `}
            style={{
                padding: padding || '24px',
                ...style
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
