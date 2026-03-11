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
            ${status === 'alert' ? 'border-danger border-l-4 border-l-danger bg-bg-secondary' : ''}
            ${status === 'success' ? 'border-border border-l-[1px] bg-success-bg' : ''}
            ${status === 'pending' ? 'border-border border-l-[1px] bg-bg-tertiary' : ''}
        `}>
            {/* Left side: Icon + Text */}
            <div className="flex items-center gap-4">
                {/* Icon Box */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${status === 'success' ? 'bg-success-bg text-success' : ''}
                    ${status === 'alert' ? 'bg-danger-bg text-danger' : ''}
                    ${status === 'pending' ? 'bg-bg-tertiary text-text-muted' : ''}
                `}>
                    {Icon && <Icon size={18} />}
                </div>

                {/* Text Content */}
                <div>
                    <h4 className="m-0 text-sm font-semibold text-text-primary">
                        {title}
                    </h4>
                    <p className={`m-0 text-[11px] mt-0.5 ${isAlert ? 'text-danger' : 'text-text-muted'}`}>
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
                    <p className="m-0 text-[10px] sm:text-[9px] font-medium text-text-muted">
                        {extraText}
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatusRow;
