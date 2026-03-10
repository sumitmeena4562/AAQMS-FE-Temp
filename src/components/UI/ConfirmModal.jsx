import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

/**
 * Global reusable confirmation modal.
 * 
 * @param {boolean}  isOpen        - show/hide
 * @param {Function} onClose       - cancel handler
 * @param {Function} onConfirm     - confirm handler
 * @param {string}   title         - e.g. "Delete User"
 * @param {string}   message       - e.g. "Are you sure? This cannot be undone."
 * @param {string}   confirmText   - button label (default: "Confirm")
 * @param {string}   cancelText    - button label (default: "Cancel")
 * @param {boolean}  danger        - red styling (default: false)
 * @param {boolean}  loading       - disable buttons while processing
 */
const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
    loading = false,
}) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(2px)',
                    zIndex: 9998,
                }}
            />

            {/* Dialog */}
            <div style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400, maxWidth: '90vw',
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                zIndex: 9999,
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {danger && (
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FiAlertTriangle size={16} color="#EF4444" />
                            </div>
                        )}
                        <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{title}</span>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', padding: 4 }}>
                        <FiX size={16} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '20px 20px 24px', fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>
                    {message}
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0 20px 16px' }}>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            padding: '8px 16px', fontSize: 13, fontWeight: 500,
                            color: '#374151', background: '#fff',
                            border: '1px solid #E5E7EB', borderRadius: 7,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.5 : 1,
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            padding: '8px 16px', fontSize: 13, fontWeight: 600,
                            color: '#fff',
                            background: danger ? '#EF4444' : '#4F46E5',
                            border: `1px solid ${danger ? '#DC2626' : '#4338CA'}`,
                            borderRadius: 7,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ConfirmModal;
