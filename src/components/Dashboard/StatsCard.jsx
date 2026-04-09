import React from 'react';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';

/**
 * ═══════════════════════════════════════════════════════════════
 *  StatsCard — THE unified stats card for the entire app.
 *  Used by: Dashboard (StatGrid), User Management, etc.
 * ═══════════════════════════════════════════════════════════════
 *
 *  This is the "big" card style with:
 *  - Title + Value + Icon box
 *  - Divider
 *  - Change indicator + description footer
 *
 *  Props:
 *    title / label   — Small uppercase header text
 *    value           — Big number/text
 *    icon            — React element (e.g. <FiUsers />)
 *    iconBgClass     — Tailwind bg class for icon box
 *    iconColorClass  — Tailwind text class for icon color
 *    change          — ReactNode for change display (e.g. <>+12%</>)
 *    changeType      — 'positive' | 'neutral' | 'warning' | 'negative'
 *    description     — Footnote text (e.g. "vs last month")
 *    trend           — Number for automatic trend badge (positive = green)
 *    subValue        — Alternative to change+description for simple text
 */

const CHANGE_STYLES = {
    positive: { text: 'text-emerald-700', bg: 'bg-emerald-50' },
    neutral:  { text: 'text-slate-600',   bg: 'bg-slate-100' },
    warning:  { text: 'text-orange-700',  bg: 'bg-orange-50' },
    negative: { text: 'text-red-700',     bg: 'bg-red-50' },
};

const StatsCard = ({
    title,
    label,
    value,
    icon,
    iconBgClass = 'bg-slate-100',
    iconColorClass = 'text-slate-600',
    iconBg,
    iconColor,
    change,
    changeType = 'neutral',
    description,
    trend,
    subValue,
    className = ""
}) => {
    // Support both naming conventions
    const displayTitle = title || label;
    const bgClass = iconBgClass || iconBg || 'bg-slate-100';
    const colorClass = iconColorClass || iconColor || 'text-slate-600';
    const changeStyle = CHANGE_STYLES[changeType] || CHANGE_STYLES.neutral;

    // Auto-generate change from trend if provided
    const autoChange = trend !== undefined ? (
        <span className="flex items-center gap-0.5">
            {trend > 0 ? <FiArrowUpRight size={14} /> : <FiArrowDownRight size={14} />}
            {trend > 0 ? '+' : ''}{trend}%
        </span>
    ) : null;

    const autoChangeType = trend !== undefined ? (trend > 0 ? 'positive' : 'negative') : changeType;
    const finalChangeStyle = trend !== undefined ? (CHANGE_STYLES[autoChangeType] || CHANGE_STYLES.neutral) : changeStyle;
    const finalChange = change || autoChange;

    return (
        <div className={`bg-card px-6 py-5 rounded-[var(--radius-card)] w-full border border-border-main/80 shadow-card flex flex-col min-h-[148px] 
            hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-default group relative overflow-hidden ${className}`}>
            
            {/* Subtle Hover Gradient (Not Blur) */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Header Area */}
            <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-[10px] font-bold tracking-widest text-gray uppercase mb-1 truncate">
                        {displayTitle}
                    </p>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-title leading-none tabular-nums mt-1 tracking-tight truncate">
                        {value}
                    </h2>
                </div>

                {/* Icon Box */}
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 border border-black/5 
                    transition-transform group-hover:scale-110 duration-300 ${bgClass} ${colorClass}`}>
                    {icon && (React.isValidElement(icon)
                        ? React.cloneElement(icon, { size: icon.props?.size || 18 })
                        : React.createElement(icon, { size: 18 })
                    )}
                </div>
            </div>

            {/* Divider */}
            <div className="h-[1.5px] w-full bg-border-main/50 my-4 relative z-10" />

            {/* Footer — Change + Description OR SubValue */}
            <div className="flex items-center gap-2 justify-between flex-wrap pt-0.5 relative z-10">
                {finalChange && (
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${finalChangeStyle.text} ${finalChangeStyle.bg}`}>
                        {finalChange}
                    </span>
                )}
                {subValue && !finalChange && (
                    <span className="text-[12px] font-semibold text-body truncate">
                        {subValue}
                    </span>
                )}
                {description && (
                    <span className="text-[12px] font-medium text-gray truncate flex-1 text-right">
                        {description}
                    </span>
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
