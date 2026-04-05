import React from 'react';
import { t } from '../../theme/theme';

const DotStatus = ({ type, text, size = 'sm' }) => {
    const styles = {
        unassigned: { dot: t.color.danger, bg: t.color.dangerBg, border: t.color.dangerBorder, color: t.color.dangerDark },
        assigned:   { dot: t.color.success, bg: t.color.successBg, border: t.color.successBorder, color: t.color.successDark },
        active:     { dot: t.color.success, bg: t.color.successBg, border: t.color.successBorder, color: t.color.successDark },
        inactive:   { dot: t.color.textPlaceholder, bg: t.color.bgMuted, border: t.color.border, color: t.color.textSecondary },
        pending:    { dot: t.color.warning, bg: t.color.warningBg, border: t.color.warningBorder, color: t.color.warningDark },
    };

    const s = styles[type?.toLowerCase()] || styles.inactive;
    const label = text || type || '';
    
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: size === 'sm' ? '2px 8px' : '4px 12px', 
            borderRadius: t.radius.pill,
            background: s.bg, border: `1px solid ${s.border}`,
            fontSize: size === 'sm' ? 10 : 12, 
            fontWeight: t.fontWeight.bold, 
            color: s.color,
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            boxShadow: t.shadow.xs
        }}>
            <span style={{ 
                width: size === 'sm' ? 6 : 8, 
                height: size === 'sm' ? 6 : 8, 
                borderRadius: '50%', 
                background: s.dot, 
                flexShrink: 0,
                boxShadow: `0 0 4px ${s.dot}40`
            }} />
            {label}
        </span>
    );
};

export default DotStatus;
