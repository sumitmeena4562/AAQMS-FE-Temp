import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import { t } from '../../theme/theme';

import Button from './Button';

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
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed', inset: 0,
                            background: 'rgba(0,0,0,0.1)',
                            backdropFilter: 'blur(4px)',
                            zIndex: t.zIndex.overlay,
                        }}
                    />

                    {/* Dialog */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        style={{
                            position: 'fixed',
                            top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 'min(400px, 90vw)',
                            background: 'var(--color-bg-card)',
                            borderRadius: 'var(--radius-card)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                            zIndex: t.zIndex.modal,
                            overflow: 'hidden',
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', borderBottom: '1px solid var(--border-main-50)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ 
                                    width: 32, height: 32, borderRadius: 10, 
                                    background: danger ? '#FEF2F2' : t.color.primaryBg, 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                }}>
                                    <FiAlertTriangle size={16} color={danger ? t.color.danger : t.color.primary} />
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 900, color: t.color.text }}>{title}</span>
                            </div>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.color.textPlaceholder, display: 'flex', padding: 4 }}>
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{ padding: '32px', fontSize: 14, color: t.color.textSecondary, lineHeight: 1.6, fontWeight: 500 }}>
                            {message}
                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '0 32px 24px' }}>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                                className="!h-10 !px-5 !rounded-[var(--radius-button)] !text-[12px] !font-black"
                            >
                                {cancelText}
                            </Button>
                            <Button
                                variant={danger ? 'danger' : 'primary'}
                                onClick={onConfirm}
                                loading={loading}
                                className="!h-10 !px-6 !rounded-[var(--radius-button)] !text-[12px] !font-black"
                            >
                                {confirmText}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
