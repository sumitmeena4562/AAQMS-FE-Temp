import React from 'react';
import { cn } from '../../utils/cn';

/**
 * ── BUTTON COMPONENT ──
 * High-performance, accessible button with variant and size support.
 */

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  loadingText = "Processing...", 
  icon: Icon,
  iconPosition = 'left',
  ...props 
}) => {
  
  const baseStyles = "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95 gap-2";

  const variants = {
    primary: "bg-primary text-white shadow-soft hover:bg-[var(--color-hover-blue)] hover:shadow-md",
    secondary: "bg-secondary text-white shadow-soft hover:bg-[var(--color-hover-blue)] hover:shadow-md",
    outline: "bg-transparent border-2 border-border text-text hover:bg-[var(--color-hover-blue)] hover:text-white hover:border-[var(--color-hover-blue)]",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs rounded-sm",
    md: "h-11 px-6 text-sm rounded-md",
    lg: "h-14 px-8 text-base rounded-lg",
  };

  const renderIcon = () => {
    if (!Icon) return null;
    if (typeof Icon === 'function') return <Icon size={size === 'sm' ? 14 : 16} />;
    return Icon;
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {loadingText}
        </span>
      ) : (
        <>
          {Icon && iconPosition === 'left' && renderIcon()}
          {children}
          {Icon && iconPosition === 'right' && renderIcon()}
        </>
      )}
    </button>
  );
};

export default Button;
