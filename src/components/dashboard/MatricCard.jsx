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
        <div className="bg-white border border-gray-200 rounded-2xl !px-6 !py-5 shadow-sm min-h-[110px] flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-1">
                        {title}
                    </p>
                    <div className="text-2xl font-bold text-gray-900 leading-none">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item, idx) => (
                <MatricCard key={idx} {...item} />
            ))}
        </div>
    );
};

export default MatricCard;
