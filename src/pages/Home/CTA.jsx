import React from 'react';

const CTA = () => {
    return (
        <section className="cta-section" style={{
            padding: '100px 24px',
            background: 'var(--color-primary-dark)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative Background Elements */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '400px',
                height: '400px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '50%',
                zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-5%',
                width: '300px',
                height: '300px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '50%',
                zIndex: 0
            }}></div>

            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <h2 style={{
                    fontSize: 'clamp(28px, 5vw, 42px)',
                    fontWeight: 800,
                    color: '#fff',
                    marginBottom: '24px',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2
                }}>
                    Ready to Modernize Your <span style={{ color: 'var(--color-info)' }}>Safety Operations?</span>
                </h2>
                <p style={{
                    fontSize: '18px',
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '40px',
                    lineHeight: 1.6
                }}>
                    Join industry leaders who trust our AI-enabled platform for precision auditing and inventory accountability.
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button style={{
                        padding: '14px 32px',
                        background: '#fff',
                        color: 'var(--color-primary-dark)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                    }}>
                        Get Started Now
                    </button>
                    <button style={{
                        padding: '14px 32px',
                        background: 'transparent',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}>
                        Talk to an Expert
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CTA;
