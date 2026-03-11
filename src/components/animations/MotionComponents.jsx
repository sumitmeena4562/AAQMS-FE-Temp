import React from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

// Scroll-triggered animation hook
export const useScrollAnimation = (threshold = 0.1) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, threshold });
    const controls = useAnimation();

    React.useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    return { ref, controls };
};

// Common animation variants
export const animationVariants = {
    fadeIn: {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.6, ease: "easeOut" }
        }
    },
    slideInLeft: {
        hidden: { opacity: 0, x: -50 },
        visible: { 
            opacity: 1, 
            x: 0, 
            transition: { duration: 0.6, ease: "easeOut" }
        }
    },
    slideInRight: {
        hidden: { opacity: 0, x: 50 },
        visible: { 
            opacity: 1, 
            x: 0, 
            transition: { duration: 0.6, ease: "easeOut" }
        }
    },
    scaleIn: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            transition: { duration: 0.4, ease: "easeOut" }
        }
    },
    staggerContainer: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    },
    hoverScale: {
        rest: { scale: 1 },
        hover: { 
            scale: 1.02,
            transition: { duration: 0.2, ease: "easeOut" }
        }
    },
    buttonHover: {
        rest: { scale: 1, y: 0 },
        hover: { 
            scale: 1.05,
            y: -2,
            transition: { duration: 0.2, ease: "easeOut" }
        }
    },
    cardHover: {
        rest: { y: 0, scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
        hover: { 
            y: -4,
            scale: 1.02,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            transition: { duration: 0.3, ease: "easeOut" }
        }
    }
};

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
            className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            {...props}
        />
    );
};

// Skeleton loader component
export const SkeletonLoader = ({ className, height = "auto", width = "100%", borderRadius = "4px", ...props }) => (
    <motion.div
        className={`bg-gray-200 rounded ${className}`}
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
            className="fixed top-0 left-0 h-1 bg-blue-600 z-50"
            style={{ width: `${scrollPercentage}%` }}
            initial={{ width: "0%" }}
            animate={{ width: `${scrollPercentage}%` }}
            transition={{ duration: 0.1 }}
        />
    );
};

export default {
    useScrollAnimation,
    animationVariants,
    MotionSection,
    MotionDiv,
    MotionCard,
    MotionButton,
    MotionLink,
    MotionImage,
    MotionList,
    MotionListItem,
    StaggeredContainer,
    HoverEffect,
    LoadingSpinner,
    SkeletonLoader,
    ScrollProgress
};