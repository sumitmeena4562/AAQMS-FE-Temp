import React from 'react';

// A dynamic fade with a slight zoom effect
export const FadeInView = ({ children, style, className }) => {
    return (
        <div style={style} className={className}>
            {children}
        </div>
    );
};

// Slide up with spring physics for bounce
export const SlideUpView = ({ children, style, className }) => {
    return (
        <div style={style} className={className}>
            {children}
        </div>
    );
};

// A dramatic staggered container that scales in
export const StaggeredContainer = ({ children, style, className }) => {
    return (
        <div style={style} className={className}>
            {children}
        </div>
    );
};

// Child elements that pop and spring
export const StaggeredChild = ({ children }) => {
    return (
        <div>
            {children}
        </div>
    );
};

// NEW: A 3D Flip/Rotate reveal for very special items like the Analytics Dashboard
export const FlipInView = ({ children, style, className }) => {
    return (
        <div style={style} className={className}>
            {children}
        </div>
    );
}
