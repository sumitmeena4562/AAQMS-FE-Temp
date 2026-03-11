import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import {
    MdOutlineBusiness,
    MdOutlineAirplanemodeActive,
    MdOutlinePushPin,
    MdOutlineQrCodeScanner,
    MdOutlineAssignmentLate,
    MdOutlineVerified,
} from 'react-icons/md';
import { t } from '../../theme/theme';

// eslint-disable-next-line no-unused-vars
const CapabilityCard = ({ title, description, icon: Icon, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ height: '100%' }}
        >
            <Card
                className="capability-card"
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    backgroundColor: t.color.bg,
                    border: `1px solid ${t.color.borderLight}`
                }}
            >
                <div className="capability-icon-box" style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: t.radius.md,
                    background: `${t.color.primary}10`,
                    color: t.color.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={24} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 className="capability-title" style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        color: t.color.text,
                        margin: 0,
                        letterSpacing: '-0.02em'
                    }}>
                        {title}
                    </h3>
                    <p className="capability-desc" style={{
                        fontSize: '14px',
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

const Capabilities = () => {
    const list = [
        {
            title: "Multi-Site Management",
            description: "Unified dashboard for managing safety protocols across distributed facilities and subsidiaries.",
            icon: MdOutlineBusiness
        },
        {
            title: "Digital Mapping (Drone/2D)",
            description: "Integrate drone imagery and 2D floor plans to create accurate digital twins of your zones.",
            icon: MdOutlineAirplanemodeActive
        },
        {
            title: "Smart Zone Marking",
            description: "Geofence high-risk assets and assign specific inventory checklists to precise locations.",
            icon: MdOutlinePushPin
        },
        {
            title: "QR Inventory Tracking",
            description: "Generate and scan secure QR codes to instantly verify asset presence and condition.",
            icon: MdOutlineQrCodeScanner
        },
        {
            title: "AI Mismatch Detection",
            description: "Algorithms automatically flag discrepancies between recorded inventory and live audit data.",
            icon: MdOutlineAssignmentLate
        },
        {
            title: "Verified Reporting",
            description: "Generate tamper-proof audit trails and compliance reports for stakeholders.",
            icon: MdOutlineVerified
        }
    ];

    return (
        <section className="capabilities-section" style={{
            padding: 'clamp(60px, 10vh, 100px) 24px',
            background: t.color.bgSecondary,
            borderTop: `1px solid ${t.color.borderLight}`
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="section-header"
                    style={{ textAlign: 'left', marginBottom: 'clamp(40px, 6vh, 60px)' }}
                >
                    <h2 className="section-title" style={{
                        fontSize: 'clamp(26px, 5vw, 40px)',
                        fontWeight: 800,
                        color: t.color.text,
                        marginBottom: '16px',
                        letterSpacing: '-0.02em'
                    }}>
                        Core Capabilities
                    </h2>
                    <p className="section-subtitle" style={{
                        fontSize: 'clamp(15px, 2vw, 17px)',
                        color: t.color.textSecondary,
                        maxWidth: '600px',
                        lineHeight: 1.6
                    }}>
                        Enterprise-grade tools built for rigorous inventory and safety standards.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="capabilities-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {list.map((item, index) => (
                        <CapabilityCard key={index} {...item} index={index} />
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 768px) {
                    .section-header {
                        text-align: center !important;
                    }
                    .section-subtitle {
                        margin: 0 auto !important;
                    }
                    .capabilities-grid {
                        grid-template-columns: 1fr !important;
                        gap: 16px !important;
                    }
                }
            `}} />
        </section>
    );
};

export default Capabilities;
