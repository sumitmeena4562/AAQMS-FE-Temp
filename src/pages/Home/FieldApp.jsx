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

// eslint-disable-next-line no-unused-vars
const FieldFeature = ({ icon: Icon, title, description }) => (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
        <div style={{
            minWidth: '48px',
            height: '48px',
            borderRadius: t.radius.md,
            background: `${t.color.primary}10`,
            color: t.color.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Icon size={24} />
        </div>
        <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: t.color.primaryDark, marginBottom: '8px' }}>{title}</h4>
            <p style={{ fontSize: '14px', lineHeight: 1.5, color: t.color.textSecondary, maxWidth: '380px' }}>{description}</p>
        </div>
    </div>
);

const FieldApp = () => {
    return (
        <section className="field-app-section" style={{
            padding: '100px 24px',
            background: t.color.bg,
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="field-app-grid">

                {/* Left Side: Content */}
                <div style={{ zIndex: 10 }}>
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 42px)',
                        fontWeight: 800,
                        color: t.color.primaryDark,
                        marginBottom: '20px',
                        letterSpacing: '-0.02em'
                    }}>
                        Field Inspections in Your Pocket
                    </h2>
                    <p style={{
                        fontSize: '17px',
                        color: t.color.textSecondary,
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
                        background: t.color.primary,
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
                        background: t.color.primaryDark,
                        borderRadius: '40px',
                        border: `8px solid ${t.color.primaryDark}80`,
                        position: 'relative',
                        zIndex: 1,
                        boxShadow: t.shadow.premium,
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
                        <div style={{ padding: '40px 20px 20px', background: t.color.primaryDark }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <MdMenu color={t.color.bg} size={24} />
                                <span style={{ color: t.color.bg, fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em' }}>SAFETY AI</span>
                                <MdNotificationsNone color={t.color.bg} size={24} />
                            </div>

                            <div style={{ marginBottom: '4px' }}>
                                <span style={{ color: t.color.textTertiary, fontSize: '10px' }}>Current Location</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: t.color.bg, fontSize: '18px', fontWeight: 700 }}>
                                    Warehouse B <MdKeyboardArrowDown />
                                </div>
                            </div>
                        </div>

                        {/* App Content Area */}
                        <div style={{
                            flex: 1,
                            background: t.color.bgSecondary,
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em' }}>TODAY'S TASKS</span>

                            {/* App Task Cards */}
                            <div style={{ background: t.color.bg, padding: '16px', borderRadius: t.radius.md, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: t.shadow.sm }}>
                                <div style={{ width: '40px', height: '40px', backgroundColor: `${t.color.primary}10`, borderRadius: t.radius.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.color.primary }}>
                                    <MdOutlineQrCodeScanner size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: t.color.primaryDark }}>Verify Shelf 4A</div>
                                    <div style={{ fontSize: '11px', color: t.color.textSecondary }}>24 items • Due 2pm</div>
                                </div>
                                <button style={{ background: t.color.primaryDark, color: t.color.textInverse, border: 'none', padding: '6px 14px', borderRadius: t.radius.sm, fontSize: '10px', fontWeight: 600 }}>Start</button>
                            </div>

                            <div style={{ background: t.color.bg, padding: '16px', borderRadius: t.radius.md, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: t.shadow.sm }}>
                                <div style={{ width: '40px', height: '40px', backgroundColor: `${t.color.warning}15`, borderRadius: t.radius.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.color.warning }}>
                                    <MdHistory size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: t.color.primaryDark }}>Hazard Check</div>
                                    <div style={{ fontSize: '11px', color: t.color.textSecondary }}>Zone 3 • Due 4pm</div>
                                </div>
                                <button style={{ background: t.color.bgSecondary, color: t.color.textSecondary, border: 'none', padding: '6px 14px', borderRadius: t.radius.sm, fontSize: '10px', fontWeight: 600 }}>View</button>
                            </div>

                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginTop: '10px' }}>QUICK ACTIONS</span>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ background: t.color.bg, height: '60px', borderRadius: t.radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.color.textTertiary, boxShadow: t.shadow.sm }}>
                                    <MdOutlineQrCodeScanner size={24} />
                                </div>
                                <div style={{ background: t.color.bg, height: '60px', borderRadius: t.radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.color.textTertiary, boxShadow: t.shadow.sm }}>
                                    <MdOutlinePhotoCamera size={24} />
                                </div>
                            </div>
                        </div>

                        {/* App Bottom Nav */}
                        <div style={{
                            height: '60px',
                            background: t.color.bg,
                            borderTop: `1px solid ${t.color.borderLight}`,
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            padding: '0 10px',
                            position: 'relative'
                        }}>
                            <MdHome size={22} color={t.color.textTertiary} />
                            <MdMap size={22} color={t.color.textTertiary} />
                            <div style={{
                                width: '44px',
                                height: '44px',
                                background: t.color.primaryDark,
                                borderRadius: t.radius.circle,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '-30px',
                                border: `4px solid ${t.color.bg}`,
                                boxShadow: t.shadow.md
                            }}>
                                <MdAdd size={24} color={t.color.bg} />
                            </div>
                            <MdHistory size={22} color={t.color.textTertiary} />
                            <MdSettings size={22} color={t.color.textTertiary} />
                        </div>
                    </div>

                    {/* Floating Decorative Elements */}
                    <div className="floating-badge" style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '150px',
                        background: t.color.bg,
                        padding: '12px',
                        borderRadius: t.radius.md,
                        boxShadow: t.shadow.md,
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <div style={{ width: '32px', height: '32px', background: `${t.color.success}10`, borderRadius: t.radius.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.color.success }}>
                            <MdOutlineVerified size={18} />
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: t.color.primaryDark }}>Audit Sync</div>
                            <div style={{ fontSize: '10px', color: t.color.textSecondary }}>100% Complete</div>
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
