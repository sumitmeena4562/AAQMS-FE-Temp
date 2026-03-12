import React, { useState } from 'react';
import { t } from '../../theme/theme';

const SelectField = ({
    label,
    options = [],
    value,
    onChange,
    icon,
    error,
    required = false,
    className = '',
    containerStyle = {},
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', width: '100%', ...containerStyle }} className={className}>
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
                    value={value}
                    onChange={onChange}
                    required={required}
                    style={{
                        width: '100%',
                        padding: icon ? '12px 14px 12px 38px' : '12px 14px',
                        paddingRight: '38px', 
                        fontSize: t.fontSize.md,
                        fontFamily: 'var(--font-family)',
                        color: t.color.text,
                        backgroundColor: isFocused ? t.color.bg : t.color.bgHover,
                        border: `1.5px solid ${error ? t.color.danger : (isFocused ? t.color.primary : t.color.border)}`,
                        borderRadius: t.radius.xl,
                        outline: 'none',
                        appearance: 'none', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        boxShadow: isFocused 
                            ? (error ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : `0 0 0 3px ${t.color.primary}15`) 
                            : t.shadow.sm,
                        fontWeight: t.fontWeight.medium
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                >
                    <option value="" disabled hidden>Select an option</option>
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                {/* Custom Dropdown Arrow */}
                <div style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    pointerEvents: 'none', 
                    color: t.color.textPlaceholder, 
                    display: 'flex', 
                    alignItems: 'center' 
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>

            {error && (
                <span style={{ color: t.color.danger, fontSize: t.fontSize.xs, marginTop: '2px', fontWeight: t.fontWeight.semibold, marginLeft: '4px' }}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default SelectField;

