import React from 'react';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';

/**
 * Global StatsCard — Reusable across all pages.
 */
const StatsCard = ({ 
    label, 
    value, 
    icon, 
    iconBg = 'bg-slate-100', 
    iconColor = 'text-slate-600', 
    trend, 
    subValue, 
    className = "" 
}) => {
    return (
        <div
            className={`flex items-center gap-4 p-5 bg-white border border-slate-200/60 rounded-2xl cursor-default relative overflow-hidden group 
                transition-all duration-500 hover:-translate-y-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(7,34,103,0.12)] ${className}`}
        >
            {/* Subtle Gradient Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Icon Container */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-black/5 transition-transform group-hover:scale-110 duration-300 ${iconBg} ${iconColor}`}>
                {icon && (() => {
                    const IconComponent = icon;
                    return React.isValidElement(icon) 
                        ? React.cloneElement(icon, { size: 20 })
                        : <IconComponent size={20} />;
                })()}
            </div>

            {/* Content Container */}
            <div className="min-w-0 flex-1 relative z-10">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 font-sans">
                    {label}
                </div>
                <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-black text-slate-900 leading-none font-sans tracking-tight">
                        {value}
                    </div>
                    {trend !== undefined && (
                        <div className={`text-[11px] font-black flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg ${trend > 0 ? 'text-emerald-600 bg-emerald-50/50' : 'text-rose-600 bg-rose-50/50'}`}>
                            {trend > 0 ? <FiArrowUpRight size={12} /> : <FiArrowDownRight size={12} />}
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>
                {subValue && (
                    <div className="text-[11px] font-semibold text-slate-500 mt-1 truncate">
                        {subValue}
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * StatsRow — A responsive grid row of StatsCards.
 */
export const StatsRow = ({ items = [], columns = 4, className = "" }) => {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

    return (
        <div className={`grid gap-4 w-full ${gridCols} ${className}`}>
            {items.map((item, i) => (
                <StatsCard key={i} {...item} />
            ))}
        </div>
    );
};

export default StatsCard;
