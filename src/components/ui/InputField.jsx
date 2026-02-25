import React, { useState } from 'react';

const InputField = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    icon,
    error, // Pass error message text here
    helperText, // Extra info under the input
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', width: '100%', ...containerStyle }} className={className}>
            {label && (
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
                </label>
            )}

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {/* Left Icon */}
                {icon && (
                    <span style={{ position: 'absolute', left: '16px', color: isFocused ? 'var(--color-primary)' : 'var(--color-text-muted)', transition: 'color var(--transition-fast)' }}>
                        {icon}
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
                        padding: icon ? '12px 16px 12px 42px' : '12px 16px',
                        paddingRight: isPassword ? '42px' : '16px',
                        fontSize: 'var(--font-size-sm)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        outline: 'none',
                        transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                        boxShadow: isFocused && !error ? '0 0 0 3px var(--color-primary-50)' : (error && isFocused ? '0 0 0 3px var(--color-danger-light)' : 'none')
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
                />

                {/* Right Password Toggle Icon */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '12px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {showPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>
                        )}
                    </button>
                )}
            </div>

            {/* Error or Help Text */}
            {error ? (
                <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '2px' }}>{error}</span>
            ) : helperText ? (
                <span style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginTop: '2px' }}>{helperText}</span>
            ) : null}
        </div>
    );
};

export default InputField;
