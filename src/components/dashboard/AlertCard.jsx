import React from 'react';

const VARIANTS = {
    info: "bg-blue-50 text-blue-600 border border-blue-100",
    success: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    danger: "bg-rose-50 text-rose-600 border border-rose-100",
};

const AlertCard = ({ label, variant = 'info' }) => {
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none whitespace-nowrap ${VARIANTS[variant] || VARIANTS.info}`}>
            {label}
        </span>
    );
};

export default AlertCard;
