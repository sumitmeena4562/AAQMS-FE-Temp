import React from 'react';
import Badge from './Badge';

const StatusRow = ({
    title,
    subtitle,
    icon: Icon,
    status, // 'success' | 'alert' | 'pending'
    statusText,
    extraText,
    isAlert = false
}) => {



    return (
        <div className={`flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl border transition-all duration-200 gap-4 sm:gap-0
            ${status === 'alert' ? 'border-rose-200 border-l-4 border-l-rose-500 bg-white' : ''}
            ${status === 'success' ? 'border-slate-200 border-l-[1px] bg-emerald-50/50' : ''}
            ${status === 'pending' ? 'border-slate-200 border-l-[1px] bg-slate-50' : ''}
        `}>
            {/* Left side: Icon + Text */}
            <div className="flex items-center gap-4">
                {/* Icon Box */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${status === 'success' ? 'bg-emerald-100 text-emerald-600' : ''}
                    ${status === 'alert' ? 'bg-rose-100 text-rose-600' : ''}
                    ${status === 'pending' ? 'bg-slate-200 text-slate-500' : ''}
                `}>
                    {Icon && <Icon size={18} />}
                </div>

                {/* Text Content */}
                <div>
                    <h4 className="m-0 text-sm font-semibold text-slate-900">
                        {title}
                    </h4>
                    <p className={`m-0 text-[11px] mt-0.5 ${isAlert ? 'text-rose-600' : 'text-slate-500'}`}>
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Right side: Badge + optional extra text */}
            <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1">
                <Badge
                    color={status === 'alert' ? 'danger' : status === 'success' ? 'success' : 'neutral'}
                    variant={status === 'pending' ? 'solid' : 'light'}
                    size="md"
                >
                    {statusText || status.toUpperCase()}
                </Badge>

                {extraText && (
                    <p className="m-0 text-[10px] sm:text-[9px] font-medium text-slate-500">
                        {extraText}
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatusRow;
