import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import { MdOutlineShield, MdOutlineMap, MdQrCodeScanner } from 'react-icons/md';
import { t } from '../../theme/theme';

// eslint-disable-next-line no-unused-vars
const FeatureCard = ({ title, description, icon: Icon, colorTheme, index }) => {
    const themes = {
        primary: { bg: `${t.color.primary}10`, color: t.color.primary },
        secondary: { bg: `${t.color.info}10`, color: t.color.info },
        success: { bg: `${t.color.success}10`, color: t.color.success }
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
                    border: `1px solid ${theme.color}30`
                }}
            >
                <div className="feature-icon-box" style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: t.radius.md,
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
                        color: t.color.primaryDark,
                        margin: 0,
                        letterSpacing: '-0.01em'
                    }}>
                        {title}
                    </h3>
                    <p className="feature-desc" style={{
                        fontSize: '15px',
                        lineHeight: 1.6,
                        color: t.color.textSecondary,
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
            background: t.color.bg,
            borderTop: `1px solid ${t.color.borderLight}`
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
                        color: t.color.primaryDark,
                        marginBottom: '16px',
                        letterSpacing: '-0.02em'
                    }}>
                        Orchestrated Safety Operations
                    </h2>
                    <p className="section-subtitle" style={{
                        fontSize: 'clamp(15px, 2vw, 17px)',
                        color: t.color.textSecondary,
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
