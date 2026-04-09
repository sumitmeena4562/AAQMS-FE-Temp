import React from 'react';
import Skeleton from '../UI/Skeleton';

const StatsCardSkeleton = () => {
    return (
        <div className="bg-card px-6 py-5 rounded-[var(--radius-card)] w-full border border-border-main shadow-card flex flex-col min-h-[148px]">
            {/* Header Area Placeholder */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col flex-1 gap-2">
                    <Skeleton width="60%" height="12px" radius="6px" />
                    <Skeleton width="40%" height="32px" radius="8px" className="mt-1" />
                </div>
                <Skeleton width="40px" height="40px" radius="12px" />
            </div>

            {/* Divider Placeholder */}
            <div className="h-[1.5px] w-full bg-border-main/50 my-4" />

            {/* Footer Placeholder */}
            <div className="flex items-center justify-between pt-0.5 mt-auto">
                <Skeleton width="30%" height="18px" radius="99px" />
                <Skeleton width="40%" height="14px" radius="6px" />
            </div>
        </div>
    );
};

export const StatsGridSkeleton = ({ count = 4 }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {Array.from({ length: count }).map((_, i) => (
                <StatsCardSkeleton key={i} />
            ))}
        </div>
    );
};

export const MatricCardSkeleton = ({ count = 3 }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-card px-6 py-[21px] rounded-[var(--radius-card)] w-full border border-border-main/80 flex flex-col gap-4 min-h-[148px]">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col flex-1 gap-2">
                            <Skeleton width="50%" height="11px" radius="6px" />
                            <Skeleton width="40%" height="28px" radius="6px" />
                        </div>
                        <Skeleton width="36px" height="36px" radius="10px" />
                    </div>

                    <div className="h-[1.5px] w-full bg-border-main/20 my-1" />
                    
                    {/* Status Label Placeholder */}
                    <div className="mt-auto">
                        <Skeleton width="100%" height="32px" radius="var(--radius-card)" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCardSkeleton;
