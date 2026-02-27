import React from 'react';
import Card from '../../components/ui/Card';
import {
    MdOutlineBusiness,
    MdOutlineAirplanemodeActive,
    MdOutlinePushPin,
    MdOutlineQrCodeScanner,
    MdOutlineAssignmentLate,
    MdOutlineVerified
} from 'react-icons/md';

// eslint-disable-next-line no-unused-vars
const CapabilityCard = ({ title, description, icon: Icon }) => {
    return (
        <Card
            className="capability-card"
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}
        >
            <div className="capability-icon-box" style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.08)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={24} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 className="capability-title" style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    color: 'var(--color-primary-dark)',
                    margin: 0,
                    letterSpacing: '-0.01em'
                }}>
                    {title}
                </h3>
                <p className="capability-desc" style={{
                    fontSize: '14px',
                    lineHeight: 1.5,
                    color: 'var(--color-text-secondary)',
                    margin: 0
                }}>
                    {description}
                </p>
            </div>
        </Card>
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
            padding: '80px 24px',
            background: 'rgba(248, 250, 252, 0.5)',
            borderTop: '1px solid var(--color-border-light)'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Section Header */}
                <div className="section-header" style={{ textAlign: 'left', marginBottom: '48px' }}>
                    <h2 className="section-title" style={{
                        fontSize: 'clamp(24px, 3.5vw, 36px)',
                        fontWeight: 800,
                        color: 'var(--color-primary-dark)',
                        marginBottom: '12px',
                        letterSpacing: '-0.01em'
                    }}>
                        Core Capabilities
                    </h2>
                    <p className="section-subtitle" style={{
                        fontSize: '16px',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '560px',
                        lineHeight: 1.5
                    }}>
                        Enterprise-grade tools built for rigorous inventory and safety standards.
                    </p>
                </div>

                {/* Grid */}
                <div className="capabilities-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '24px'
                }}>
                    {list.map((item, index) => (
                        <div key={index}>
                            <CapabilityCard {...item} />
                        </div>
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
                    .capabilities-grid {
                        grid-template-columns: 1fr !important;
                        gap: 16px !important;
                    }
                    .capability-card {
                        padding: 24px !important;
                        align-items: center;
                        text-align: center;
                    }
                }
            `}} />
        </section>
    );
};

export default Capabilities;
