import React from 'react';
import AlertCard from './AlertCard';

const VARIANTS = {
    info: { iconBgClass: "bg-blue-50", iconTextClass: "text-blue-600" },
    success: { iconBgClass: "bg-emerald-50", iconTextClass: "text-emerald-600" },
    warning: { iconBgClass: "bg-amber-50", iconTextClass: "text-amber-600" },
    danger: { iconBgClass: "bg-rose-50", iconTextClass: "text-rose-600" },
};

export const MatricCard = ({
    title,
    value,
    icon,
    statusLabel,
    statusVariant = 'info',
    iconBgClass,
    iconTextClass,
}) => {
    const v = VARIANTS[statusVariant] || VARIANTS.info;
    const iconBg = iconBgClass || v.iconBgClass;
    const iconText = iconTextClass || v.iconTextClass;

    return (
        <div
            className="bg-card border border-border-main rounded-[var(--radius-card)] !py-[21px] !px-[24px] flex flex-col gap-3 min-h-[148px] h-auto shadow-card hover:shadow-card-hover transition-all duration-200 cursor-default"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-wider text-gray uppercase !mb-1">
                        {title}
                    </p>
                    <div className="text-2xl font-bold text-title leading-none">
                        {value}
                    </div>
                </div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconText}`}>
                    {icon}
                </div>
            </div>

            {statusLabel && (
                <div>
                    <AlertCard label={statusLabel} variant={statusVariant} />
                </div>
            )}
        </div>
    );
};

export const MatricCardRow = ({ items = [] }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => (
                <MatricCard key={idx} {...item} />
            ))}
        </div>
    );
};

export default MatricCard;
