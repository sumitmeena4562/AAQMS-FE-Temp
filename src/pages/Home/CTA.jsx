import { t } from '../../theme/theme';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';

const CTA = () => {
    return (
        <section className="cta-section" style={{
            padding: '120px 24px',
            background: t.color.primaryDark,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Complex Multi-layered Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at 10% 10%, ${t.color.primaryLight}15 0%, transparent 40%), radial-gradient(circle at 90% 90%, ${t.color.primaryLight}15 0%, transparent 40%)`,
                zIndex: 0
            }}></div>

            <motion.div
                animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    top: '20%',
                    right: '10%',
                    width: '500px',
                    height: '500px',
                    background: `radial-gradient(circle, ${t.color.primaryLight}10 0%, transparent 70%)`,
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    zIndex: 0
                }}
            ></motion.div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <Card style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: 'clamp(48px, 8vw, 80px) 24px',
                    borderRadius: '40px',
                    textAlign: 'center',
                    boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(32px, 6vw, 56px)',
                            fontWeight: 950,
                            color: '#fff',
                            marginBottom: '24px',
                            letterSpacing: '-0.04em',
                            lineHeight: 1
                        }}>
                            Ready to Modernize Your <br />
                            <span style={{ 
                                background: `linear-gradient(to right, ${t.color.primaryLight}, #60a5fa)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>Safety Operations?</span>
                        </h2>
                        
                        <p style={{
                            fontSize: 'clamp(17px, 2.5vw, 20px)',
                            color: 'rgba(255,255,255,0.7)',
                            marginBottom: '48px',
                            lineHeight: 1.6,
                            maxWidth: '700px',
                            margin: '0 auto 48px',
                            fontWeight: 450
                        }}>
                            Join industry leaders who trust our AI-enabled platform for precision auditing and global inventory accountability.
                        </p>

                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <motion.button 
                                whileHover={{ scale: 1.05, boxShadow: `0 20px 40px -10px ${t.color.primaryLight}40` }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '18px 40px',
                                    background: '#fff',
                                    color: t.color.primaryDark,
                                    border: 'none',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    fontWeight: 850,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    letterSpacing: '-0.01em'
                                }}
                            >
                                Get Started Now
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.08)' }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '18px 40px',
                                    background: 'transparent',
                                    color: '#fff',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    fontWeight: 850,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    letterSpacing: '-0.01em'
                                }}
                            >
                                Talk to an Expert
                            </motion.button>
                        </div>
                    </motion.div>
                </Card>
            </div>
        </section>
    );
};

export default CTA;
