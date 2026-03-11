import React from 'react';
import { t } from '../../theme/theme';

const Badge = ({ children, color = 'primary', variant = 'solid', size = 'md' }) => {

    // Theme mapping for colors
    const colors = {
        primary: { bg: t.color.primary, text: t.color.textInverse, lightBg: t.color.primaryBg, lightText: t.color.primary },
        success: { bg: t.color.success, text: t.color.textInverse, lightBg: t.color.successBg, lightText: t.color.successDark },
        danger:  { bg: t.color.danger, text: t.color.textInverse, lightBg: t.color.dangerBg, lightText: t.color.dangerDark },
        warning: { bg: t.color.warning, text: t.color.textInverse, lightBg: t.color.warningBg, lightText: t.color.warningDark },
        neutral: { bg: t.color.bgMuted, text: t.color.textSecondary, lightBg: t.color.bgHover, lightText: t.color.textMuted },
    };

    const c = colors[color] || colors.primary;

    // Size mapping
    const sizes = {
        sm: { padding: '2px 6px', fontSize: t.fontSize.xxs, radius: t.radius.xs },
        md: { padding: '4px 9px', fontSize: t.fontSize.xs, radius: t.radius.sm },
        lg: { padding: '6px 12px', fontSize: t.fontSize.sm, radius: t.radius.md },
        pill: { padding: '6px 16px', fontSize: t.fontSize.sm, radius: t.radius.pill }
    };

    const s = sizes[size] || sizes.md;

    // Style generation based on variant
    const getStyles = () => {
        const baseStyles = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: t.fontWeight.bold,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: s.padding,
            fontSize: s.fontSize,
            borderRadius: s.radius,
            whiteSpace: 'nowrap',
            fontFamily: 'inherit'
        };

        if (variant === 'light') {
            return { ...baseStyles, background: c.lightBg, color: c.lightText };
        }
        if (variant === 'outline') {
            return { ...baseStyles, background: 'transparent', color: c.lightText, border: `1px solid ${c.bg}` };
        }
        // Default solid
        return { ...baseStyles, background: c.bg, color: c.text };
    };

    return (
        <span style={getStyles()}>
            {children}
        </span>
    );
};

export default Badge;
