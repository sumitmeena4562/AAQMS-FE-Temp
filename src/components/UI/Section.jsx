import React from 'react';
import { cn } from '../../utils/cn';

/**
 * --- Section ---
 * Generic section wrapper that enforces standard layout and padding.
 * Now support 'withGlow' for the premium SaaS depth effect.
 * UPDATED: Compact vertical padding.
 */
const Section = ({ 
    children, 
    id, 
    className, 
    containerClassName,
    background = 'white', // 'white' | 'slate' | 'transparent'
    withGlow = true
}) => {
    const bgStyles = {
        white: 'bg-white',
        slate: 'bg-slate-50/50',
        transparent: 'bg-transparent'
    };

    return (
        <section 
            id={id} 
            className={cn(
                "relative py-16 sm:py-24 px-6 overflow-hidden",
                bgStyles[background],
                className
            )}
        >
            {/* Thematic Global Glow Effect */}
            {withGlow && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(7,34,103,0.02)_0%,_transparent_70%)]" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" />
                </div>
            )}

            <div className={cn("max-w-7xl mx-auto relative z-10", containerClassName)}>
                {children}
            </div>
        </section>
    );
};

export default Section;
