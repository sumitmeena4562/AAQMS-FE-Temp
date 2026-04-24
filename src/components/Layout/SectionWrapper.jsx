import React from 'react';
import { cn } from '../../utils/cn';

/**
 * ── SECTION WRAPPER ──
 * A generic layout container that wraps section content with 
 * a professional Blueprint background.
 */
const SectionWrapper = ({ 
    children, 
    className
}) => {
    return (
        <section 
            className={cn(
                "relative py-16 sm:py-24 overflow-hidden bg-transparent transition-colors duration-500",
                className
            )}
        >

            {/* Section Content */}
            <div className="relative z-20 container mx-auto px-6">
                {children}
            </div>
        </section>
    );
};

export default SectionWrapper;
