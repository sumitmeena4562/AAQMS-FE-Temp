/**
 * Common Framer Motion animation variants for consistent project transitions.
 */
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

export default animationVariants;
