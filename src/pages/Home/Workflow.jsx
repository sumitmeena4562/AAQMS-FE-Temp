import React from 'react';
import {
    MdOutlineFileUpload,
    MdOutlineQrCode2,
    MdOutlineMobileFriendly,
    MdOutlinePsychology,
    MdOutlineFactCheck
} from 'react-icons/md';
import { t } from '../../theme/theme';

// eslint-disable-next-line no-unused-vars
const WorkflowStep = ({ number, title, description, icon: Icon, isLast }) => (
    <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* Connection Line */}
        {!isLast && (
            <div className="workflow-line" style={{
                position: 'absolute',
                top: '32px',
                left: 'calc(50% + 40px)',
                width: 'calc(100% - 80px)',
                height: '2px',
                background: `linear-gradient(to right, ${t.color.primaryLight}, ${t.color.border})`,
                zIndex: 0
            }}></div>
        )}

        {/* Icon & Number Circle */}
        <div style={{
            width: '64px',
            height: '64px',
            borderRadius: t.radius.circle,
            background: t.color.bg,
            border: `2px solid ${t.color.primary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: t.color.primary,
            marginBottom: '20px',
            position: 'relative',
            zIndex: 1,
            boxShadow: t.shadow.md
        }}>
            <Icon size={28} />
            <div style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '24px',
                height: '24px',
                borderRadius: t.radius.circle,
                background: t.color.primary,
                color: t.color.textInverse,
                fontSize: '12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${t.color.bg}`
            }}>
                {number}
            </div>
        </div>

        <h4 style={{ fontSize: '16px', fontWeight: 800, color: t.color.primaryDark, marginBottom: '10px' }}>{title}</h4>
        <p style={{ fontSize: '13px', lineHeight: 1.5, color: t.color.textSecondary, maxWidth: '200px' }}>{description}</p>
    </div>
);

const Workflow = () => {
    const steps = [
        {
            number: 1,
            title: "Setup & Planning",
            description: "Coordinator uploads site floor plans and defines critical safety zones.",
            icon: MdOutlineFileUpload
        },
        {
            number: 2,
            title: "Inventory Marking",
            description: "Assign unique QR codes to assets and geofence them within mapped zones.",
            icon: MdOutlineQrCode2
        },
        {
            number: 3,
            title: "On-Site Audit",
            description: "Officers scan items and upload photo/video evidence via mobile app.",
            icon: MdOutlineMobileFriendly
        },
        {
            number: 4,
            title: "AI Detection",
            description: "System identifies mismatches, missing items, or maintenance delays instantly.",
            icon: MdOutlinePsychology
        },
        {
            number: 5,
            title: "Review & Report",
            description: "Admin reviews AI flags and approves final audit reports for compliance.",
            icon: MdOutlineFactCheck
        }
    ];

    return (
        <section className="workflow-section" style={{
            padding: '100px 24px',
            background: t.color.bg,
            borderTop: `1px solid ${t.color.borderLight}`
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: t.color.primary, letterSpacing: '0.1em', marginBottom: '12px' }}>OPERATIONAL FLOW</div>
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 42px)',
                        fontWeight: 800,
                        color: t.color.primaryDark,
                        marginBottom: '20px',
                        letterSpacing: '-0.02em'
                    }}>
                        Efficiency from Plan to Action
                    </h2>
                    <p style={{
                        fontSize: '17px',
                        color: t.color.textSecondary,
                        lineHeight: 1.6,
                        maxWidth: '650px',
                        margin: '0 auto'
                    }}>
                        A structured, 5-step digital lifecycle ensuring no safety asset goes unverified.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="workflow-grid" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '20px',
                    position: 'relative'
                }}>
                    {steps.map((step, index) => (
                        <div key={index} style={{ flex: 1, display: 'flex' }}>
                            <WorkflowStep
                                {...step}
                                isLast={index === steps.length - 1}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 1024px) {
                    .workflow-grid {
                        flex-direction: column !important;
                        gap: 60px !important;
                    }
                    .workflow-line {
                        display: none !important;
                    }
                }
            `}} />
        </section>
    );
};

export default Workflow;
