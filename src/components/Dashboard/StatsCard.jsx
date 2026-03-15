import React from 'react';
import { getChangeStyles } from "../../utils/cardStyles";
// ==========================================
// 1. FOR USERS_MANAGEMENT (Small Horizontal Cards)
// ==========================================
export const StatsCardSmall = ({ label, value, icon, iconBg = 'bg-gray-100', iconColor = 'text-gray-500' }) => {
    return (
        <div className="flex items-center gap-4 px-6 py-5 bg-white border border-gray-200 rounded-2xl shadow-2xl  transition-all duration-200 cursor-default flex-1 min-w-0">
            {icon && (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
                    {icon}
                </div>
            )}
            <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis mb-1">
                    {label}
                </div>
                <div className="text-2xl font-bold text-gray-900 leading-none">
                    {value}
                </div>
            </div>
        </div>
    );
};

export const StatsRow = ({ items = [] }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item, i) => (
                <StatsCardSmall key={i} {...item} />
            ))}
        </div>
    );
};

// ==========================================
// 2. FOR STATS GRID (Large Dashboard Cards)
// ==========================================
export const StatCard = ({ title, value, change, description, icon, iconBgClass, iconColorClass, changeType = 'neutral' }) => {
    const changeStyle = getChangeStyles(changeType);
    return (
        <div className="bg-white !px-6 !py-5 rounded-2xl w-full  border border-gray-300 shadow-2xl flex flex-col min-h-[148px] hover:shadow-md transition-all duration-200 cursor-default min-w-[236px]">

            {/* Header Area */}
            <div className="flex items-start justify-between gap-4 ">
                <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-1 truncate">
                        {title}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-none tabular-nums !mt-1">
                        {value}
                    </h2>
                </div>

                {/* Icon Box */}
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 ${iconBgClass} ${iconColorClass}`}>
                    {icon}
                </div>
            </div>

            {/* Divider */}
            <div className="h-[2px] w-full bg-gray-200 !my-4"></div>


            <div className=" flex items-center gap-2 justify-between flex-wrap pt-1">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${changeStyle.text} ${changeStyle.bg}`}>
                    {change}
                </span>
                <span className="text-[12px] font-medium text-gray-400 truncate flex-1 text-right">
                    {description}
                </span>
            </div>
        </div>
    );
};

export default StatCard;

// ==========================================
