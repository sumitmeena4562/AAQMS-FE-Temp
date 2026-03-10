import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import { MdOutlineShield, MdOutlineMap, MdQrCodeScanner } from 'react-icons/md';

// eslint-disable-next-line no-unused-vars
const FeatureCard = ({ title, description, icon: Icon, colorTheme, index }) => {
    const themes = {
        primary: { bg: 'rgba(7, 34, 103, 0.05)', color: '#072267' },
        secondary: { bg: 'rgba(59, 130, 246, 0.05)', color: '#3b82f6' },
        success: { bg: 'rgba(16, 185, 129, 0.05)', color: '#10b981' }
    };

    const theme = themes[colorTheme] || themes.primary;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ height: '100%' }}
        >
            <Card
                className="role-feature-card"
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    border: `1px solid ${theme.bg.replace('0.05', '0.2')}`
                }}
            >
                <div className="feature-icon-box" style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: theme.bg,
                    color: theme.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={28} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h3 className="feature-title" style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: '#0f172a',
                        margin: 0,
                        letterSpacing: '-0.01em'
                    }}>
                        {title}
                    </h3>
                    <p className="feature-desc" style={{
                        fontSize: '15px',
                        lineHeight: 1.6,
                        color: '#475569',
                        margin: 0
                    }}>
                        {description}
                    </p>
                </div>
            </Card>
        </motion.div>
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
            padding: 'clamp(60px, 10vh, 100px) 24px',
            background: 'var(--color-bg-primary)',
            borderTop: '1px solid var(--color-border-light)'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="section-header"
                    style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vh, 80px)' }}
                >
                    <h2 className="section-title" style={{
                        fontSize: 'clamp(26px, 5vw, 42px)',
                        fontWeight: 800,
                        color: 'var(--color-text-primary)',
                        marginBottom: '16px',
                        letterSpacing: '-0.02em'
                    }}>
                        Orchestrated Safety Operations
                    </h2>
                    <p className="section-subtitle" style={{
                        fontSize: 'clamp(15px, 2vw, 17px)',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        Seamless coordination between administration, planning, and field execution.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="features-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} index={index} />
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 768px) {
                    .features-grid {
                        grid-template-columns: 1fr !important;
                        gap: 16px !important;
                    }
                    .section-header {
                        text-align: center !important;
                    }
                }
            `}} />
        </section>
    );
};

export default RoleFeatures;
