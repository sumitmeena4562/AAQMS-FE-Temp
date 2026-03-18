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
            whileHover={hoverEffect ? { y: -5, transition: { duration: 0.3, ease: "easeOut" } } : {}}
            className={`
                relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg 
                ${hoverEffect ? 'hover:shadow-2xl transition-shadow duration-300' : ''}
                ${className}
            `}
            style={{
                padding: padding || '24px',
                borderRadius: borderRadius || '24px',
                ...style
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
