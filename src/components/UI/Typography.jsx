import React from 'react';
import { cn } from '../../utils/cn';

/**
 * ── TYPOGRAPHY COMPONENTS ──
 * Unified system for Headings, SubHeadings, and Body Text.
 */

export const Heading = ({ 
  children, 
  className, 
  as: Component = 'h1' 
}) => {
  return (
    <Component 
      className={cn(
        "font-heading font-black tracking-tight text-text-title text-3xl md:text-4xl lg:text-5xl leading-[1.1]",
        className
      )}
    >
      {children}
    </Component>
  );
};

export const SubHeading = ({ 
  children, 
  className, 
  as: Component = 'h2' 
}) => {
  return (
    <Component 
      className={cn(
        "font-heading font-bold tracking-tight text-text-title text-xl md:text-2xl leading-tight",
        className
      )}
    >
      {children}
    </Component>
  );
};

export const Text = ({ 
  children, 
  className, 
  size = 'md',
  as: Component = 'p' 
}) => {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <Component 
      className={cn(
        "font-body text-text-muted leading-relaxed",
        sizes[size],
        className
      )}
    >
      {children}
    </Component>
  );
};
