import React from 'react';
import Card from '../../components/UI/Card';
import { t } from '../../theme/theme';
import { motion } from 'framer-motion';
import {
    MdOutlineTrendingUp,
    MdOutlineAssignmentLate,
    MdOutlineAutoGraph
} from 'react-icons/md';

// eslint-disable-next-line no-unused-vars
const StatCard = ({ label, value, trend, icon: Icon, color, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
        style={{ flex: 1 }}
    >
        <Card
            padding="24px"
            style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px', 
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid rgba(255,255,255,0.2)`
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${color}15, ${color}05)`,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `inset 0 0 0 1px ${color}10`
                }}>
                    <Icon size={22} />
                </div>
                {trend && (
                    <div style={{ 
                        fontSize: '12px', 
                        fontWeight: 800, 
                        color: t.color.success,
                        background: t.color.successBg,
                        padding: '4px 10px',
                        borderRadius: t.radius.pill
                    }}>
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: t.color.textTertiary, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}</div>
                <div style={{ fontSize: '28px', fontWeight: 950, color: t.color.primaryDark, letterSpacing: '-0.02em' }}>{value}</div>
            </div>
        </Card>
    </motion.div>
);

const Analytics = () => {
    return (
        <section className="analytics-section" style={{
            padding: '120px 24px',
            background: `linear-gradient(to bottom, ${t.color.bg}, ${t.color.bgSecondary})`,
            borderTop: `1px solid ${t.color.borderLight}`,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorative Blob */}
            <div style={{
                position: 'absolute',
                top: '10%',
                right: '-5%',
                width: '500px',
                height: '500px',
                background: `radial-gradient(circle, ${t.color.primaryLight}05 0%, transparent 70%)`,
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)', gap: '80px', alignItems: 'center', position: 'relative', zIndex: 1 }} className="analytics-grid">

                {/* Left Side: Text */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1] }}
                    style={{ display: 'flex', flexDirection: 'column' }}
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
                        REPORTING & COMPLIANCE
                    </div>

                    <h2 style={{
                        fontSize: 'clamp(32px, 5vw, 46px)',
                        fontWeight: 950,
                        color: t.color.primaryDark,
                        marginBottom: '24px',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.1
                    }}>
                        Real-Time Insights for Absolute <span style={{ color: t.color.primary }}>Accountability.</span>
                    </h2>

                    <p style={{
                        fontSize: '18px',
                        color: t.color.textSecondary,
                        lineHeight: 1.6,
                        marginBottom: '40px',
                        maxWidth: '540px',
                        fontWeight: 450
                    }}>
                        Transform raw field data into actionable audit trails. Automatically generate daily, weekly, or monthly compliance reports with AI-verified precision.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            "Automated AI-Risk identification & flagship alerts.",
                            "Tamper-proof audit trails for regulatory submission.",
                            "Historical data comparison for maintenance trends."
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + (idx * 0.1) }}
                                style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', fontSize: '15.5px', color: t.color.text, fontWeight: 550 }}
                            >
                                <div style={{ 
                                    minWidth: '22px', 
                                    height: '22px', 
                                    borderRadius: '50%', 
                                    background: `${t.color.primary}10`, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: t.color.primary,
                                    marginTop: '1px'
                                }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                {item}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Visual Dashboard Snippet */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.21, 1, 0.36, 1] }}
                    style={{ position: 'relative' }}
                >
                    <Card style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid rgba(255, 255, 255, 0.5)`,
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px',
                        boxShadow: '0 25px 50px -12px rgba(7, 34, 103, 0.12)',
                        borderRadius: '24px'
                    }}>
                        {/* Header Snippet */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ fontSize: '18px', fontWeight: 900, color: t.color.primaryDark, letterSpacing: '-0.01em' }}>Compliance Overview</h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: '10px', height: '10px', borderRadius: t.radius.circle, background: t.color.success }}></motion.div>
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} style={{ width: '10px', height: '10px', borderRadius: t.radius.circle, background: t.color.warning }}></motion.div>
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} style={{ width: '10px', height: '10px', borderRadius: t.radius.circle, background: t.color.border }}></motion.div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div style={{ display: 'flex', gap: '20px' }} className="stats-row">
                            <StatCard
                                label="Audit Score"
                                value="98.2%"
                                trend="+2.4%"
                                icon={MdOutlineTrendingUp}
                                color="#10b981"
                                index={0}
                            />
                            <StatCard
                                label="Risk Flags"
                                value="03"
                                icon={MdOutlineAssignmentLate}
                                color="#ef4444"
                                index={1}
                            />
                        </div>

                        {/* Chart Area Stub */}
                        <div style={{
                            height: '180px',
                            background: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: '16px',
                            border: `1px solid ${t.color.borderLight}`,
                            display: 'flex',
                            alignItems: 'flex-end',
                            padding: '20px',
                            gap: '12px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${h}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: 0.6 + (i * 0.05), ease: "easeOut" }}
                                    style={{
                                        flex: 1,
                                        background: i === 7 ? t.color.primary : t.color.primaryLight,
                                        opacity: i === 7 ? 1 : 0.3,
                                        borderRadius: '6px 6px 2px 2px'
                                    }}
                                ></motion.div>
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 700, color: t.color.textSecondary, background: t.color.bg, border: `1px solid ${t.color.border}`, borderRadius: '10px', cursor: 'pointer' }}>History</motion.button>
                            <motion.button whileHover={{ scale: 1.05, backgroundColor: t.color.primaryDark }} whileTap={{ scale: 0.95 }} style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 700, color: t.color.textInverse, background: t.color.primary, border: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: `0 8px 16px -4px ${t.color.primary}30` }}>
                                <MdOutlineAutoGraph /> Generate Report
                            </motion.button>
                        </div>
                    </Card>

                    {/* Decorative Floating Label */}
                    <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                        style={{
                            position: 'absolute',
                            bottom: '-20px',
                            left: '-20px',
                            background: t.color.bg,
                            padding: '14px 24px',
                            borderRadius: '14px',
                            boxShadow: t.shadow.xl,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            zIndex: 10,
                            border: `1px solid ${t.color.borderLight}`
                        }}
                    >
                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: '10px', height: '10px', borderRadius: t.radius.circle, background: t.color.success, boxShadow: `0 0 12px ${t.color.success}` }}></motion.div>
                        <span style={{ fontSize: '14px', fontWeight: 850, color: t.color.primaryDark, letterSpacing: '0.01em' }}>Live Sync Active</span>
                    </motion.div>
                </motion.div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 1024px) {
                    .analytics-grid {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                        gap: 40px !important;
                    }
                    .analytics-grid > div {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .stats-row {
                        flex-direction: column !important;
                    }
                }
            `}} />
        </section>
    );
};

export default Analytics;
