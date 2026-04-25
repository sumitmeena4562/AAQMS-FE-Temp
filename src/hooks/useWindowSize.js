import { useState, useEffect } from 'react';

/**
 * useWindowSize Hook
 * Returns the current window dimensions.
 */
export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        let timeoutId = null;
        const handleResize = () => {
            // Basic throttle to prevent excessive state updates during resize
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }, 150);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowSize;
};

/**
 * useResponsiveLimit Hook
 * Returns a limit (items per page) based on screen width breakpoints.
 * Optimized for grid layouts of 1, 2, 3, 4, 5 columns.
 */
export const useResponsiveLimit = () => {
    const { width } = useWindowSize();

    if (width >= 1536) return 15; // 2xl: 5 cols * 3 rows
    if (width >= 1280) return 12; // xl: 4 cols * 3 rows
    if (width >= 1024) return 12; // lg: 3 cols * 4 rows
    if (width >= 640) return 12;  // sm: 2 cols * 6 rows
    return 10; // base: 1 col * 10 rows
};
