import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { t } from '../../theme/theme';

const InputField = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    icon,
    error, // Pass error message text here
    required = false,
    className = '',
    containerStyle = {},
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px', width: '100%', ...containerStyle }} className={className}>
            {label && (
                <label style={{ 
                    fontSize: t.fontSize.sm, 
                    fontWeight: t.fontWeight.bold, 
                    color: error ? t.color.danger : t.color.textSecondary,
                    letterSpacing: '0.01em',
                    marginLeft: '4px',
                }}>
                    {label} {required && <span style={{ color: t.color.danger }}>*</span>}
                </label>
            )}

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {/* Left Icon */}
                {icon && (
                    <span style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        color: error ? t.color.danger : (isFocused ? t.color.primary : t.color.textPlaceholder), 
                        transition: 'color 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none'
                    }}>
                        {React.cloneElement(icon, { size: 16 })}
                    </span>
                )}

                <input
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    style={{
                        width: '100%',
                        padding: icon ? '12px 14px 12px 38px' : '12px 14px',
                        paddingRight: isPassword ? '38px' : '14px',
                        fontSize: t.fontSize.md,
                        color: t.color.text,
                        backgroundColor: isFocused ? t.color.bg : t.color.bgHover,
                        border: `1.5px solid ${error ? t.color.danger : (isFocused ? t.color.primary : t.color.border)}`,
                        borderRadius: t.radius.xl,
                        outline: 'none',
                        transition: 'all 0.2s ease-in-out',
                        boxShadow: isFocused 
                            ? (error ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : `0 0 0 3px ${t.color.primary}15`) 
                            : t.shadow.sm,
                        fontWeight: t.fontWeight.medium
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onMouseEnter={(e) => {
                        if (!isFocused && !error) e.target.style.borderColor = '#CBD5E1';
                    }}
                    onMouseLeave={(e) => {
                        if (!isFocused && !error) e.target.style.borderColor = '#E2E8F0';
                    }}
                    {...props}
                />

                {/* Right Password Toggle Icon */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '4px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#94A3B8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            borderRadius: '8px',
                            transition: 'color 0.2s, background 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.background = '#F1F5F9'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        {showPassword ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>
                        )}
                    </button>
                )}
            </div>

            {/* Error Message with animation */}
            {error && (
                <motion.span 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                        color: t.color.danger, 
                        fontSize: t.fontSize.xs, 
                        marginTop: '2px', 
                        fontWeight: t.fontWeight.semibold, 
                        marginLeft: '4px',
                        letterSpacing: 'normal',
                        textAlign: 'left'
                    }}
                >
                    {error}
                </motion.span>
            )}
        </div>
    );
};

export default InputField;
