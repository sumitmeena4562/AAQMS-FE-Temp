import React from 'react';
import Card from '../../components/UI/Card';
import {
    MdOutlineLayers,
    MdOutlineLibraryAddCheck,
    MdOutlineFilterCenterFocus
} from 'react-icons/md';
import { t } from '../../theme/theme';
import { motion } from 'framer-motion';

const SitePlanning = () => {
    return (
        <section className="site-planning-section" style={{
            padding: '120px 24px',
            background: t.color.bg,
            borderTop: `1px solid ${t.color.borderLight}`
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: '80px', alignItems: 'center' }} className="planning-grid">

                {/* Left Side: Floor Plan Visual */}
                <motion.div 
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.21, 1, 0.36, 1] }}
                    style={{ position: 'relative' }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '-60px',
                        left: '-60px',
                        width: '300px',
                        height: '300px',
                        background: `radial-gradient(circle, ${t.color.primary}10 0%, transparent 70%)`,
                        borderRadius: t.radius.circle,
                        zIndex: 0,
                        filter: 'blur(40px)'
                    }}></div>

                    <Card style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(16px)',
                        padding: '16px',
                        borderRadius: '28px',
                        position: 'relative',
                        zIndex: 1,
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 30px 60px -12px rgba(7, 34, 103, 0.15)'
                    }}>
                        {/* Floor Plan Mockup */}
                        <div style={{
                            width: '100%',
                            height: '420px',
                            background: t.color.bgSecondary,
                            borderRadius: '20px',
                            position: 'relative',
                            border: `1px dashed ${t.color.border}`,
                            backgroundImage: `radial-gradient(circle at 10px 10px, ${t.color.border} 1px, transparent 0)`,
                            backgroundSize: '24px 24px',
                            overflow: 'hidden'
                        }}>
                            {/* Zones with micro-interactions */}
                            <motion.div 
                                whileHover={{ scale: 1.02, backgroundColor: `${t.color.primary}25` }}
                                style={{ position: 'absolute', top: '15%', left: '15%', width: '30%', height: '35%', background: `${t.color.primary}15`, border: `2.5px solid ${t.color.primary}40`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help' }}
                            >
                                <span style={{ fontSize: '11px', fontWeight: 900, color: t.color.primary, letterSpacing: '0.05em' }}>ZONE 101</span>
                            </motion.div>
                            
                            <motion.div 
                                whileHover={{ scale: 1.02, backgroundColor: `${t.color.success}25` }}
                                style={{ position: 'absolute', top: '60%', left: '10%', width: '40%', height: '25%', background: `${t.color.success}15`, border: `2.5px solid ${t.color.success}40`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help' }}
                            >
                                <span style={{ fontSize: '11px', fontWeight: 900, color: t.color.success, letterSpacing: '0.05em' }}>ZONE 102</span>
                            </motion.div>

                            <motion.div 
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                style={{ position: 'absolute', top: '20%', left: '55%', width: '35%', height: '60%', background: `${t.color.danger}05`, border: `2.5px dashed ${t.color.danger}25`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <span style={{ fontSize: '11px', fontWeight: 950, color: t.color.danger, opacity: 0.6, letterSpacing: '0.1em' }}>RESTRICTED</span>
                            </motion.div>

                            {/* Map Markers with pulsing animation */}
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], boxShadow: ['0 0 10px rgba(59, 130, 246, 0.4)', '0 0 20px rgba(59, 130, 246, 0.6)', '0 0 10px rgba(59, 130, 246, 0.4)'] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{ position: 'absolute', top: '25%', left: '25%', width: '14px', height: '14px', background: '#3b82f6', borderRadius: '50%', border: '2.5px solid #fff' }}
                            ></motion.div>
                            
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], boxShadow: ['0 0 10px rgba(16, 185, 129, 0.4)', '0 0 20px rgba(16, 185, 129, 0.6)', '0 0 10px rgba(16, 185, 129, 0.4)'] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                style={{ position: 'absolute', top: '70%', left: '30%', width: '14px', height: '14px', background: '#10b981', borderRadius: '50%', border: '2.5px solid #fff' }}
                            ></motion.div>
                            
                            <motion.div 
                                animate={{ scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                style={{ position: 'absolute', top: '45%', left: '75%', width: '18px', height: '18px', background: '#ef4444', borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)' }}
                            ></motion.div>
                        </div>

                        {/* Control Overlay */}
                        <div style={{ position: 'absolute', bottom: '32px', right: '32px', display: 'flex', gap: '12px' }}>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ background: t.color.bg, padding: '10px', borderRadius: '12px', boxShadow: t.shadow.md, color: t.color.primary, cursor: 'pointer' }}><MdOutlineLayers size={22} /></motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ background: t.color.bg, padding: '10px', borderRadius: '12px', boxShadow: t.shadow.md, color: t.color.primary, cursor: 'pointer' }}><MdOutlineFilterCenterFocus size={22} /></motion.div>
                        </div>
                    </Card>
                </motion.div>

                {/* Right Side: Text */}
                <motion.div 
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.21, 1, 0.36, 1] }}
                >
                    <div style={{ 
                        fontSize: '11px', 
                        fontWeight: 900, 
                        color: t.color.primary, 
                        letterSpacing: '0.2em', 
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{ width: '32px', height: '1.5px', background: t.color.primary, opacity: 0.2 }}></div>
                        SITE DIGITAL TWIN
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(32px, 5vw, 46px)',
                        fontWeight: 950,
                        color: t.color.primaryDark,
                        marginBottom: '24px',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.1
                    }}>
                        Visual Foundation for <span style={{ color: t.color.primary }}>Precision Audits.</span>
                    </h2>
                    <p style={{
                        fontSize: '18px',
                        color: t.color.textSecondary,
                        lineHeight: 1.6,
                        marginBottom: '48px',
                        maxWidth: '540px',
                        fontWeight: 450
                    }}>
                        Upload architectural floor plans and layer them with interactive audit zones. Geofence high-risk assets and manage inventory with geographical context.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
                        {[
                            { icon: MdOutlineLayers, title: "Multi-Layer Mapping", desc: "Toggle between structural plans, zone heatmaps, and live asset locations." },
                            { icon: MdOutlineLibraryAddCheck, title: "Zone-Specific Compliance", desc: "Assign unique safety regulations and scan intervals to specific site areas." }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 + (idx * 0.2) }}
                                style={{ display: 'flex', gap: '20px' }}
                            >
                                <div style={{ 
                                    minWidth: '48px', 
                                    height: '48px', 
                                    borderRadius: '14px', 
                                    background: `${t.color.primary}10`, 
                                    color: t.color.primary, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    boxShadow: `inset 0 0 0 1px ${t.color.primary}10`
                                }}>
                                    <item.icon size={26} />
                                </div>
                                <div>
                                    <h5 style={{ fontSize: '17px', fontWeight: 850, color: t.color.primaryDark, marginBottom: '6px', letterSpacing: '-0.01em' }}>{item.title}</h5>
                                    <p style={{ fontSize: '14.5px', color: t.color.textTertiary, lineHeight: 1.5, fontWeight: 450 }}>{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 1024px) {
                    .planning-grid {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                        gap: 40px !important;
                    }
                    .planning-grid > div:first-child {
                        order: 2;
                    }
                    .planning-grid > div:last-child {
                        order: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                }
            `}} />
        </section>
    );
};

export default SitePlanning;
