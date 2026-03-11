import React from 'react';
import Card from '../../components/UI/Card';
import {
    MdOutlineLayers,
    MdOutlineLibraryAddCheck,
    MdOutlineFilterCenterFocus
} from 'react-icons/md';
import { t } from '../../theme/theme';

const SitePlanning = () => {
    return (
        <section className="site-planning-section" style={{
            padding: '100px 24px',
            background: t.color.bg,
            borderTop: `1px solid ${t.color.borderLight}`
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'center' }} className="planning-grid">

                {/* Left Side: Floor Plan Visual */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: '-40px',
                        left: '-40px',
                        width: '200px',
                        height: '200px',
                        background: t.color.primary,
                        opacity: 0.05,
                        borderRadius: t.radius.circle,
                        zIndex: 0
                    }}></div>

                    <Card style={{
                        background: t.color.bg,
                        padding: '12px',
                        borderRadius: t.radius.lg,
                        position: 'relative',
                        zIndex: 1,
                        overflow: 'hidden'
                    }}>
                        {/* Floor Plan Mockup */}
                        <div style={{
                            width: '100%',
                            height: '400px',
                            background: t.color.bgSecondary,
                            borderRadius: t.radius.md,
                            position: 'relative',
                            border: `1px dashed ${t.color.border}`,
                            backgroundImage: `radial-gradient(circle at 10px 10px, ${t.color.border} 1px, transparent 0)`,
                            backgroundSize: '30px 30px'
                        }}>
                            {/* Zones */}
                            <div style={{ position: 'absolute', top: '15%', left: '15%', width: '30%', height: '35%', background: `${t.color.primary}15`, border: `2px solid ${t.color.primary}40`, borderRadius: t.radius.sm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: t.color.primary }}>ZONE 101</span>
                            </div>
                            <div style={{ position: 'absolute', top: '60%', left: '10%', width: '40%', height: '25%', background: `${t.color.success}15`, border: `2px solid ${t.color.success}40`, borderRadius: t.radius.sm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: t.color.success }}>ZONE 102</span>
                            </div>
                            <div style={{ position: 'absolute', top: '20%', left: '55%', width: '35%', height: '60%', background: `${t.color.error}05`, border: `2px dashed ${t.color.error}30`, borderRadius: t.radius.sm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: t.color.error }}>RESTRICTED ZONE</span>
                            </div>

                            {/* Map Markers */}
                            <div style={{ position: 'absolute', top: '25%', left: '25%', width: '12px', height: '12px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)' }}></div>
                            <div style={{ position: 'absolute', top: '70%', left: '30%', width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)' }}></div>
                            <div style={{ position: 'absolute', top: '45%', left: '75%', width: '16px', height: '16px', background: '#ef4444', borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 0 12px rgba(239, 68, 68, 0.5)' }}></div>
                        </div>

                        {/* Control Overlay */}
                        <div style={{ position: 'absolute', bottom: '24px', right: '24px', display: 'flex', gap: '10px' }}>
                            <div style={{ background: t.color.bg, padding: '8px', borderRadius: t.radius.sm, boxShadow: t.shadow.sm, color: t.color.primary }}><MdOutlineLayers size={20} /></div>
                            <div style={{ background: t.color.bg, padding: '8px', borderRadius: t.radius.sm, boxShadow: t.shadow.sm, color: t.color.primary }}><MdOutlineFilterCenterFocus size={20} /></div>
                        </div>
                    </Card>
                </div>

                {/* Right Side: Text */}
                <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: t.color.primary, letterSpacing: '0.1em', marginBottom: '12px' }}>SITE DIGITAL TWIN</div>
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 42px)',
                        fontWeight: 800,
                        color: t.color.primaryDark,
                        marginBottom: '20px',
                        letterSpacing: '-0.02em'
                    }}>
                        Visual Foundation for Precision Audits
                    </h2>
                    <p style={{
                        fontSize: '17px',
                        color: t.color.textSecondary,
                        lineHeight: 1.6,
                        marginBottom: '40px',
                        maxWidth: '500px'
                    }}>
                        Upload architectural floor plans and layer them with interactive audit zones. Geofence high-risk assets and manage inventory with geographical context.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ color: t.color.primary, marginTop: '4px' }}><MdOutlineLayers size={24} /></div>
                            <div>
                                <h5 style={{ fontSize: '15px', fontWeight: 700, color: t.color.primaryDark, marginBottom: '4px' }}>Multi-Layer Mapping</h5>
                                <p style={{ fontSize: '13px', color: t.color.textSecondary }}>Toggle between structural plans, zone heatmaps, and live asset locations.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ color: t.color.primary, marginTop: '4px' }}><MdOutlineLibraryAddCheck size={24} /></div>
                            <div>
                                <h5 style={{ fontSize: '15px', fontWeight: 700, color: t.color.primaryDark, marginBottom: '4px' }}>Zone-Specific Compliance</h5>
                                <p style={{ fontSize: '13px', color: t.color.textSecondary }}>Assign unique safety regulations and scan intervals to specific site areas.</p>
                            </div>
                        </div>
                    </div>
                </div>
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
