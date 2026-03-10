import React from 'react';

const StatCard = ({ label, value, icon: Icon, trend, color = "primary" }) => {
    // Color mapping using theme tokens
    const colors = {
        primary: {
            bg: "bg-primary/5",
            text: "text-primary",
            border: "border-primary/10"
        },
        success: {
            bg: "bg-success/5",
            text: "text-success",
            border: "border-success/10"
        },
        warning: {
            bg: "bg-warning/5",
            text: "text-warning",
            border: "border-warning/10"
        },
        info: {
            bg: "bg-info/5",
            text: "text-info",
            border: "border-info/10"
        }
    };

    const style = colors[color] || colors.primary;

    return (
        <div className={`flex flex-col gap-4 px-8 py-6 bg-bg-secondary rounded-[20px] border ${style.border} shadow-sm transition-all hover:shadow-md hover:-translate-y-1`}>
            <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${style.bg} ${style.text}`}>
                    {Icon && <Icon className="text-[20px]" />}
                </div>
                {trend && (
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${trend.isPositive ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'}`}>
                        {trend.value}%
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-[11px] font-black uppercase tracking-[0.1em] text-text-muted/60">
                    {label}
                </span>
                <span className="text-[28px] font-black text-text-primary leading-none tracking-tight">
                    {value}
                </span>
            </div>
        </div>
    );
};

export default StatCard;
