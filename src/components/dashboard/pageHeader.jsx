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
        <header className={`flex flex-col sm:flex-row sm:items-center justify-between w-full pb-4 mb-2 border-b border-slate-100 gap-4 ${className}`}>
            {/* Left Side */}
            <div className="flex flex-col gap-1 min-w-0">
                <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-[13px] font-semibold text-slate-500 leading-none">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Right Side */}
            {rightContent && (
                <div className="shrink-0">
                    {rightContent}
                </div>
            )}
        </header>
    );
};

export default PageHeader;
