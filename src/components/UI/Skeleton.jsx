import React from 'react';

/**
 * Premium Skeleton Component
 * A flexible shimmering placeholder for building sophisticated loading states.
 * 
 * Props:
 *   width     - string (e.g. '100%', '200px')
 *   height    - string (e.g. '20px', '148px')
 *   circle    - boolean (if true, borderRadius is 50%)
 *   radius    - string (custom border radius, default: var(--radius-card))
 *   className - string (extra classes)
 */
const Skeleton = ({ 
    width, 
    height, 
    circle = false, 
    radius = 'var(--radius-card)', 
    className = "" 
}) => {
    return (
        <div 
            className={`relative overflow-hidden bg-base/80 border border-border-main/50 ${className}`}
            style={{ 
                width: width || '100%', 
                height: height || '20px', 
                borderRadius: circle ? '50%' : radius,
            }}
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 z-10 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full" />
            
            <style>
                {`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer {
                        animation: shimmer 1.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
                    }
                `}
            </style>
        </div>
    );
};

export default Skeleton;
