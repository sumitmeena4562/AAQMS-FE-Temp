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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: index * 0.1, ease: [0.21, 1, 0.36, 1] }}
            style={{ height: '100%' }}
        >
            <motion.div
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                style={{ height: '100%' }}
            >
                <Card
                    className="capability-card"
                    style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: `1px solid rgba(255, 255, 255, 0.3)`,
                        boxShadow: `0 10px 30px -10px ${t.color.primary}15`,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Decorative Background Glow */}
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        width: '80px',
                        height: '80px',
                        background: `${t.color.primary}05`,
                        borderRadius: '50%',
                        filter: 'blur(30px)',
                        pointerEvents: 'none'
                    }} />

                    <div className="capability-icon-box" style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: `linear-gradient(135deg, ${t.color.primary}15, ${t.color.primary}05)`,
                        color: t.color.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `inset 0 0 0 1px ${t.color.primary}10`,
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <Icon size={28} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 1 }}>
                        <h3 className="capability-title" style={{
                            fontSize: '20px',
                            fontWeight: 850,
                            color: t.color.primaryDark,
                            margin: 0,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.2
                        }}>
                            {title}
                        </h3>
                        <p className="capability-desc" style={{
                            fontSize: '15px',
                            lineHeight: 1.6,
                            color: t.color.textSecondary,
                            margin: 0,
                            fontWeight: 450
                        }}>
                            {description}
                        </p>
                    </div>
                </Card>
            </motion.div>
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
            padding: '120px 24px',
            background: t.color.bgSecondary,
            borderTop: `1px solid ${t.color.borderLight}`
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1] }}
                    className="section-header"
                    style={{ textAlign: 'left', marginBottom: 'clamp(48px, 8vh, 72px)' }}
                >
                    <div style={{ 
                        fontSize: '11px', 
                        fontWeight: 900, 
                        color: t.color.primaryLight, 
                        letterSpacing: '0.25em', 
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{ width: '40px', height: '1px', background: t.color.primaryLight, opacity: 0.3 }}></div>
                        Key Expertise
                    </div>
                    <h2 className="section-title" style={{
                        fontSize: 'clamp(32px, 6vw, 48px)',
                        fontWeight: 950,
                        color: t.color.primaryDark,
                        marginBottom: '20px',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.1
                    }}>
                        Core <span style={{ color: t.color.primaryLight }}>Capabilities.</span>
                    </h2>
                    <p className="section-subtitle" style={{
                        fontSize: 'clamp(16px, 2.5vw, 19px)',
                        color: t.color.textTertiary,
                        maxWidth: '640px',
                        lineHeight: 1.6,
                        fontWeight: 450
                    }}>
                        Enterprise-grade tools built for rigorous inventory and safety standards, delivering precision at every touchpoint.
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
