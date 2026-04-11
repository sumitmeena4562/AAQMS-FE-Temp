import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * --- MAGNETIC BUTTON ---
 * A high-end interactive component that pulls towards the cursor.
 * Enhance user engagement with subtle physical-based movement.
 */
const MagneticButton = ({ children, className, ...props }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { width, height, left, top } = ref.current.getBoundingClientRect();
        
        // Calculate relative position from center
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        
        // Apply magnetic pull (capped at 15px)
        setPosition({ x: x * 0.35, y: y * 0.35 });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default MagneticButton;
