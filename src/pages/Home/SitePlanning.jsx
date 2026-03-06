import React from 'react';
import Card from '../../components/UI/Card';
import {
    MdOutlineLayers,
    MdOutlineLibraryAddCheck,
    MdOutlineFilterCenterFocus
} from 'react-icons/md';

const SitePlanning = () => {
    return (
        <section className="site-planning-section" style={{
            padding: '100px 24px',
            background: 'var(--color-bg-primary)',
            borderTop: '1px solid var(--color-border-light)'
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
                        background: 'var(--color-primary)',
                        opacity: 0.05,
                        borderRadius: '50%',
                        zIndex: 0
                    }}></div>

                    <Card style={{
                        background: '#fff',
                        padding: '12px',
                        borderRadius: '24px',
                        position: 'relative',
                        zIndex: 1,
                        overflow: 'hidden'
                    }}>
                        {/* Floor Plan Mockup */}
                        <div style={{
                            width: '100%',
                            height: '400px',
                            background: '#f1f5f9',
                            borderRadius: '16px',
                            position: 'relative',
                            border: '1px dashed var(--color-border-dark)',
                            backgroundImage: 'radial-gradient(circle at 10px 10px, #e2e8f0 1px, transparent 0)',
                            backgroundSize: '30px 30px'
                        }}>
                            {/* Zones */}
                            <div style={{ position: 'absolute', top: '15%', left: '15%', width: '30%', height: '35%', background: 'rgba(59, 130, 246, 0.1)', border: '2px solid rgba(59, 130, 246, 0.4)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: '#2563eb' }}>ZONE 101</span>
                            </div>
                            <div style={{ position: 'absolute', top: '60%', left: '10%', width: '40%', height: '25%', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid rgba(16, 185, 129, 0.4)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669' }}>ZONE 102</span>
                            </div>
                            <div style={{ position: 'absolute', top: '20%', left: '55%', width: '35%', height: '60%', background: 'rgba(239, 68, 68, 0.05)', border: '2px dashed rgba(239, 68, 68, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: '#dc2626' }}>RESTRICTED ZONE</span>
                            </div>

                            {/* Map Markers */}
                            <div style={{ position: 'absolute', top: '25%', left: '25%', width: '12px', height: '12px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)' }}></div>
                            <div style={{ position: 'absolute', top: '70%', left: '30%', width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)' }}></div>
                            <div style={{ position: 'absolute', top: '45%', left: '75%', width: '16px', height: '16px', background: '#ef4444', borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 0 12px rgba(239, 68, 68, 0.5)' }}></div>
                        </div>

                        {/* Control Overlay */}
                        <div style={{ position: 'absolute', bottom: '24px', right: '24px', display: 'flex', gap: '10px' }}>
                            <div style={{ background: '#fff', padding: '8px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: 'var(--color-primary)' }}><MdOutlineLayers size={20} /></div>
                            <div style={{ background: '#fff', padding: '8px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: 'var(--color-primary)' }}><MdOutlineFilterCenterFocus size={20} /></div>
                        </div>
                    </Card>
                </div>

                {/* Right Side: Text */}
                <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.1em', marginBottom: '12px' }}>SITE DIGITAL TWIN</div>
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 42px)',
                        fontWeight: 800,
                        color: 'var(--color-primary-dark)',
                        marginBottom: '20px',
                        letterSpacing: '-0.02em'
                    }}>
                        Visual Foundation for Precision Audits
                    </h2>
                    <p style={{
                        fontSize: '17px',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: '40px',
                        maxWidth: '500px'
                    }}>
                        Upload architectural floor plans and layer them with interactive audit zones. Geofence high-risk assets and manage inventory with geographical context.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ color: 'var(--color-primary)', marginTop: '4px' }}><MdOutlineLayers size={24} /></div>
                            <div>
                                <h5 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '4px' }}>Multi-Layer Mapping</h5>
                                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Toggle between structural plans, zone heatmaps, and live asset locations.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ color: 'var(--color-primary)', marginTop: '4px' }}><MdOutlineLibraryAddCheck size={24} /></div>
                            <div>
                                <h5 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '4px' }}>Zone-Specific Compliance</h5>
                                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Assign unique safety regulations and scan intervals to specific site areas.</p>
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
