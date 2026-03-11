import React from 'react';

const DotStatus = ({ type, text }) => {
    const styles = {
        unassigned: { dot: '#F87171', bg: '#FEF2F2', border: '#FECACA', color: '#B91C1C' },
        assigned:   { dot: '#94A3B8', bg: '#F8FAFC', border: '#E2E8F0', color: '#475569' },
        active:     { dot: '#34D399', bg: '#ECFDF5', border: '#A7F3D0', color: '#065F46' },
        inactive:   { dot: '#D1D5DB', bg: '#F9FAFB', border: '#E5E7EB', color: '#6B7280' },
    };

    const s = styles[type?.toLowerCase()] || styles.inactive;
    const label = text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 8px', borderRadius: 20,
            background: s.bg, border: `1px solid ${s.border}`,
            fontSize: 11, fontWeight: 600, color: s.color,
        }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
            {label}
        </span>
    );
};

export default DotStatus;
