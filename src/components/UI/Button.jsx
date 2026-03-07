import React from 'react';

const Button = ({
    children,
    onClick,
    icon: Icon,
    variant = 'primary',
    size = 'md',
    className = '',
    type = 'button',
    disabled = false,
    ...props
}) => {
    // Base styles for the premium dashboard look
    const baseStyles = "flex items-center justify-center gap-2.5 font-bold rounded-full transition-all duration-300 active:scale-[0.97] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

    // Size maps
    const sizes = {
        sm: "px-4 h-[38px] text-[12px]",
        md: "px-6 h-[46px] text-[13.5px]",
        lg: "px-8 h-[54px] text-[15px]",
    };

    // Variant maps for colors
    const variants = {
        primary: "bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-[0_4px_15px_-3px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_25px_-5px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 border border-blue-400/20 active:shadow-inner",
        secondary: "bg-gradient-to-tr from-slate-900 to-slate-800 text-white shadow-[0_4px_15px_-3px_rgba(15,23,42,0.3)] hover:shadow-[0_8px_25px_-5px_rgba(15,23,42,0.4)] hover:-translate-y-0.5 border border-slate-700/50 active:shadow-inner",
        success: "bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-[0_4px_15px_-3px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 border border-emerald-400/20 active:shadow-inner",
        outline: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800",
        ghost: "bg-transparent text-slate-500 hover:bg-blue-50/50 hover:text-blue-600 shadow-none border-none",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${sizes[size]} ${variants[variant] || variants.primary} ${className}`}
            {...props}
        >
            {Icon && <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} stroke-[2.5px] opacity-90`} />}
            {children}
        </button>
    );
};

export default Button;
