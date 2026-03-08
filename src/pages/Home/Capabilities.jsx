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
                    backgroundColor: '#ffffff',
                    border: '1px solid #f1f5f9'
                }}
            >
                <div className="capability-icon-box" style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(59, 130, 246, 0.05)',
                    color: '#3b82f6',
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
                        color: '#0f172a',
                        margin: 0,
                        letterSpacing: '-0.02em'
                    }}>
                        {title}
                    </h3>
                    <p className="capability-desc" style={{
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: '#64748b',
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
            padding: '100px 24px',
            background: 'rgba(248, 250, 252, 0.5)',
            borderTop: '1px solid #f1f5f9'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="section-header"
                    style={{ textAlign: 'left', marginBottom: '56px' }}
                >
                    <h2 className="section-title" style={{
                        fontSize: 'clamp(28px, 3.5vw, 42px)',
                        fontWeight: 800,
                        color: '#0f172a',
                        marginBottom: '16px',
                        letterSpacing: '-0.02em'
                    }}>
                        Core Capabilities
                    </h2>
                    <p className="section-subtitle" style={{
                        fontSize: '17px',
                        color: '#64748b',
                        maxWidth: '600px',
                        lineHeight: 1.6
                    }}>
                        Enterprise-grade tools built for rigorous inventory and safety standards.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="capabilities-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
                    .capabilities-section {
                        padding: 60px 20px !important;
                    }
                    .section-header {
                        text-align: center !important;
                        margin-bottom: 40px !important;
                    }
                    .section-subtitle {
                        margin: 0 auto !important;
                    }
                }
            `}} />
        </section>
    );
};

export default Capabilities;
