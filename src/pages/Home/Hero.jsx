import React from 'react';
import Card from '../../components/ui/Card';
import StatusRow from '../../components/ui/StatusRow';

// Icon components for StatusRow
const CheckIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

const AlertIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);

const PendingIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);

const Hero = () => {
    return (
        <section className="hero-section" style={{ position: 'relative' }}>
            <div className="hero-grid" style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: 'clamp(32px, 6vh, 80px) 24px',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
                gap: 'clamp(24px, 4vw, 60px)',
                alignItems: 'center',
                position: 'relative'
            }}>
                {/* Background decorative blob */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '32px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'var(--color-border-dark)',
                    opacity: 0.2,
                    zIndex: 0
                }}></div>

                {/* Left side: Typography */}
                <div style={{ zIndex: 10 }}>
                    <div className="hero-pill" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '5px 14px',
                        background: '#fff',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--color-border)',
                        marginBottom: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--color-text-secondary)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary-light)' }}></div>
                        Enterprise Version 4.0 Live
                    </div>

                    <h1 className="hero-heading" style={{
                        fontSize: 'clamp(1.75rem, 5vw, 3.2rem)',
                        fontWeight: 800,
                        lineHeight: 1.15,
                        color: 'var(--color-primary-dark)',
                        marginBottom: '20px',
                        letterSpacing: '-0.02em',
                        maxWidth: '15ch'
                    }}>
                        AI-Enabled Safety Audits & <span style={{ color: 'var(--color-info)' }}>Inventory Verification.</span>
                    </h1>

                    <p className="hero-paragraph" style={{
                        fontSize: '15px',
                        color: 'var(--color-text-tertiary)',
                        lineHeight: 1.6,
                        marginBottom: '28px',
                        maxWidth: '500px'
                    }}>
                        Orchestrate complex operations with integrated Drone Maps and AI-assisted inventory comparison. Ensure asset accountability and regulatory compliance at scale.
                    </p>

                    <div className="hero-buttons" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button className="cta-button primary" style={{
                            padding: '11px 22px',
                            background: 'var(--color-primary-dark)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(7, 34, 103, 0.2)'
                        }}>
                            Request Demo
                        </button>

                        <button className="cta-button secondary" style={{
                            padding: '11px 22px',
                            background: '#fff',
                            color: 'var(--color-text-primary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polygon points="10 8 16 12 10 16 10 8"></polygon>
                            </svg>
                            View Capabilities
                        </button>
                    </div>
                </div>

                {/* Right side: App UI Map Monitor */}
                <div className="hero-card-container" style={{ zIndex: 10 }}>
                    <Card
                        padding="20px"
                        borderRadius="20px"
                        style={{ width: '100%', maxWidth: '100%' }}
                        hoverEffect={false}
                    >
                        {/* Header */}
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--font-size-xs)', fontWeight: 800, color: 'var(--color-text-secondary)', letterSpacing: '0.08em' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                                ZONE MAP MONITOR
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 600, color: 'var(--color-text-tertiary)', background: 'var(--color-bg-primary)', padding: '4px 10px', borderRadius: ' var(--radius-full)' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 8px var(--color-success)' }}></div>
                                Live Feed
                            </div>
                        </div>

                        {/* List Items using StatusRow for best-in-class responsiveness */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                            <StatusRow
                                title="Zone 101"
                                subtitle="Fire Safety Equipment"
                                icon={CheckIcon}
                                status="success"
                                statusText="VERIFIED"
                            />
                            <StatusRow
                                title="Zone 102"
                                subtitle="Critical Asset Missing"
                                icon={AlertIcon}
                                status="alert"
                                statusText="ALERT"
                                extraText="1 Asset Unaccounted"
                                isAlert
                            />
                            <StatusRow
                                title="Zone 103"
                                subtitle="Scheduled: 14:00"
                                icon={PendingIcon}
                                status="pending"
                                statusText="PENDING"
                            />
                        </div>

                        {/* Map Image Block */}
                        <div style={{
                            width: '100%',
                            height: 'clamp(140px, 20vh, 180px)',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #4daebb 0%, #2f8c9d 100%)',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', background: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.05) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.05) 20px)' }}></div>

                            {/* Map Points */}
                            <div style={{ position: 'absolute', top: '30%', left: '30%', width: '10px', height: '10px', borderRadius: '50%', background: '#fff', border: '2px solid var(--color-success)', boxShadow: '0 0 10px rgba(5,150,105,0.4)' }}></div>
                            <div style={{ position: 'absolute', top: '60%', left: '55%', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-danger)', border: '2px solid #fff', boxShadow: '0 0 10px rgba(239,68,68,0.5)' }}></div>
                            <div style={{ position: 'absolute', top: '70%', left: '75%', width: '8px', height: '8px', borderRadius: '50%', background: '#fff', opacity: 0.8 }}></div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Inline styles for media queries */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 1024px) {
                    .hero-grid {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                        padding-top: 40px !important;
                    }
                    .hero-heading {
                        margin-left: auto;
                        margin-right: auto;
                        max-width: 100% !important;
                    }
                    .hero-paragraph {
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .hero-buttons {
                        justify-content: center;
                    }
                    .hero-pill {
                        margin-left: auto;
                        margin-right: auto;
                    }
                }

                @media (max-width: 640px) {
                    .hero-heading {
                        font-size: 2.2rem !important;
                    }
                    .cta-button {
                        width: 100%;
                    }
                    .hero-buttons {
                        flex-direction: column;
                    }
                    .card-header {
                        flex-direction: column;
                        align-items: flex-start !important;
                    }
                }
            `}} />
        </section>
    );
};

export default Hero;
