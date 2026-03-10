import React from 'react';

/**
 * Global StatsCard — Reusable across all pages.
 *
 * Props:
 * @param {string}        label     - e.g. "TOTAL ASSETS", "VERIFIED"
 * @param {string|number} value     - e.g. 24, 18
 * @param {ReactNode}     icon      - e.g. <FiUsers size={16} />
 * @param {string}        iconBg    - bg for icon circle, e.g. "#EFF6FF"
 * @param {string}        iconColor - icon color, e.g. "#2563EB"
 * @param {object}        style     - optional override
 */
const StatsCard = ({ label, value, icon, iconBg = '#F3F4F6', iconColor = '#6B7280', style = {} }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 20px',
                background: '#FFFFFF',
                border: '1px solid #F0F0F0',
                borderRadius: 12,
                boxShadow: '0 1px 4px rgba(0,0,0,0.05), 0 0 1px rgba(0,0,0,0.05)',
                minWidth: 0,
                flex: '1 1 0',
                cursor: 'default',
                transition: 'box-shadow 0.15s ease',
                ...style,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05), 0 0 1px rgba(0,0,0,0.05)'; }}
        >
            {/* Icon Circle */}
            {icon && (
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
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

            {/* Label + Value */}
            <div style={{ minWidth: 0, flex: 1 }}>
                <div
                    style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: '#9CA3AF',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: 3,
                    }}
                >
                    {label}
                </div>
                <div
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: '#111827',
                        lineHeight: 1,
                    }}
                >
                    {value}
                </div>
            </div>
        </div>
    );
};

/**
 * StatsRow — A responsive grid row of StatsCards.
 *
 * @param {Array}  items  - [{ label, value, icon, iconBg, iconColor }]
 * @param {number} gap    - gap between cards (default: 12)
 * @param {object} style  - optional override on the row
 */
export const StatsRow = ({ items = [], gap = 12, style = {} }) => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${items.length}, 1fr)`,
                gap,
                ...style,
            }}
        >
            {items.map((item, i) => (
                <StatsCard key={i} {...item} />
            ))}
        </div>
    );
};

export default StatsCard;
