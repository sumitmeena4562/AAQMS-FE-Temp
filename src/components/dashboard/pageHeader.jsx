import React from 'react';

/**
 * PageHeader — Reusable page header for all admin pages.
 * Used by Dashboard, User Management, and future pages.
 *
 * Props:
 *   title        — Main heading (string)
 *   subtitle     — Secondary text (string or ReactNode)
 *   rightContent — Optional right-side content (buttons, badges, etc.)
 *   className    — Extra classes
 */
const PageHeader = ({ title, subtitle, rightContent, className = '' }) => {
    return (
        <header className={`flex flex-col sm:flex-row sm:items-center justify-between w-full pb-4 mb-2 border-b border-slate-100 gap-4 px-1 sm:px-6 ${className}`}>
            {/* Left Side */}
            <div className="flex flex-col gap-1 min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight tracking-tight truncate">
                    {title}
                </h1>
                {subtitle && (
                    <div className="text-[12px] sm:text-[13px] font-semibold text-slate-500 leading-tight">
                        {subtitle}
                    </div>
                )}
            </div>

            {/* Right Side */}
            {rightContent && (
                <div className="flex items-center gap-2 sm:shrink-0 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                    {rightContent}
                </div>
            )}
        </header>
    );
};

export default PageHeader;
