import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import {
    MdOutlineFileUpload,
    MdOutlineQrCode2,
    MdOutlineMobileFriendly,
    MdOutlinePsychology,
    MdOutlineFactCheck
} from 'react-icons/md';
import { t } from '../../theme/theme';

const MasterpieceCard = ({ number, title, description, icon: Icon, index }) => {
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -80 : 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: index * 0.1 }}
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: isEven ? 'flex-start' : 'flex-end',
                marginBottom: '80px',
                position: 'relative',
                zIndex: 2
            }}
        >
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => { x.set(0); y.set(0); }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                    width: 'clamp(280px, 35vw, 380px)',
                    padding: '32px',
                    borderRadius: '28px',
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: `
                        0 10px 30px -10px rgba(7, 34, 103, 0.15),
                        0 20px 60px -15px rgba(7, 34, 103, 0.1),
                        inset 0 0 0 1px rgba(255, 255, 255, 0.4)
                    `,
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden'
                }}
            >
                {/* Grain Texture Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.05,
                    pointerEvents: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }} />

                {/* Internal Glow Follower */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(0, 112, 243, 0.1) 0%, transparent 70%)`,
                        borderRadius: '28px',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}
                    className="card-glow"
                />

                <div style={{ transform: 'translateZ(40px)', position: 'relative', zIndex: 1 }}>
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: (index * 0.1) + 0.3 }}
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: `linear-gradient(135deg, ${t.color.primaryLight}, ${t.color.primary})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            marginBottom: '20px',
                            boxShadow: '0 8px 16px rgba(0, 112, 243, 0.25)'
                        }}
                    >
                        <Icon size={28} />
                    </motion.div>
                    
                    <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        fontSize: '100px',
                        fontWeight: 950,
                        color: 'rgba(7, 34, 103, 0.04)',
                        userSelect: 'none',
                        zIndex: -1,
                        lineHeight: 1
                    }}>
                        0{number}
                    </div>

                    <h4 style={{ 
                        fontSize: '22px', 
                        fontWeight: 900, 
                        color: t.color.primaryDark, 
                        marginBottom: '12px',
                        letterSpacing: '-0.02em'
                    }}>
                        {title}
                    </h4>
                    <p style={{ 
                        fontSize: '15px', 
                        lineHeight: 1.6, 
                        color: t.color.textTertiary,
                        fontWeight: 400
                    }}>
                        {description}
                    </p>
                </div>

                <style dangerouslySetInnerHTML={{ __html: `
                    .card-glow {
                        --mouse-x: ${mouseXSpring.get() * 100 + 50}%;
                        --mouse-y: ${mouseYSpring.get() * 100 + 50}%;
                    }
                `}} />
            </motion.div>
        </motion.div>
    );
};

const Workflow = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 100 });

    const steps = [
        { number: 1, title: "Setup & Planning", description: "Coordinator uploads site floor plans and defines critical safety zones.", icon: MdOutlineFileUpload },
        { number: 2, title: "Inventory Marking", description: "Assign unique QR codes to assets and geofence them within mapped zones.", icon: MdOutlineQrCode2 },
        { number: 3, title: "On-Site Audit", description: "Officers scan items and upload photo/video evidence via mobile app.", icon: MdOutlineMobileFriendly },
        { number: 4, title: "AI Detection", description: "System identifies mismatches, missing items, or maintenance delays instantly.", icon: MdOutlinePsychology },
        { number: 5, title: "Review & Report", description: "Admin reviews AI flags and approves final audit reports for compliance.", icon: MdOutlineFactCheck }
    ];

    return (
        <section ref={containerRef} className="workflow-section" style={{
            padding: '120px 24px',
            background: '#ffffff',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Ambient Lighting Leaks */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: `radial-gradient(circle, ${t.color.primaryLight}08 0%, transparent 70%)`,
                filter: 'blur(100px)',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: `radial-gradient(circle, ${t.color.primary}05 0%, transparent 70%)`,
                filter: 'blur(100px)',
                zIndex: 0
            }} />

            {/* Tech Grid Pattern */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `radial-gradient(${t.color.primaryLight}15 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
                opacity: 0.4,
                zIndex: 0
            }} />

            {/* Progress Hub (Sticky Side Nav) */}
            <div style={{
                position: 'fixed',
                right: '40px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 100,
                pointerEvents: 'none'
            }} className="progress-hub">
                {steps.map((_, i) => (
                    <motion.div
                        key={i}
                        style={{
                            width: '4px',
                            height: '40px',
                            background: '#e0e0e0',
                            borderRadius: '2px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        <motion.div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: t.color.primary,
                                scaleY: useTransform(scrollYProgress, [i/steps.length, (i+1)/steps.length], [0, 1]),
                                originY: 0
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '80px' }}
                >
                    <motion.span 
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        style={{ 
                            fontSize: '11px', 
                            fontWeight: 900, 
                            color: t.color.primaryLight, 
                            letterSpacing: '0.3em', 
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '16px'
                        }}
                    >
                        THE PROCESS
                    </motion.span>
                    <h2 style={{
                        fontSize: 'clamp(32px, 6vw, 52px)',
                        fontWeight: 950,
                        color: t.color.primaryDark,
                        letterSpacing: '-0.04em',
                        lineHeight: 1.1,
                        marginBottom: '20px'
                    }}>
                        Efficiency Unleashed
                    </h2>
                </motion.div>

                {/* SVG Snake Path */}
                <div style={{
                    position: 'absolute',
                    top: '200px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    height: 'calc(100% - 300px)',
                    zIndex: 1,
                    pointerEvents: 'none'
                }} className="path-container">
                    <svg width="100%" height="100%" viewBox="0 0 1000 1200" fill="none" preserveAspectRatio="none">
                        <path
                            d="M 250 0 C 250 150 750 150 750 300 C 750 450 250 450 250 600 C 250 750 750 750 750 900 C 750 1050 500 1050 500 1200"
                            stroke="#07226708"
                            strokeWidth="3"
                            strokeDasharray="8 8"
                        />
                        <motion.path
                            d="M 250 0 C 250 150 750 150 750 300 C 750 450 250 450 250 600 C 250 750 750 750 750 900 C 750 1050 500 1050 500 1200"
                            stroke={t.color.primaryLight}
                            strokeWidth="3"
                            style={{ pathLength }}
                            filter="drop-shadow(0 0 6px rgba(0, 112, 243, 0.4))"
                        />
                        
                        {/* Pulsing Nodes on Path */}
                        {[300, 600, 900].map((yPos, i) => (
                            <motion.circle
                                key={i}
                                cx={i % 2 === 0 ? 750 : 250}
                                cy={yPos}
                                r="6"
                                fill={t.color.primaryLight}
                                initial={{ scale: 0 }}
                                whileInView={{ scale: [0, 1.5, 1] }}
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                                style={{ filter: 'drop-shadow(0 0 4px #0070F3)' }}
                            />
                        ))}
                    </svg>
                </div>

                {/* Staggered Cards */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    {steps.map((step, index) => (
                        <MasterpieceCard
                            key={index}
                            {...step}
                            index={index}
                        />
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 1024px) {
                    .path-container, .progress-hub { display: none; }
                }
            `}} />
        </section>
    );
};

export default Workflow;
