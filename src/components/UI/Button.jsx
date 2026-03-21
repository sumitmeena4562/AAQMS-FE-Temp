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
    loading = false,
    ...props
}) => {
    // Base styles for the premium dashboard look
    const baseStyles = "relative flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-button)] transition-all duration-200 active:scale-[0.98] whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden";

    // Size maps
    const sizes = {
        sm: "px-4 h-9 text-[12px]",
        md: "px-6 h-11 text-[13.5px]",
        lg: "px-8 h-12 text-[15px]",
    };

    // Variant maps for colors - Using native Tailwind theme variables
    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90 shadow-[var(--shadow-btn)] border border-transparent",
        secondary: "bg-accent text-white hover:bg-accent/90 shadow-[var(--shadow-btn)] border border-transparent",
        success: "bg-success text-white hover:bg-success/90 shadow-[var(--shadow-btn)] border border-transparent",
        outline: "bg-white border border-border-main text-body hover:border-border-hover hover:text-title",
        ghost: "bg-transparent text-body hover:bg-zinc-100 hover:text-title shadow-none border-none",
        danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-md border border-transparent",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${sizes[size]} ${variants[variant] || variants.primary} ${className}`}
            {...props}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{children}</span>
                </div>
            ) : (
                <>
                    {Icon && <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} stroke-[2.5px] opacity-90`} />}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
