import React from 'react';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { DESIGN_TOKENS } from '../../constants/designTokens';

/**
 * StatsCard — Simplified Elite Design.
 * Clean, high-contrast, no visual noise.
 */

const CHANGE_STYLES = {
    positive: { text: 'text-emerald-700', bg: 'bg-emerald-50' },
    neutral:  { text: 'text-slate-600',   bg: 'bg-slate-100' },
    warning:  { text: 'text-orange-700',  bg: 'bg-orange-50' },
    negative: { text: 'text-red-700',     bg: 'bg-red-50' },
};

const StatsCard = React.memo(({
    title,
    label,
    value,
    icon,
    iconBgClass = 'bg-slate-100',
    iconColorClass = 'text-slate-600',
    change,
    changeType = 'neutral',
    description,
    trend,
    subValue,
    secondaryLabel,
    className = ""
}) => {
    const displayTitle = title || label;
    const changeStyle = CHANGE_STYLES[changeType] || CHANGE_STYLES.neutral;

    const autoChange = trend !== undefined ? (
        <span className="flex items-center gap-0.5">
            {trend > 0 ? <FiArrowUpRight size={14} /> : trend < 0 ? <FiArrowDownRight size={14} /> : null}
            {trend === 0 ? 'Stable' : `${trend > 0 ? '+' : ''}${trend}%`}
        </span>
    ) : null;

    const trendType = trend > 0 ? 'positive' : (trend < 0 ? 'negative' : 'neutral');
    const finalChangeStyle = trend !== undefined ? (CHANGE_STYLES[trendType] || CHANGE_STYLES.neutral) : changeStyle;
    const finalChange = change || autoChange;

    return (
        <div className={`elite-card elite-card-hover px-6 py-5 group relative overflow-hidden ${className}`}>
            
            <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="flex flex-col min-w-0 flex-1">
                    <p 
                        className="text-[10px] font-bold tracking-widest uppercase mb-1 truncate"
                        style={{ color: DESIGN_TOKENS.COLORS.TEXT_MUTED }}
                    >
                        {displayTitle}
                    </p>
                    <h2 
                        className="text-2xl font-black leading-none mt-1 tracking-tight truncate"
                        style={{ color: DESIGN_TOKENS.COLORS.TEXT_TITLE }}
                    >
                        {value}
                    </h2>
                </div>

                <div className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 border border-black/5 transition-transform group-hover:scale-110 duration-300 ${iconBgClass} ${iconColorClass}`}>
                    {icon && (React.isValidElement(icon)
                        ? React.cloneElement(icon, { size: 18 })
                        : React.createElement(icon, { size: 18 })
                    )}
                </div>
            </div>

            <div className="h-[1.5px] w-full bg-border-main/50 my-4" />

            <div className="flex flex-col gap-1.5 mt-auto">
                <div className="flex items-center gap-2 justify-between flex-wrap">
                    {finalChange && (
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${finalChangeStyle.text} ${finalChangeStyle.bg}`}>
                            {finalChange}
                        </span>
                    )}
                    {subValue && !finalChange && (
                        <span className="text-[12px] font-semibold text-body">
                            {subValue}
                        </span>
                    )}
                    {description && (
                        <span 
                            className="text-[11px] font-medium truncate flex-1 text-right italic"
                            style={{ color: DESIGN_TOKENS.COLORS.TEXT_MUTED }}
                        >
                            {description}
                        </span>
                    )}
                </div>
                {secondaryLabel && (
                    <div className="text-[10px] font-medium text-slate-600 mt-1 uppercase tracking-wider">
                        {secondaryLabel}
                    </div>
                )}
            </div>
        </div>
    );
});

export const StatsRow = React.memo(({ items = [], columns = 4, className = "" }) => {
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
});

StatsCard.displayName = 'StatsCard';
StatsRow.displayName = 'StatsRow';

export default StatsCard;
