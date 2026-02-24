import React from 'react';
import Card from './Card';

const FeatureCard = ({ title, description, icon: Icon, colorTheme = 'primary' }) => {
    // Theme mapping for the icon container
    const themes = {
        primary: { bg: 'var(--color-primary-50)', color: 'var(--color-primary)' }, // Indigo/Purple
        secondary: { bg: '#EFF6FF', color: '#3B82F6' }, // Blue
        success: { bg: 'var(--color-success-lighter)', color: 'var(--color-success)' }, // Green
    };

    const theme = themes[colorTheme] || themes.primary;

    return (
        <Card
            padding="32px"
            borderRadius="20px"
            hoverEffect={true}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                cursor: 'default',
            }}
        >
            {/* Icon Box */}
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: theme.bg,
                color: theme.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {Icon && <Icon size={24} />}
            </div>

            {/* Text Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)'
                }}>
                    {title}
                </h3>
                <p style={{
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: 'var(--color-text-muted)'
                }}>
                    {description}
                </p>
            </div>
        </Card>
    );
};

export default FeatureCard;
