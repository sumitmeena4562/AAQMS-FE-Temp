import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import {
    MdOutlineFileUpload,
    MdOutlineQrCode2,
    MdOutlineMobileFriendly,
    MdOutlinePsychology,
    MdOutlineFactCheck
} from 'react-icons/md';

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
            className={`w-full flex ${isEven ? 'justify-start' : 'justify-end'} mb-20 relative z-10`}
        >
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => { x.set(0); y.set(0); }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
                className="w-full max-w-[380px] p-8 rounded-[32px] bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl transition-shadow hover:shadow-primary/10 relative cursor-pointer overflow-hidden group ring-1 ring-slate-100/50"
            >
                {/* Grain Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grain-y.vercel.app/noise.svg')]" />

                {/* Internal Glow Follower */}
                <motion.div
                    style={{
                        background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(var(--color-primary-rgb), 0.1) 0%, transparent 70%)`,
                    }}
                    className="absolute inset-0 rounded-[32px] z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                <div style={{ transform: 'translateZ(50px)' }} className="relative z-10">
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12, delay: (index * 0.1) + 0.3 }}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/25"
                    >
                        <Icon className="text-3xl" />
                    </motion.div>
                    
                    <div className="absolute -top-3 -right-3 text-8xl font-black text-primary/[0.03] select-none z-[-1] leading-none transition-transform group-hover:scale-110 duration-700">
                        0{number}
                    </div>

                    <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {title}
                    </h4>
                    <p className="text-[15px] leading-relaxed text-slate-500 font-medium">
                        {description}
                    </p>
                </div>

                <style dangerouslySetInnerHTML={{ __html: `
                    .group:hover {
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
        <section id="workflow" ref={containerRef} className="py-16 px-6 bg-white relative overflow-hidden border-t border-slate-100">
            {/* Ambient Lighting Leaks */}
            <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-primary-light/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Tech Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.4] z-0" 
                 style={{ backgroundImage: 'radial-gradient(rgba(var(--color-primary-light-rgb), 0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
            />

            {/* Progress Hub (Sticky Side Nav) */}
            <div className="fixed right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-[100] pointer-events-none hidden xl:flex">
                {steps.map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-1 h-10 bg-slate-100 rounded-full overflow-hidden relative"
                    >
                        <motion.div
                            style={{
                                scaleY: useTransform(scrollYProgress, [i/steps.length, (i+1)/steps.length], [0, 1]),
                                originY: 0
                            }}
                            className="absolute inset-0 bg-primary"
                        />
                    </motion.div>
                ))}
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <motion.span 
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="text-[10px] font-black text-primary-light tracking-[0.3em] uppercase block mb-4"
                    >
                        The Process
                    </motion.span>
                    <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-black text-slate-900 tracking-tighter leading-none mb-6">
                        Efficiency Unleashed
                    </h2>
                </motion.div>

                {/* SVG Snake Path */}
                <div className="absolute top-48 left-1/2 -translate-x-1/2 w-full h-[calc(100%-300px)] z-0 pointer-events-none hidden lg:block">
                    <svg width="100%" height="100%" viewBox="0 0 1000 1200" fill="none" preserveAspectRatio="none">
                        <path
                            d="M 250 0 C 250 150 750 150 750 300 C 750 450 250 450 250 600 C 250 750 750 750 750 900 C 750 1050 500 1050 500 1200"
                            stroke="rgba(var(--color-primary-rgb), 0.03)"
                            strokeWidth="3"
                            strokeDasharray="8 8"
                        />
                        <motion.path
                            d="M 250 0 C 250 150 750 150 750 300 C 750 450 250 450 250 600 C 250 750 750 750 750 900 C 750 1050 500 1050 500 1200"
                            stroke="currentColor"
                            strokeWidth="3"
                            style={{ pathLength }}
                            className="text-primary-light filter drop-shadow-[0_0_8px_rgba(var(--color-primary-light-rgb),0.5)]"
                        />
                        
                        {/* Pulsing Nodes on Path */}
                        {[300, 600, 900].map((yPos, i) => (
                            <motion.circle
                                key={i}
                                cx={i % 2 === 0 ? 750 : 250}
                                cy={yPos}
                                r="6"
                                className="fill-primary-light shadow-[0_0_10px_rgba(var(--color-primary-light-rgb),1)]"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: [0, 1.5, 1] }}
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                            />
                        ))}
                    </svg>
                </div>

                {/* Staggered Cards */}
                <div className="relative z-10">
                    {steps.map((step, index) => (
                        <MasterpieceCard
                            key={index}
                            {...step}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Workflow;
