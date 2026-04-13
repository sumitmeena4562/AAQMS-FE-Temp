import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Global Loader Component
 * Supports three modes: fullScreen, overlay, and inline.
 * 
 * Props:
 *   mode     - 'fullScreen' | 'overlay' | 'inline' (default: 'overlay')
 *   text     - string (optional status text)
 *   size     - 'sm' | 'md' | 'lg' (default: 'md')
 *   className - string (extra classes)
 */
// Spinner Component
const Spinner = ({ s, text }) => (
    <div className="relative flex flex-col items-center justify-center gap-4">
        <svg 
            width={s.box} 
            height={s.box} 
            viewBox="0 0 50 50" 
            className="animate-spin"
        >
            {/* Background Ring */}
            <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth={s.stroke}
                className="opacity-10"
            />
            {/* Animated Primary Ring */}
            <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth={s.stroke}
                strokeLinecap="round"
                strokeDasharray="90, 150"
                className="text-primary"
            />
        </svg>
        
        {text && (
            <motion.span 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`${s.font} font-bold text-gray uppercase tracking-widest text-center`}
            >
                {text}
            </motion.span>
        )}
    </div>
);

const GlobalLoader = ({ 
    mode = 'overlay', 
    text, 
    size = 'md', 
    className = "" 
}) => {
    // Size configurations
    const sizes = {
        sm: { box: 24, stroke: 2.5, font: 'text-[10px]' },
        md: { box: 40, stroke: 3, font: 'text-[12px]' },
        lg: { box: 64, stroke: 4, font: 'text-[14px]' },
    };

    const s = sizes[size] || sizes.md;

    // Full Screen Overlay (Fixed)
    if (mode === 'fullScreen') {
        return (
            <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white ${className}`}>
                <Spinner s={s} text={text} />
                {/* Subtle watermark or branding could go here */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                    <span className="text-[10px] font-black text-gray/40 uppercase tracking-[0.4em]">AAQMS Security Platform</span>
                </div>
            </div>
        );
    }

    // Container Overlay (Absolute)
    if (mode === 'overlay') {
        return (
            <div className={`absolute inset-0 z-50 flex items-center justify-center bg-card/60 rounded-[inherit] ${className}`}>
                <Spinner s={s} text={text} />
            </div>
        );
    }

    // Inline Loader
    return (
        <div className={`inline-flex items-center justify-center ${className}`}>
            <svg 
                width={s.box} 
                height={s.box} 
                viewBox="0 0 50 50" 
                className="animate-spin"
            >
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={s.stroke}
                    strokeLinecap="round"
                    strokeDasharray="90, 150"
                />
            </svg>
            {text && <span className={`ml-2 ${s.font} font-semibold`}>{text}</span>}
        </div>
    );
};

export default GlobalLoader;
