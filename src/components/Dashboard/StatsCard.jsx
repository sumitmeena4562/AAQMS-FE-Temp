import React from 'react';
import { t } from '../../theme/theme';

/**
 * Global StatsCard — Reusable across all pages.
 */
const StatsCard = ({ label, value, icon, iconBg = t.color.bgMuted, iconColor = t.color.textMuted, style = {} }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: `${t.space.xl}px ${t.space['2xl']}px`,
                background: t.color.bg,
                border: `1px solid #F0F0F0`,
                borderRadius: t.radius['2xl'],
                boxShadow: t.shadow.card,
                minWidth: 0,
                flex: '1 1 0',
                cursor: 'default',
                transition: `box-shadow ${t.transition.base}`,
                ...style,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = t.shadow.cardHover; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = t.shadow.card; }}
        >
            {icon && (
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: t.radius.circle,
                        background: iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: iconColor,
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </div>
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                    fontSize: t.fontSize.xs,
                    fontWeight: t.fontWeight.medium,
                    color: t.color.textPlaceholder,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: 3,
                }}>
                    {label}
                </div>
                <div style={{
                    fontSize: t.fontSize['5xl'],
                    fontWeight: t.fontWeight.bold,
                    color: t.color.text,
                    lineHeight: 1,
                }}>
                    {value}
                </div>
            </div>
        </div>
    );
};

/**
 * StatsRow — A responsive grid row of StatsCards.
 */
export const StatsRow = ({ items = [], gap = 12, style = {} }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${items.length}, 1fr)`,
            gap,
            ...style,
        }}>
            {items.map((item, i) => (
                <StatsCard key={i} {...item} />
            ))}
        </div>
    );
};

export default StatsCard;
