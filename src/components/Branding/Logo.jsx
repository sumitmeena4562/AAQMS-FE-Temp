import React from 'react';

const Logo = ({ collapsed = false, size = 'md', inverse = false }) => {
    // Size presets using Tailwind classes
    const sizeMap = {
        sm: { icon: 'w-7.5 h-7.5', svg: 16, font: 'text-[11px]', sub: 'text-[8px]', gap: 'gap-2' },
        md: { icon: 'w-8.5 h-8.5', svg: 18, font: 'text-sm', sub: 'text-[9px]', gap: 'gap-2.5' },
        lg: { icon: 'w-10.5 h-10.5', svg: 22, font: 'text-base', sub: 'text-[10px]', gap: 'gap-3', padding: 'p-5' },
    };

    const s = sizeMap[size] || sizeMap.md;

    return (
        <div className={`flex items-center ${collapsed ? 'gap-0 justify-center' : `${s.gap} justify-start`} ${s.padding || 'p-0'}`}>
            {/* Shield Icon */}
            <div className={`${s.icon} rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20`}>
                <svg
                    width={s.svg}
                    height={s.svg}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 2L4 6V12C4 16.42 7.4 20.74 12 22C16.6 20.74 20 16.42 20 12V6L12 2Z"
                        stroke="#fff"
                        strokeWidth="2"
                    />
                </svg>
            </div>

            {/* Brand Text */}
            {!collapsed && (
                <div className="flex flex-col gap-0">
                    <span className={`font-black ${s.font} ${inverse ? 'text-white' : 'text-slate-900'} tracking-tight leading-none`}>
                        AI Safety
                    </span>
                    <span className={`font-bold ${s.sub} ${inverse ? 'text-white/70' : 'text-slate-400'} tracking-[0.05em] uppercase leading-none mt-0.5`}>
                        Management System
                    </span>
                </div>
            )}
        </div>
    );
};

export default Logo;
