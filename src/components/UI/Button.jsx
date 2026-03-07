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
    const baseStyles = "flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 active:scale-[0.98] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";

    // Size maps
    const sizes = {
        sm: "px-4 h-9 text-[12px]",
        md: "px-6 h-11 text-[13.5px]",
        lg: "px-8 h-13 text-[15px]",
    };

    // Variant maps for colors
    const variants = {
        primary: "bg-[var(--color-primary)] text-white hover:opacity-90 shadow-[var(--shadow-button)] border border-transparent",
        secondary: "bg-[var(--color-accent)] text-white hover:opacity-90 shadow-[var(--shadow-button)] border border-transparent",
        success: "bg-[var(--color-success)] text-white hover:opacity-90 shadow-[var(--shadow-button)] border border-transparent",
        outline: "bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]",
        ghost: "bg-transparent text-[var(--color-text-secondary)] hover:bg-zinc-100 hover:text-[var(--color-text-primary)] shadow-none border-none",
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
