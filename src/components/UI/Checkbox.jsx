import React, { useId, forwardRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { t } from '../../theme/theme';

const Checkbox = forwardRef(({ label, checked, onChange, required = false, id, defaultChecked, ...props }, ref) => {
    const reactId = useId();
    const inputId = id || `checkbox-${reactId}`;
    const localRef = React.useRef(null);

    // Merge refs
    const setRefs = (node) => {
        localRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
    };
    
    // Support for both controlled (passed from parent) and uncontrolled (RHF)
    const [internalChecked, setInternalChecked] = useState(checked ?? defaultChecked ?? false);

    useEffect(() => {
        // Sync with controlled prop
        if (checked !== undefined) {
            setInternalChecked(checked);
        } else if (localRef.current) {
            // Sync with actual DOM state (for RHF initialization)
            setInternalChecked(localRef.current.checked);
        }
    }, [checked]);

    // Extra sync on mount to catch RHF initialization
    useEffect(() => {
        if (localRef.current && checked === undefined) {
            setInternalChecked(localRef.current.checked);
        }
    }, []);

    const handleToggle = (e) => {
        const newValue = e.target.checked;
        if (checked === undefined) {
            setInternalChecked(newValue);
        }
        onChange?.(e);
    };

    return (
        <label 
            htmlFor={inputId}
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                cursor: 'pointer',
                userSelect: 'none',
                width: 'fit-content'
            }}
        >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input
                    ref={setRefs}
                    id={inputId}
                    type="checkbox"
                    {...props}
                    checked={checked}
                    defaultChecked={defaultChecked}
                    onChange={handleToggle}
                    required={required}
                    style={{
                        position: 'absolute',
                        opacity: 0,
                        width: 0,
                        height: 0,
                        margin: 0
                    }}
                />
                <motion.div
                    animate={{
                        backgroundColor: internalChecked ? t.color.primary : 'transparent',
                        borderColor: internalChecked ? t.color.primary : '#CBD5E1',
                    }}
                    initial={false}
                    transition={{ duration: 0.2 }}
                    style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '6px',
                        border: '2px solid #CBD5E1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1px'
                    }}
                >
                    <motion.svg
                        initial={false}
                        animate={{ opacity: internalChecked ? 1 : 0, scale: internalChecked ? 1 : 0.5 }}
                        transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FFF"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '12px', height: '12px' }}
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                </motion.div>
            </div>
            
            {label && (
                <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: t.color.textSecondary,
                    transition: 'color 0.2s ease',
                }}>
                    {label}
                </span>
            )}
        </label>
    );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
