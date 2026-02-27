import React from 'react';
import Card from '../../components/ui/Card';
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
            {trend && <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-success)' }}>{trend}</span>}
        </div>
        <div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{value}</div>
        </div>
    </Card>
);

const Analytics = () => {
    return (
        <section className="analytics-section" style={{
            padding: '100px 24px',
            background: '#fff',
            borderTop: '1px solid var(--color-border-light)'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '60px', alignItems: 'center' }} className="analytics-grid">

                {/* Left Side: Text */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-info)', letterSpacing: '0.1em', marginBottom: '12px' }}>REPORTING & COMPLIANCE</div>

                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 42px)',
                        fontWeight: 800,
                        color: 'var(--color-primary-dark)',
                        marginBottom: '20px',
                        letterSpacing: '-0.02em'
                    }}>
                        Real-Time Insights for Absolute Accountability
                    </h2>

                    <p style={{
                        fontSize: '17px',
                        color: 'var(--color-text-secondary)',
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
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-info)' }}></div>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Visual Dashboard Snippet */}
                <div style={{ position: 'relative' }}>
                    <Card style={{
                        background: 'var(--color-bg-primary)',
                        border: '1px solid var(--color-border)',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}>
                        {/* Header Snippet */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-dark)' }}>Compliance Overview</h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)' }}></div>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-warning)' }}></div>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-border-dark)' }}></div>
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
                            background: '#fff',
                            borderRadius: '16px',
                            border: '1px solid var(--color-border-light)',
                            display: 'flex',
                            alignItems: 'flex-end',
                            padding: '16px',
                            gap: '12px'
                        }}>
                            {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                                <div key={i} style={{
                                    flex: 1,
                                    height: `${h}%`,
                                    background: i === 7 ? 'var(--color-primary)' : 'var(--color-primary-light)',
                                    opacity: i === 7 ? 1 : 0.3,
                                    borderRadius: '4px'
                                }}></div>
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px' }}>History</button>
                            <button style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: '#fff', background: 'var(--color-primary)', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <MdOutlineAutoGraph /> Generate Report
                            </button>
                        </div>
                    </Card>

                    {/* Decorative Floating Label */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-20px',
                        left: '-20px',
                        background: '#fff',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        zIndex: 10
                    }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 10px var(--color-success)' }}></div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary-dark)' }}>Live Sync Active</span>
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
