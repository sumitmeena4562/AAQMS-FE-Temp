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
            ${status === 'alert' ? 'border-[var(--color-danger)] border-l-4 border-l-[var(--color-danger)] bg-[var(--color-bg-secondary)]' : ''}
            ${status === 'success' ? 'border-[var(--color-border)] border-l-[1px] bg-[var(--color-success-bg)]' : ''}
            ${status === 'pending' ? 'border-[var(--color-border)] border-l-[1px] bg-[var(--color-bg-tertiary)]' : ''}
        `}>
            {/* Left side: Icon + Text */}
            <div className="flex items-center gap-4">
                {/* Icon Box */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${status === 'success' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : ''}
                    ${status === 'alert' ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]' : ''}
                    ${status === 'pending' ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]' : ''}
                `}>
                    {Icon && <Icon size={18} />}
                </div>

                {/* Text Content */}
                <div>
                    <h4 className="m-0 text-sm font-semibold text-[var(--color-text-primary)]">
                        {title}
                    </h4>
                    <p className={`m-0 text-[11px] mt-0.5 ${isAlert ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-muted)]'}`}>
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
                    <p className="m-0 text-[10px] sm:text-[9px] font-medium text-[var(--color-text-muted)]">
                        {extraText}
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatusRow;
