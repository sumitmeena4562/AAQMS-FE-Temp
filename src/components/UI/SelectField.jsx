import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import { t } from '../../theme/theme';

const SelectField = forwardRef(({
    label,
    options = [],
    value,
    onChange,
    icon,
    error,
    required = false,
    className = '',
    containerStyle = {},
    loading = false,
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    // Shake animation variant
    const shakeVariants = {
        error: {
            x: [0, -4, 4, -4, 4, 0],
            transition: { duration: 0.4 }
        }
    };

    return (
        <motion.div 
            style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', width: '100%', ...containerStyle }} 
            className={className}
            animate={error ? "error" : ""}
            variants={shakeVariants}
        >
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
                {icon && (
                    <span style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        zIndex: 2, 
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

                <select
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    required={required}
                    style={{
                        width: '100%',
                        padding: icon ? '13px 14px 13px 42px' : '13px 16px',
                        paddingRight: '42px', 
                        fontSize: t.fontSize.md,
                        fontFamily: 'inherit',
                        color: t.color.text,
                        backgroundColor: isFocused ? t.color.bg : t.color.bgHover,
                        border: `1.5px solid ${error ? t.color.danger : (isFocused ? t.color.primary : t.color.border)}`,
                        borderRadius: '12px',
                        outline: 'none',
                        appearance: 'none', 
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isFocused 
                            ? (error ? '0 0 0 4px rgba(239, 68, 68, 0.08)' : `0 0 0 4px rgba(7, 34, 103, 0.06)`) 
                            : '0 2px 4px rgba(0,0,0,0.02)',
                        fontWeight: t.fontWeight.medium,
                        letterSpacing: '0.01em'
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onMouseEnter={(e) => {
                        if (!isFocused && !error) e.target.style.borderColor = 'rgba(7, 34, 103, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        if (!isFocused && !error) e.target.style.borderColor = t.color.border;
                    }}
                    {...props}
                >
                    <option value="" disabled hidden>Select an option</option>
                    {options.map((opt, idx) => {
                        const isString = typeof opt === 'string';
                        const optValue = isString ? opt : opt.value;
                        const optLabel = isString ? opt : opt.label;
                        return (
                            <option key={idx} value={optValue}>{optLabel}</option>
                        );
                    })}
                </select>

                {/* Custom Dropdown Arrow or Loading Spinner */}
                <div style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    pointerEvents: 'none', 
                    color: t.color.textPlaceholder, 
                    display: 'flex', 
                    alignItems: 'center' 
                }}>
                    {loading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            style={{ width: '16px', height: '16px', border: '2px solid rgba(7, 34, 103, 0.1)', borderTopColor: t.color.primary, borderRadius: '50%' }}
                        />
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Error Message with animation */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: t.color.danger, 
                            fontSize: '11px',
                            marginTop: '2px', 
                            fontWeight: t.fontWeight.bold, 
                            marginLeft: '4px',
                            letterSpacing: '0.01em',
                        }}
                    >
                        <FiAlertCircle size={13} strokeWidth={2.5} />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});

SelectField.displayName = 'SelectField';

export default SelectField;

