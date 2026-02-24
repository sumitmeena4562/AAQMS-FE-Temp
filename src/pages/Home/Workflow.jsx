import React from 'react';
import Card from '../../components/ui/Card';
import {
    MdOutlineFileUpload,
    MdOutlineQrCode2,
    MdOutlineMobileFriendly,
    MdOutlinePsychology,
    MdOutlineFactCheck
} from 'react-icons/md';

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
                background: 'linear-gradient(to right, var(--color-primary-light), var(--color-border))',
                zIndex: 0
            }}></div>
        )}

        {/* Icon & Number Circle */}
        <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fff',
            border: '2px solid var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 8px 16px rgba(7, 34, 103, 0.1)'
        }}>
            <Icon size={28} />
            <div style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--color-primary)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff'
            }}>
                {number}
            </div>
        </div>

        <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '10px' }}>{title}</h4>
        <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--color-text-secondary)', maxWidth: '200px' }}>{description}</p>
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
            background: 'var(--color-bg-primary)',
            borderTop: '1px solid var(--color-border-light)'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.1em', marginBottom: '12px' }}>OPERATIONAL FLOW</div>
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 42px)',
                        fontWeight: 800,
                        color: 'var(--color-primary-dark)',
                        marginBottom: '20px',
                        letterSpacing: '-0.02em'
                    }}>
                        Efficiency from Plan to Action
                    </h2>
                    <p style={{
                        fontSize: '17px',
                        color: 'var(--color-text-secondary)',
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
                        <WorkflowStep
                            key={index}
                            {...step}
                            isLast={index === steps.length - 1}
                        />
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
