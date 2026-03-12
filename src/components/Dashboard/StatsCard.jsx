import React from 'react';
import { motion } from 'framer-motion';
import { t } from '../../theme/theme';

/**
 * Global StatsCard — Reusable across all pages.
 */const StatsCard = ({ label, value, icon, iconBg = t.color.bgMuted, iconColor = t.color.textMuted, trend, subValue, style = {} }) => {
    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: t.shadow.cardHover }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '24px 28px',
                background: '#fff',
                border: `1px solid #EDEDED`,
                borderRadius: t.radius['2xl'],
                boxShadow: t.shadow.card,
                minWidth: 0,
                flex: '1 1 0',
                cursor: 'default',
                position: 'relative',
                ...style,
            }}
        >
            {/* Icon Container */}
            <div
                style={{
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    background: iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: iconColor,
                    flexShrink: 0,
                    border: `1px solid rgba(0,0,0,0.03)`
                }}
            >
                {icon && React.cloneElement(icon, { size: 22 })}
            </div>

            {/* Content Container */}
            <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#8A92A6',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: 2,
                    fontFamily: 'Segoe UI, system-ui, sans-serif'
                }}>
                    {label}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <div style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: '#1A202C',
                        lineHeight: 1,
                        fontFamily: 'Segoe UI, system-ui, sans-serif'
                    }}>
                        {value}
                    </div>
                    {trend !== undefined && (
                        <div style={{ 
                            fontSize: 11, 
                            fontWeight: 700, 
                            color: trend > 0 ? t.color.success : t.color.danger,
                        }}>
                            {trend > 0 ? '↑' : '↓'}{Math.abs(trend)}%
                        </div>
                    )}
                </div>
                {subValue && (
                    <div style={{ 
                        fontSize: 11, 
                        fontWeight: 500, 
                        color: t.color.textMuted, 
                        marginTop: 4
                    }}>
                        {subValue}
                    </div>
                )}
            </div>
        </motion.div>
    );
};



/**
 * StatsRow — A responsive grid row of StatsCards.
 */
export const StatsRow = ({ items = [], gap = 16, style = {} }) => {
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

