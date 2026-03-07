import React, { useState } from 'react';

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
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
                </label>
            )}

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {icon && (
                    <span style={{ position: 'absolute', left: '16px', zIndex: 2, color: isFocused ? 'var(--color-primary)' : 'var(--color-text-muted)', transition: 'color var(--transition-fast)' }}>
                        {icon}
                    </span>
                )}

                <select
                    value={value}
                    onChange={onChange}
                    required={required}
                    style={{
                        width: '100%',
                        padding: icon ? '12px 16px 12px 42px' : '12px 16px',
                        paddingRight: '42px', // Space for dropdown arrow
                        fontSize: 'var(--font-size-sm)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        outline: 'none',
                        appearance: 'none', // Remove default dropdown arrow
                        cursor: 'pointer',
                        transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                        boxShadow: isFocused && !error ? '0 0 0 4px var(--color-accent-soft)' : (error && isFocused ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : 'none')
                    }}
                    onFocus={(e) => {
                        setIsFocused(true);
                        if (!error) e.target.style.borderColor = 'var(--color-primary)';
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        if (!error) e.target.style.borderColor = 'var(--color-border)';
                    }}
                    {...props}
                >
                    <option value="" disabled hidden>Select an option</option>
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                {/* Custom Dropdown Arrow */}
                <div style={{ position: 'absolute', right: '16px', pointerEvents: 'none', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>

            {error && (
                <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '2px' }}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default SelectField;
