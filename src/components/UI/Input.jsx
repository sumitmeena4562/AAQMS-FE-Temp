import React from 'react';
import { cn } from '../../utils/cn';

/**
 * ── INPUT COMPONENT ──
 * Accessible text input with state handling (focus, error, disabled).
 */

const Input = React.forwardRef(({ 
  className, 
  error = false, 
  label, 
  id, 
  disabled = false,
  ...props 
}, ref) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="text-xs font-black uppercase tracking-widest text-text/70"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        disabled={disabled}
        className={cn(
          "w-full h-11 px-4 rounded-md border-2 border-border bg-white font-body text-sm transition-all duration-200 outline-none",
          "placeholder:text-muted/50",
          "focus:border-primary focus:ring-4 focus:ring-primary/5",
          "disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed",
          error && "border-danger focus:border-danger focus:ring-danger/5",
          className
        )}
        {...props}
      />
      {error && typeof error === 'string' && (
        <span className="text-[10px] font-bold text-danger uppercase tracking-tight">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
