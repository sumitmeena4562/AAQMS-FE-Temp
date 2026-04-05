import React from 'react';
import { motion } from 'framer-motion';
import { animationVariants } from '../../theme/animations';

// Motion components
export const MotionSection = ({ children, className, ...props }) => (
    <motion.section
        className={className}
        variants={animationVariants.fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        {...props}
    >
        {children}
    </motion.section>
);

export const MotionDiv = ({ children, className, ...props }) => (
    <motion.div
        className={className}
        variants={animationVariants.fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        {...props}
    >
        {children}
    </motion.div>
);

export const MotionCard = ({ children, className, ...props }) => (
    <motion.div
        className={className}
        variants={animationVariants.scaleIn}
        initial="hidden"
        whileInView="visible"
        whileHover="hover"
        viewport={{ once: true, amount: 0.1 }}
        {...props}
    >
        {children}
    </motion.div>
);

export const MotionButton = ({ children, className, ...props }) => (
    <motion.button
        className={className}
        variants={animationVariants.buttonHover}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        {...props}
    >
        {children}
    </motion.button>
);

export const MotionLink = ({ children, className, ...props }) => (
    <motion.a
        className={className}
        variants={animationVariants.hoverScale}
        initial="rest"
        whileHover="hover"
        {...props}
    >
        {children}
    </motion.a>
);

export const MotionImage = ({ src, alt, className, ...props }) => (
    <motion.img
        src={src}
        alt={alt}
        className={className}
        variants={animationVariants.fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        {...props}
    />
);

export const MotionList = ({ children, className, ...props }) => (
    <motion.ul
        className={className}
        variants={animationVariants.staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        {...props}
    >
        {children}
    </motion.ul>
);

export const MotionListItem = ({ children, className, ...props }) => (
    <motion.li
        className={className}
        variants={animationVariants.fadeIn}
        {...props}
    >
        {children}
    </motion.li>
);

// Staggered animation wrapper
export const StaggeredContainer = ({ children, className, ...props }) => (
    <motion.div
        className={className}
        variants={animationVariants.staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        {...props}
    >
        {children}
    </motion.div>
);

// Hover effect wrapper
export const HoverEffect = ({ children, className, variant = "cardHover", ...props }) => (
    <motion.div
        className={className}
        variants={animationVariants[variant]}
        initial="rest"
        whileHover="hover"
        {...props}
    >
        {children}
    </motion.div>
);

// Loading animation component
export const LoadingSpinner = ({ size = "medium", className, ...props }) => {
    const sizeClasses = {
        small: "w-4 h-4",
        medium: "w-6 h-6",
        large: "w-8 h-8"
    };

    return (
        <motion.div
            className={`animate-spin rounded-full border-2 border-slate-300 border-t-primary ${sizeClasses[size]} ${className}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            {...props}
        />
    );
};

// Skeleton loader component
export const SkeletonLoader = ({ className, height = "auto", width = "100%", borderRadius = "4px", ...props }) => (
    <motion.div
        className={`bg-slate-200 rounded ${className}`}
        style={{ height, width, borderRadius }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        {...props}
    />
);

// Scroll progress indicator
export const ScrollProgress = () => {
    const [scrollY, setScrollY] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollPercentage = (scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

    return (
        <motion.div
            className="fixed top-0 left-0 h-1 bg-primary z-50"
            style={{ width: `${scrollPercentage}%` }}
            initial={{ width: "0%" }}
            animate={{ width: `${scrollPercentage}%` }}
            transition={{ duration: 0.1 }}
        />
    );
};