import { useEffect, useRef } from 'react';
import { useAnimation, useInView } from 'framer-motion';

/**
 * Hook for Framer Motion scroll-triggered animations
 */
export const useMotionScroll = (threshold = 0.1) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    return { ref, controls };
};

export default useMotionScroll;
