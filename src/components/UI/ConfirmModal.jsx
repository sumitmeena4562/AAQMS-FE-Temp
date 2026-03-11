import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import { t } from '../../theme/theme';

/**
 * Global reusable confirmation modal.
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
                    background: t.color.overlayDark,
                    backdropFilter: 'blur(2px)',
                    zIndex: t.zIndex.overlay,
                }}
            />

            {/* Dialog */}
            <div style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: t.layout.modalWidth, maxWidth: '90vw',
                background: t.color.bg,
                borderRadius: t.radius['2xl'],
                boxShadow: t.shadow.xl,
                zIndex: t.zIndex.modal,
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${t.space.xl}px ${t.space['2xl']}px`, borderBottom: `1px solid ${t.color.borderLight}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {danger && (
                            <div style={{ width: 32, height: 32, borderRadius: t.radius.circle, background: t.color.dangerBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FiAlertTriangle size={16} color={t.color.danger} />
                            </div>
                        )}
                        <span style={{ fontSize: t.fontSize.lg, fontWeight: t.fontWeight.semibold, color: t.color.text }}>{title}</span>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.color.textPlaceholder, display: 'flex', padding: 4 }}>
                        <FiX size={16} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: `${t.space['2xl']}px ${t.space['2xl']}px ${t.space['3xl']}px`, fontSize: t.fontSize.md, color: t.color.textMuted, lineHeight: 1.6 }}>
                    {message}
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: t.space.md, padding: `0 ${t.space['2xl']}px ${t.space.xl}px` }}>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            padding: `${t.space.md}px ${t.space.xl}px`, fontSize: t.fontSize.md, fontWeight: t.fontWeight.medium,
                            color: t.color.textSecondary, background: t.color.bg,
                            border: `1px solid ${t.color.border}`, borderRadius: t.radius.md,
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
                            padding: `${t.space.md}px ${t.space.xl}px`, fontSize: t.fontSize.md, fontWeight: t.fontWeight.semibold,
                            color: t.color.textInverse,
                            background: danger ? t.color.danger : t.color.primary,
                            border: `1px solid ${danger ? '#DC2626' : t.color.primaryDark}`,
                            borderRadius: t.radius.md,
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
