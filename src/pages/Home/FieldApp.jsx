import React from 'react';
import {
    MdOutlineAssignmentInd,
    MdOutlineQrCodeScanner,
    MdOutlinePhotoCamera,
    MdOutlineWifiOff,
    MdMenu,
    MdNotificationsNone,
    MdAdd,
    MdHome,
    MdMap,
    MdHistory,
    MdSettings,
    MdKeyboardArrowDown,
    MdOutlineVerified
} from 'react-icons/md';
import { t } from '../../theme/theme';
import { motion } from 'framer-motion';

const FieldFeature = ({ icon: Icon, title, description, index }) => (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
        style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}
    >
        <div style={{
            minWidth: '56px',
            height: '56px',
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${t.color.primary}15, ${t.color.primary}05)`,
            color: t.color.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `inset 0 0 0 1px ${t.color.primary}10`,
            position: 'relative'
        }}>
            <Icon size={26} />
        </div>
        <div>
            <h4 style={{ fontSize: '18px', fontWeight: 850, color: t.color.primaryDark, marginBottom: '8px', letterSpacing: '-0.01em' }}>{title}</h4>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: t.color.textSecondary, maxWidth: '400px', fontWeight: 450 }}>{description}</p>
        </div>
    </motion.div>
);

const FieldApp = () => {
    return (
        <section className="field-app-section" style={{
            padding: '120px 24px',
            background: `linear-gradient(to bottom, ${t.color.bgSecondary}, ${t.color.bg})`,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorative Mesh/Gradient */}
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: `radial-gradient(circle, ${t.color.primary}05 0%, transparent 70%)`,
                filter: 'blur(100px)',
                zIndex: 0
            }} />

            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: '80px', alignItems: 'center', position: 'relative', zIndex: 1 }} className="field-app-grid">

                {/* Left Side: Content */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1] }}
                    style={{ zIndex: 10 }}
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
                        Next-Gen Inspection
                    </div>

                    <h2 style={{
                        fontSize: 'clamp(32px, 5vw, 48px)',
                        fontWeight: 950,
                        color: t.color.primaryDark,
                        marginBottom: '24px',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.1
                    }}>
                        Field Inspections in Your <span style={{ color: t.color.primary }}>Pocket.</span>
                    </h2>

                    <p style={{
                        fontSize: '18px',
                        color: t.color.textSecondary,
                        lineHeight: 1.6,
                        marginBottom: '48px',
                        maxWidth: '540px',
                        fontWeight: 450
                    }}>
                        Equip your workforce with a powerful, intuitive mobile interface designed for the rigorous demands of real-world environment audits.
                    </p>

                    <div className="features-list">
                        {[
                            { icon: MdOutlineAssignmentInd, title: "Personal ID Login", description: "Secure, individual access ensures accountability for every action taken." },
                            { icon: MdOutlineQrCodeScanner, title: "QR Scan Capability", description: "Lightning-fast scanning to verify asset presence and pull up specs instantly." },
                            { icon: MdOutlinePhotoCamera, title: "Photo/Video Evidence", description: "Capture visual proof of compliance or damage directly within the audit workflow." },
                            { icon: MdOutlineWifiOff, title: "Low Connectivity Mode", description: "Complete audits offline; data syncs automatically when connection is restored." }
                        ].map((feat, i) => (
                            <FieldFeature key={i} {...feat} index={i} />
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Mobile Mockup */}
                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                    {/* Shadow Decoration */}
                    <div style={{
                        position: 'absolute',
                        width: '80%',
                        height: '80%',
                        background: t.color.primary,
                        filter: 'blur(100px)',
                        opacity: 0.1,
                        top: '10%',
                        left: '10%',
                        zIndex: 0
                    }}></div>

                {/* Right Side: Mobile Mockup */}
                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                    {/* Shadow Decoration */}
                    <div style={{
                        position: 'absolute',
                        width: '80%',
                        height: '80%',
                        background: t.color.primary,
                        filter: 'blur(100px)',
                        opacity: 0.1,
                        top: '10%',
                        left: '10%',
                        zIndex: 0
                    }}></div>

                    {/* Phone Frame */}
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.21, 1, 0.36, 1] }}
                        style={{
                            width: '320px',
                            height: '640px',
                            background: t.color.primaryDark,
                            borderRadius: '48px',
                            padding: '12px',
                            position: 'relative',
                            zIndex: 1,
                            boxShadow: '0 50px 100px -20px rgba(7, 34, 103, 0.3), 0 30px 60px -30px rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Internal Bezel */}
                        <div style={{
                            flex: 1,
                            background: '#1a2433',
                            borderRadius: '38px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {/* Phone Notch */}
                            <div style={{
                                width: '120px',
                                height: '24px',
                                background: '#1a2433',
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                borderBottomLeftRadius: '16px',
                                borderBottomRightRadius: '16px',
                                zIndex: 10
                            }}></div>

                            {/* App Header */}
                            <div style={{ padding: '40px 20px 24px', background: 'linear-gradient(to bottom, #111827, #1a2433)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <MdMenu color="#94a3b8" size={24} />
                                    <span style={{ color: '#fff', fontSize: '11px', fontWeight: 900, letterSpacing: '0.2em' }}>ASSET AI</span>
                                    <MdNotificationsNone color="#94a3b8" size={24} />
                                </div>

                                <div style={{ marginBottom: '4px' }}>
                                    <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, letterSpacing: '0.02em' }}>CURRENT SITE</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '18px', fontWeight: 800 }}>
                                        Warehouse B <MdKeyboardArrowDown color={t.color.primaryLight} />
                                    </div>
                                </div>
                            </div>

                            {/* App Content Area */}
                            <div style={{
                                flex: 1,
                                background: '#f8fafc',
                                borderTopLeftRadius: '28px',
                                borderTopRightRadius: '28px',
                                padding: '24px 20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '18px',
                                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)'
                            }}>
                                <span style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', letterSpacing: '0.1em' }}>ASSIGNED AUDITS</span>

                                {/* App Task Cards */}
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    style={{ background: '#fff', padding: '18px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}
                                >
                                    <div style={{ width: '44px', height: '44px', backgroundColor: `${t.color.primary}10`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.color.primary }}>
                                        <MdOutlineQrCodeScanner size={22} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 850, color: '#1e293b' }}>Shelf 4A Audit</div>
                                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>24 items • High Priority</div>
                                    </div>
                                    <div style={{ background: t.color.primaryDark, color: '#fff', padding: '6px 14px', borderRadius: '10px', fontSize: '10px', fontWeight: 800 }}>GO</div>
                                </motion.div>

                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    style={{ background: '#fff', padding: '18px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}
                                >
                                    <div style={{ width: '44px', height: '44px', backgroundColor: '#fff7ed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                                        <MdHistory size={22} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 850, color: '#1e293b' }}>Zone 3 Safety</div>
                                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Hazard Check • 4pm</div>
                                    </div>
                                    <div style={{ background: '#f1f5f9', color: '#64748b', padding: '6px 14px', borderRadius: '10px', fontSize: '10px', fontWeight: 800 }}>LATER</div>
                                </motion.div>

                                <span style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', letterSpacing: '0.1em', marginTop: '10px' }}>QUICK UTILITIES</span>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <motion.div whileHover={{ scale: 1.05 }} style={{ background: '#fff', height: '70px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748b', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                                        <MdOutlineQrCodeScanner size={24} color={t.color.primary} />
                                        <span style={{ fontSize: '10px', fontWeight: 800 }}>SCAN</span>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} style={{ background: '#fff', height: '70px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748b', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                                        <MdOutlinePhotoCamera size={24} color={t.color.primary} />
                                        <span style={{ fontSize: '10px', fontWeight: 800 }}>CAMERA</span>
                                    </motion.div>
                                </div>
                            </div>

                            {/* App Bottom Nav */}
                            <div style={{
                                height: '70px',
                                background: '#fff',
                                borderTop: '1px solid #f1f5f9',
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                padding: '0 10px 10px',
                                position: 'relative'
                            }}>
                                <MdHome size={24} color={t.color.primary} />
                                <MdMap size={24} color="#94a3b8" />
                                <div style={{
                                    width: '52px',
                                    height: '52px',
                                    background: t.color.primary,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: '-40px',
                                    border: '6px solid #fff',
                                    boxShadow: '0 10px 20px rgba(7, 34, 103, 0.2)'
                                }}>
                                    <MdAdd size={28} color="#fff" />
                                </div>
                                <MdHistory size={24} color="#94a3b8" />
                                <MdSettings size={24} color="#94a3b8" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Decorative Elements */}
                    <motion.div 
                        initial={{ x: 30, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="floating-badge" 
                        style={{
                            position: 'absolute',
                            right: '-30px',
                            top: '160px',
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(20px)',
                            padding: '16px 20px',
                            borderRadius: '20px',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            border: '1px solid rgba(255, 255, 255, 0.5)'
                        }}
                    >
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            style={{ 
                                width: '36px', 
                                height: '36px', 
                                background: `linear-gradient(135deg, ${t.color.success}, #059669)`, 
                                borderRadius: '12px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                color: '#fff',
                                boxShadow: `0 8px 16px ${t.color.success}40`
                            }}
                        >
                            <MdOutlineVerified size={20} />
                        </motion.div>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 900, color: t.color.primaryDark }}>Audit Live</div>
                            <div style={{ fontSize: '11px', color: t.color.success, fontWeight: 700 }}>100% Synced</div>
                        </div>
                    </motion.div>
                </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 1024px) {
                    .field-app-grid {
                        grid-template-columns: 1fr !important;
                        gap: 60px !important;
                        text-align: center;
                    }
                    .features-list {
                        display: inline-block;
                        text-align: left;
                        margin: 0 auto;
                    }
                    .section-subtitle {
                        margin: 0 auto !important;
                    }
                }
            `}} />
        </section>
    );
};

export default FieldApp;
