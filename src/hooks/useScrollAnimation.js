import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Intersection observer threshold (0-1)
 * @param {boolean} options.once - Whether to trigger animation only once
 * @param {string} options.rootMargin - Root margin for intersection observer
 * @returns {Object} - ref, isVisible, and controls
 */
export const useScrollAnimation = (options = {}) => {
    const {
        threshold = 0.1,
        once = true,
        rootMargin = '0px'
    } = options;

    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) {
                        setHasAnimated(true);
                        observer.unobserve(entry.target);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin,
                once
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, once, rootMargin]);

    return {
        ref,
        isVisible: once ? isVisible || hasAnimated : isVisible
    };
};

/**
 * Hook for scroll progress tracking
 * @returns {number} - Scroll progress percentage (0-100)
 */
export const useScrollProgress = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            setScrollProgress(Math.min(scrolled, 100));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return scrollProgress;
};

/**
 * Hook for parallax scrolling effect
 * @param {number} speed - Parallax speed factor (0-1)
 * @returns {Object} - style object for parallax effect
 */
export const useParallax = (speed = 0.5) => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.scrollY * speed);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return {
        transform: `translateY(${offset}px)`
    };
};

/**
 * Hook for sticky navigation with scroll effects
 * @param {number} offset - Offset from top before becoming sticky
 * @returns {Object} - sticky state and styles
 */
export const useStickyNav = (offset = 0) => {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > offset);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offset]);

    return {
        isSticky,
        style: {
            position: isSticky ? 'fixed' : 'relative',
            top: isSticky ? 0 : 'auto',
            zIndex: isSticky ? 1000 : 'auto',
            boxShadow: isSticky ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
            backgroundColor: isSticky ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
            backdropFilter: isSticky ? 'blur(10px)' : 'none'
        }
    };
};

export default {
    useScrollAnimation,
    useScrollProgress,
    useParallax,
    useStickyNav
};