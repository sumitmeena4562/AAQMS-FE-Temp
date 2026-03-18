import React from 'react';

const TableSkeleton = ({ rows = 6 }) => (
    <div className="p-5 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse border border-slate-100" />
        ))}
    </div>
);

export default TableSkeleton;
