import React from 'react';

/**
 * ── CARD SKELETON ──
 * Premium pulse-shimmer effect for industrial card layouts.
 */
const CardSkeleton = ({ count = 4, columns = 4 }) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${columns} gap-6 w-full animate-in fade-in duration-500`}>
        <style>
            {`
                @keyframes cardPulse {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 0.4; }
                }
                .skeleton-pulse {
                    animation: cardPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}
        </style>
        {Array.from({ length: count }).map((_, i) => (
            <div 
                key={i} 
                className="bg-card rounded-[32px] border border-border-main/60 p-6 h-[380px] flex flex-col gap-4 relative overflow-hidden"
                style={{ animationDelay: `${i * 150}ms` }}
            >
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-base/50 rounded-2xl skeleton-pulse" />
                
                {/* Content Placeholders */}
                <div className="space-y-3">
                    <div className="h-6 w-3/4 bg-base/80 rounded-full skeleton-pulse" />
                    <div className="h-4 w-1/2 bg-base/40 rounded-full skeleton-pulse" />
                </div>

                {/* Badge Placeholder */}
                <div className="absolute top-10 left-10 w-20 h-6 bg-base rounded-full shadow-sm skeleton-pulse" />

                {/* Footer Placeholders */}
                <div className="mt-auto pt-4 border-t border-border-main/30 flex justify-between items-center">
                    <div className="h-4 w-24 bg-base/40 rounded-full skeleton-pulse" />
                    <div className="h-4 w-12 bg-base/40 rounded-full skeleton-pulse" />
                </div>
            </div>
        ))}
    </div>
);

export default CardSkeleton;
