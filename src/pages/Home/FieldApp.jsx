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

const FieldFeature = ({ icon: Icon, title, description }) => (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
        <div style={{
            minWidth: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#eff6ff',
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Icon size={24} />
        </div>
        <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '8px' }}>{title}</h4>
            <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--color-text-secondary)', maxWidth: '380px' }}>{description}</p>
        </div>
    </div>
);

const FieldApp = () => {
    return (
        <section className="field-app-section" style={{
            padding: '100px 24px',
            background: '#fff',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="field-app-grid">

                {/* Left Side: Content */}
                <div style={{ zIndex: 10 }}>
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 42px)',
                        fontWeight: 800,
                        color: 'var(--color-primary-dark)',
                        marginBottom: '20px',
                        letterSpacing: '-0.02em'
                    }}>
                        Field Inspections in Your Pocket
                    </h2>
                    <p style={{
                        fontSize: '17px',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: '48px',
                        maxWidth: '500px'
                    }}>
                        Equip your workforce with a powerful, intuitive mobile interface designed for the realities of the field.
                    </p>

                    <div className="features-list">
                        <FieldFeature
                            icon={MdOutlineAssignmentInd}
                            title="Personal ID Login"
                            description="Secure, individual access ensures accountability for every action taken."
                        />
                        <FieldFeature
                            icon={MdOutlineQrCodeScanner}
                            title="QR Scan Capability"
                            description="Lightning-fast scanning to verify asset presence and pull up specs instantly."
                        />
                        <FieldFeature
                            icon={MdOutlinePhotoCamera}
                            title="Photo/Video Evidence"
                            description="Capture visual proof of compliance or damage directly within the audit workflow."
                        />
                        <FieldFeature
                            icon={MdOutlineWifiOff}
                            title="Low Connectivity Mode"
                            description="Complete audits offline; data syncs automatically when connection is restored."
                        />
                    </div>
                </div>

                {/* Right Side: Mobile Mockup */}
                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                    {/* Shadow Decoration */}
                    <div style={{
                        position: 'absolute',
                        width: '80%',
                        height: '80%',
                        background: 'var(--color-primary)',
                        filter: 'blur(100px)',
                        opacity: 0.1,
                        top: '10%',
                        left: '10%',
                        zIndex: 0
                    }}></div>

                    {/* Phone Frame */}
                    <div style={{
                        width: '300px',
                        height: '600px',
                        background: '#071221',
                        borderRadius: '40px',
                        border: '8px solid #1a2433',
                        position: 'relative',
                        zIndex: 1,
                        boxShadow: '0 50px 100px -20px rgba(7, 18, 33, 0.5)',
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
                        <div style={{ padding: '40px 20px 20px', background: '#071221' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <MdMenu color="#fff" size={24} />
                                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em' }}>SAFETY AI</span>
                                <MdNotificationsNone color="#fff" size={24} />
                            </div>

                            <div style={{ marginBottom: '4px' }}>
                                <span style={{ color: '#94a3b8', fontSize: '10px' }}>Current Location</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fff', fontSize: '18px', fontWeight: 700 }}>
                                    Warehouse B <MdKeyboardArrowDown />
                                </div>
                            </div>
                        </div>

                        {/* App Content Area */}
                        <div style={{
                            flex: 1,
                            background: '#f8fafc',
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em' }}>TODAY'S TASKS</span>

                            {/* App Task Cards */}
                            <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <div style={{ width: '40px', height: '40px', backgroundColor: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                    <MdOutlineQrCodeScanner size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Verify Shelf 4A</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>24 items • Due 2pm</div>
                                </div>
                                <button style={{ background: '#071221', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '10px', fontWeight: 600 }}>Start</button>
                            </div>

                            <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <div style={{ width: '40px', height: '40px', backgroundColor: '#fff7ed', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                                    <MdHistory size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Hazard Check</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>Zone 3 • Due 4pm</div>
                                </div>
                                <button style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '10px', fontWeight: 600 }}>View</button>
                            </div>

                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginTop: '10px' }}>QUICK ACTIONS</span>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ background: '#fff', height: '60px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                    <MdOutlineQrCodeScanner size={24} />
                                </div>
                                <div style={{ background: '#fff', height: '60px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                    <MdOutlinePhotoCamera size={24} />
                                </div>
                            </div>
                        </div>

                        {/* App Bottom Nav */}
                        <div style={{
                            height: '60px',
                            background: '#fff',
                            borderTop: '1px solid #f1f5f9',
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            padding: '0 10px',
                            position: 'relative'
                        }}>
                            <MdHome size={22} color="#94a3b8" />
                            <MdMap size={22} color="#94a3b8" />
                            <div style={{
                                width: '44px',
                                height: '44px',
                                background: '#071221',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '-30px',
                                border: '4px solid #fff',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                            }}>
                                <MdAdd size={24} color="#fff" />
                            </div>
                            <MdHistory size={22} color="#94a3b8" />
                            <MdSettings size={22} color="#94a3b8" />
                        </div>
                    </div>

                    {/* Floating Decorative Elements */}
                    <div className="floating-badge" style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '150px',
                        background: '#fff',
                        padding: '12px',
                        borderRadius: '16px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <div style={{ width: '32px', height: '32px', background: '#ecfdf5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                            <MdOutlineVerified size={18} />
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b' }}>Audit Sync</div>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>100% Complete</div>
                        </div>
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
