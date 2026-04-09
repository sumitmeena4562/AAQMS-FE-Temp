import React from 'react';
import AlertCard from './AlertCard';

/**
 * MetricCard — Simple and direct status card.
 */

const VARIANTS = {
    info:    { iconBgClass: 'bg-blue-50',     iconTextClass: 'text-blue-600' },
    success: { iconBgClass: 'bg-emerald-50',  iconTextClass: 'text-emerald-600' },
    warning: { iconBgClass: 'bg-orange-50',   iconTextClass: 'text-orange-600' },
    danger:  { iconBgClass: 'bg-red-50',      iconTextClass: 'text-red-600' },
};

const MatricCard = ({
    title,
    value,
    icon,
    statusLabel,
    statusVariant = 'info',
    iconBgClass,
    iconTextClass,
    secondaryLabel,
}) => {
    const v = VARIANTS[statusVariant] || VARIANTS.info;
    const iconBg = iconBgClass || v.iconBgClass;
    const iconText = iconTextClass || v.iconTextClass;

    return (
        <div
            className="bg-card border border-border-main/80 rounded-[var(--radius-card)] !py-[21px] !px-[24px] flex flex-col gap-3 min-h-[148px] h-auto shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-default group relative overflow-hidden"
        >
            <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="min-w-0">
                    <p className="text-[11px] font-bold tracking-wider text-gray uppercase mb-1">
                        {title}
                    </p>
                    <div className="text-2xl font-black text-title leading-none">
                        {value}
                    </div>
                </div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-black/5 ${iconBg} ${iconText}`}>
                    {icon}
                </div>
            </div>

            <div className="h-[1.5px] w-full bg-border-main/20 my-1" />

            {secondaryLabel && (
                <div className="text-[10px] font-bold text-gray/40 uppercase tracking-widest -mt-1 mb-1 px-1">
                    {secondaryLabel}
                </div>
            )}

            {statusLabel && (
                <div className="mt-auto">
                    <AlertCard label={statusLabel} variant={statusVariant} />
                </div>
            )}
        </div>
    );
};

export const MatricCardRow = ({ items = [] }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
                <MatricCard key={i} {...item} />
            ))}
        </div>
    );
};

export default MatricCard;
