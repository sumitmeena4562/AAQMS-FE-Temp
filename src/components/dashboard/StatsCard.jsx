import React from 'react';
import Card from '../ui/Card';

const StatsCard = ({ title, value, change, changeType, icon: Icon }) => {
    return (
        <Card
            padding="24px"
            borderRadius="16px"
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '240px', // Fixed width based on design
            }}
        >
            {/* Header: Title and Icon */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {title}
                </span>
                {Icon && (
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'var(--color-primary-50)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-primary-dark)'
                    }}>
                        <Icon size={18} />
                    </div>
                )}
            </div>

            {/* Main Value */}
            <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1
            }}>
                {value}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)', margin: 0 }} />

            {/* Footer: Change indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: changeType === 'positive' ? 'var(--color-success-lighter)' : 'var(--color-danger-lighter)',
                    color: changeType === 'positive' ? 'var(--color-success)' : 'var(--color-danger)',
                    fontSize: '11px',
                    fontWeight: 600
                }}>
                    {changeType === 'positive' ? '↗' : '↘'} {change}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    vs last month
                </span>
            </div>
        </Card>
    );
};

export default StatsCard;
