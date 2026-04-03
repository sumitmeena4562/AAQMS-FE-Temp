import React from 'react';

/**
 * ── TABLE SKELETON ──
 * Upgraded with premium "Glass-Shimmer" effect for elite UI.
 */
const TableSkeleton = ({ rows = 6 }) => (
    <div className="p-5 space-y-4 animate-in fade-in duration-700">
        <style>
            {`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .shimmer-box {
                    position: relative;
                    overflow: hidden;
                    background: var(--color-base);
                }
                .shimmer-box::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.4),
                        transparent
                    );
                    animation: shimmer 1.8s infinite;
                }
            `}
        </style>
        {Array.from({ length: rows }).map((_, i) => (
            <div 
                key={i} 
                className="h-14 shimmer-box rounded-[var(--radius-card)] border border-border-main/50"
                style={{ 
                    animationDelay: `${i * 100}ms`,
                    opacity: 1 - (i * 0.1) // Staggered opacity for "fade out" effect at bottom
                }} 
            />
        ))}
    </div>
);

export default TableSkeleton;
