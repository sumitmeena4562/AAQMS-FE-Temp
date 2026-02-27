import React, { useId } from 'react';

const Checkbox = ({ label, checked, onChange, required = false, id, ...props }) => {
    const reactId = useId();
    const inputId = id || `checkbox-${reactId}`;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
                id={inputId}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                required={required}
                style={{
                    accentColor: 'var(--color-primary)',
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer'
                }}
                {...props}
            />
            {label && (
                <label
                    htmlFor={inputId}
                    style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        userSelect: 'none' // Prevents text selection on double click
                    }}
                >
                    {label}
                </label>
            )}
        </div>
    );
};

export default Checkbox;
