import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { t } from '../../theme/theme';

const Checkbox = ({ label, checked, onChange, required = false, id, ...props }) => {
    const reactId = useId();
    const inputId = id || `checkbox-${reactId}`;

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
                    id={inputId}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    required={required}
                    style={{
                        position: 'absolute',
                        opacity: 0,
                        width: 0,
                        height: 0,
                        margin: 0
                    }}
                    {...props}
                />
                <motion.div
                    animate={{
                        backgroundColor: checked ? t.color.primary : 'transparent',
                        borderColor: checked ? t.color.primary : '#CBD5E1',
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
                        animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.5 }}
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
};

export default Checkbox;
