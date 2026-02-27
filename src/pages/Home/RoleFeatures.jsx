import React from 'react';
import Card from '../../components/ui/Card';
import { MdOutlineShield, MdOutlineMap, MdQrCodeScanner } from 'react-icons/md';

const FeatureCard = ({ title, description, icon: Icon, colorTheme }) => {
    const themes = {
        primary: { bg: 'rgba(7, 34, 103, 0.05)', color: 'var(--color-primary-dark)' },
        secondary: { bg: 'rgba(59, 130, 246, 0.05)', color: '#3b82f6' },
        success: { bg: 'rgba(16, 185, 129, 0.05)', color: '#10b981' }
    };

    const theme = themes[colorTheme] || themes.primary;

    return (
        <Card
            className="role-feature-card"
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}
        >
            <div className="feature-icon-box" style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: theme.bg,
                color: theme.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={24} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 className="feature-title" style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--color-primary-dark)',
                    margin: 0
                }}>
                    {title}
                </h3>
                <p className="feature-desc" style={{
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: 'var(--color-text-secondary)',
                    margin: 0
                }}>
                    {description}
                </p>
            </div>
        </Card>
    );
};

const RoleFeatures = () => {
    const features = [
        {
            title: "Admin",
            description: "Centralized control to define safety standards, manage user roles, and oversee organizational compliance metrics.",
            icon: MdOutlineShield,
            colorTheme: "primary"
        },
        {
            title: "Coordinator",
            description: "Strategic planning tools to map zones, assign inventory audits, and monitor real-time drone feeds.",
            icon: MdOutlineMap,
            colorTheme: "secondary"
        },
        {
            title: "Field Officer",
            description: "Mobile-first interface for rapid QR scanning, evidence capture, and instant verification reporting.",
            icon: MdQrCodeScanner,
            colorTheme: "success"
        }
    ];

    return (
        <section className="role-features-section" style={{
            padding: '80px 24px',
            background: '#fff',
            borderTop: '1px solid var(--color-border-light)'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Section Header */}
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <h2 className="section-title" style={{
                        fontSize: 'clamp(24px, 3.5vw, 36px)',
                        fontWeight: 800,
                        color: 'var(--color-primary-dark)',
                        marginBottom: '14px',
                        letterSpacing: '-0.01em'
                    }}>
                        Orchestrated Safety Operations
                    </h2>
                    <p className="section-subtitle" style={{
                        fontSize: '16px',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '560px',
                        margin: '0 auto',
                        lineHeight: 1.5
                    }}>
                        Seamless coordination between administration, planning, and field execution.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="features-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {features.map((feature, index) => (
                        <div key={index}>
                            <FeatureCard {...feature} />
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 768px) {
                    .role-features-section {
                        padding: 60px 20px !important;
                    }
                    .section-header {
                        margin-bottom: 40px !important;
                    }
                    .features-grid {
                        grid-template-columns: 1fr !important;
                        gap: 20px !important;
                    }
                    .role-feature-card {
                        padding: 30px !important;
                        gap: 20px !important;
                        text-align: center;
                        align-items: center;
                    }
                    .feature-title {
                        font-size: 18px !important;
                    }
                    .feature-desc {
                        font-size: 14px !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .role-feature-card {
                        padding: 24px !important;
                    }
                }
            `}} />
        </section>
    );
};

export default RoleFeatures;
