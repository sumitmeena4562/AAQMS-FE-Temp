import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import { t } from '../../theme/theme';
import Button from './Button';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm User Delete',
    message = 'Are you sure you want to proceed? This action cannot be undone.',
    confirmText = 'Delete Profile',
    cancelText = 'Cancel',
    danger = false,
    loading = false,
}) => {
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div 
                    style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999999, display: 'grid', placeItems: 'center', padding: 24, pointerEvents: 'auto' }}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(10px)',
                        }}
                    />

                    {/* Elite Warning Dialog */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        style={{
                            position: 'relative',
                            width: 'min(440px, 100%)',
                            background: 'white',
                            borderRadius: 16,
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Header Section */}
                        <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ 
                                    width: 36, height: 36, borderRadius: 10, 
                                    background: danger ? '#FEF2F2' : '#EFF6FF', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                }}>
                                    <FiAlertTriangle size={18} color={danger ? '#E11D48' : t.color.primary} strokeWidth={2.5} />
                                </div>
                                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#1E293B', margin: 0, letterSpacing: '-0.02em' }}>
                                    {title}
                                </h3>
                             </div>
                            <button 
                                onClick={onClose} 
                                style={{ 
                                    border: 'none', background: 'transparent', cursor: 'pointer', 
                                    color: '#94A3B8', display: 'flex', padding: 4 
                                }}
                                className="hover:text-rose-500 transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Body Section */}
                        <div style={{ padding: '20px 24px 32px', fontSize: 14, color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
                            {message}
                        </div>

                        {/* Elite Footer Actions */}
                        <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                                className="!h-10 !px-5 !rounded-lg !text-[12px] !font-black !uppercase !tracking-widest !bg-white !border-slate-200"
                            >
                                {cancelText}
                            </Button>
                            <Button
                                variant={danger ? 'danger' : 'primary'}
                                onClick={onConfirm}
                                loading={loading}
                                className={`!h-10 !px-6 !rounded-lg !text-[12px] !font-black !uppercase !tracking-widest ${danger ? 'shadow-lg shadow-rose-200' : 'shadow-lg shadow-primary/20'}`}
                            >
                                {confirmText}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ConfirmModal;
