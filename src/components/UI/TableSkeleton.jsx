import React from 'react';

const TableSkeleton = ({ rows = 6 }) => (
    <div className="p-5 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-14 bg-base rounded-[var(--radius-card)] animate-pulse border border-border-main" />
        ))}
    </div>
);

export default TableSkeleton;
