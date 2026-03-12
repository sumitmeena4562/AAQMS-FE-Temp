import React from 'react';
import Card from '../../components/UI/Card';
import { t } from '../../theme/theme';
import {
    MdOutlineTrendingUp,
    MdOutlineAssignmentLate,
    MdOutlineAutoGraph
} from 'react-icons/md';

// eslint-disable-next-line no-unused-vars
const StatCard = ({ label, value, trend, icon: Icon, color }) => (
    <Card
        padding="24px"
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${color}15`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={20} />
            </div>
            {trend && <span style={{ fontSize: '12px', fontWeight: 700, color: t.color.success }}>{trend}</span>}
        </div>
        <div>
            <div style={{ fontSize: '13px', color: t.color.textSecondary, marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: t.color.primaryDark }}>{value}</div>
        </div>
    </Card>
);

const Analytics = () => {
    return (
        <section className="analytics-section" style={{
            padding: '100px 24px',
            background: t.color.bg,
            borderTop: `1px solid ${t.color.borderLight}`
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '60px', alignItems: 'center' }} className="analytics-grid">

                {/* Left Side: Text */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: t.color.primary, letterSpacing: '0.1em', marginBottom: '12px' }}>REPORTING & COMPLIANCE</div>

                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 42px)',
                        fontWeight: 800,
                        color: t.color.primaryDark,
                        marginBottom: '20px',
                        letterSpacing: '-0.02em'
                    }}>
                        Real-Time Insights for Absolute Accountability
                    </h2>

                    <p style={{
                        fontSize: '17px',
                        color: t.color.textSecondary,
                        lineHeight: 1.6,
                        marginBottom: '32px',
                        maxWidth: '520px'
                    }}>
                        Transform raw field data into actionable audit trails. Automatically generate daily, weekly, or monthly compliance reports with AI-verified precision.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            "Automated AI-Risk identification & flagship alerts.",
                            "Tamper-proof audit trails for regulatory submission.",
                            "Historical data comparison for maintenance trends."
                        ].map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: t.color.text, fontWeight: 500 }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: t.radius.circle, background: t.color.primary }}></div>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Visual Dashboard Snippet */}
                <div style={{ position: 'relative' }}>
                    <Card style={{
                        background: t.color.bg,
                        border: `1px solid ${t.color.border}`,
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}>
                        {/* Header Snippet */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, color: t.color.primaryDark }}>Compliance Overview</h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: t.radius.circle, background: t.color.success }}></div>
                                <div style={{ width: '8px', height: '8px', borderRadius: t.radius.circle, background: t.color.warning }}></div>
                                <div style={{ width: '8px', height: '8px', borderRadius: t.radius.circle, background: t.color.border }}></div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div style={{ display: 'flex', gap: '16px' }} className="stats-row">
                            <StatCard
                                label="Audit Score"
                                value="98.2%"
                                trend="+2.4%"
                                icon={MdOutlineTrendingUp}
                                color="#10b981"
                            />
                            <StatCard
                                label="Risk Flags"
                                value="03"
                                icon={MdOutlineAssignmentLate}
                                color="#ef4444"
                            />
                        </div>

                        {/* Chart Area Stub */}
                        <div style={{
                            height: '160px',
                            background: t.color.bg,
                            borderRadius: t.radius.md,
                            border: `1px solid ${t.color.borderLight}`,
                            display: 'flex',
                            alignItems: 'flex-end',
                            padding: '16px',
                            gap: '12px'
                        }}>
                            {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                                <div key={i} style={{
                                    flex: 1,
                                    height: `${h}%`,
                                    background: i === 7 ? t.color.primary : t.color.primaryLight,
                                    opacity: i === 7 ? 1 : 0.3,
                                    borderRadius: '4px'
                                }}></div>
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: t.color.textSecondary, background: t.color.bg, border: `1px solid ${t.color.border}`, borderRadius: t.radius.sm }}>History</button>
                            <button style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: t.color.textInverse, background: t.color.primary, border: 'none', borderRadius: t.radius.sm, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <MdOutlineAutoGraph /> Generate Report
                            </button>
                        </div>
                    </Card>

                    {/* Decorative Floating Label */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-20px',
                        left: '-20px',
                        background: t.color.bg,
                        padding: '12px 20px',
                        borderRadius: t.radius.md,
                        boxShadow: t.shadow.md,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        zIndex: 10
                    }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: t.radius.circle, background: t.color.success, boxShadow: `0 0 10px ${t.color.success}` }}></div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: t.color.primaryDark }}>Live Sync Active</span>
                    </div>
                </div>
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
