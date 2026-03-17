import React from 'react';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';

const VARIANTS = {
    info: { classes: "bg-blue-50 text-blue-600 border border-blue-100" },
    success: { classes: "bg-emerald-50 text-emerald-600 border border-emerald-100", icon: <FiCheckCircle size={14} /> },
    warning: { classes: "bg-amber-50 text-amber-700 border border-amber-100", icon: <FiAlertTriangle size={14} /> },
    danger: { classes: "bg-rose-50 text-rose-600 border border-rose-100", icon: <FiAlertCircle size={14} /> },
};

const AlertCard = ({ label, variant = 'info' }) => {
    const v = VARIANTS[variant] || VARIANTS.info;
    return (
        <div className={`w-full h-[34px] flex items-center gap-2 rounded-2xl !px-3 ${v.classes}`}>
            <span className="shrink-0">{v.icon}</span>
            <span className="font-['Inter'] text-[12px] font-semibold leading-[16px] tracking-[0px]  whitespace-nowrap">
                {label}
            </span>
        </div>
    );
};

export default AlertCard;
