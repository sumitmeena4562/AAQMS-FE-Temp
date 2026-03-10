import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import StatusRow from '../../components/UI/StatusRow';

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
    // Entrance Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
            <motion.div
                className="hero-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: 'clamp(40px, 8vh, 100px) 24px',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
                    gap: 'clamp(24px, 4vw, 60px)',
                    alignItems: 'center',
                    position: 'relative'
                }}
            >
                {/* Background decorative blob */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                        x: [0, 20, 0],
                        y: [0, -20, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        top: '20%',
                        right: '10%',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, var(--color-primary-light) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                        opacity: 0.15,
                        zIndex: 0
                    }}
                ></motion.div>

                {/* Left side: Typography */}
                <div style={{ zIndex: 10 }}>
                    <motion.div variants={itemVariants} className="hero-pill" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 16px',
                        background: '#fff',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid #e2e8f0',
                        marginBottom: '24px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#64748b',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }}></div>
                        Enterprise Version 4.0 Live
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="hero-heading"
                        style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                            fontWeight: 800,
                            lineHeight: 1.05,
                            color: '#0f172a',
                            marginBottom: '24px',
                            letterSpacing: '-0.03em',
                            maxWidth: '16ch'
                        }}
                    >
                        AI-Enabled Safety Audits & <span style={{ color: '#3b82f6' }}>Inventory Verification.</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="hero-paragraph"
                        style={{
                            fontSize: '18px',
                            color: '#475569',
                            lineHeight: 1.6,
                            marginBottom: '40px',
                            maxWidth: '520px'
                        }}
                    >
                        Orchestrate complex operations with integrated Drone Maps and AI-assisted inventory comparison. Ensure asset accountability at scale.
                    </motion.p>

                    <motion.div variants={itemVariants} className="hero-buttons" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: '#071221' }}
                            whileTap={{ scale: 0.98 }}
                            className="cta-button primary"
                            style={{
                                padding: '14px 28px',
                                background: '#0f172a',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.2)'
                            }}
                        >
                            Request Demo
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, borderColor: '#cbd5e1' }}
                            whileTap={{ scale: 0.98 }}
                            className="cta-button secondary"
                            style={{
                                padding: '14px 28px',
                                background: '#fff',
                                color: '#0f172a',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polygon points="10 8 16 12 10 16 10 8"></polygon>
                            </svg>
                            View Capabilities
                        </motion.button>
                    </motion.div>
                </div>

                {/* Right side: App UI Map Monitor */}
                <motion.div
                    variants={itemVariants}
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 1, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="hero-card-container"
                    style={{ zIndex: 10 }}
                >
                    <Card
                        padding="32px"
                        borderRadius="24px"
                        style={{ width: '100%', maxWidth: '100%' }}
                        hoverEffect={false}
                    >
                        {/* Header */}
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.1em' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                                ZONE MAP MONITOR
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '6px 12px', borderRadius: '100px' }}
                            >
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                                Live Feed
                            </motion.div>
                        </div>

                        {/* List Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
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
                        </div>

                        {/* Map Image Block */}
                        <div style={{
                            width: '100%',
                            height: '200px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #072267 0%, #0f172a 100%)',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', background: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.05) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.05) 20px)' }}></div>

                            {/* Map Points */}
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                style={{ position: 'absolute', top: '30%', left: '30%', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 15px #10b981' }}
                            ></motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                style={{ position: 'absolute', top: '60%', left: '55%', width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 20px #ef4444' }}
                            ></motion.div>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Inline styles for media queries */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 1200px) {
                    .hero-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 32px !important;
                    }
                }
                @media (max-width: 1024px) {
                    .hero-grid {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                        padding-top: 40px !important;
                        padding-bottom: 60px !important;
                    }
                    .hero-heading {
                        margin-left: auto;
                        margin-right: auto;
                        max-width: 100% !important;
                        font-size: clamp(2.2rem, 8vw, 3.2rem) !important;
                    }
                    .hero-paragraph {
                        margin-left: auto;
                        margin-right: auto;
                        font-size: 16px !important;
                    }
                    .hero-buttons {
                        justify-content: center;
                    }
                    .hero-pill {
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .hero-card-container {
                        max-width: 500px;
                        margin: 40px auto 0;
                    }
                }
                @media (max-width: 640px) {
                    .hero-heading {
                        font-size: 2rem !important;
                        letter-spacing: -0.02em !important;
                    }
                    .hero-buttons {
                        flex-direction: column;
                        width: 100%;
                    }
                    .cta-button {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}} />
        </section>
    );
};

export default Hero;
