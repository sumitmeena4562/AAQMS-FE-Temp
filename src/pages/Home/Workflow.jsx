import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Section from '../../components/UI/Section';
import SectionHeader from '../../components/UI/SectionHeader';
import Card from '../../components/UI/Card';
import {
    MdOutlineFileUpload,
    MdOutlineQrCode2,
    MdOutlineMobileFriendly,
    MdOutlinePsychology,
    MdOutlineFactCheck
} from 'react-icons/md';

const MilestoneNode = ({ scrollYProgress, index, stepsTotal }) => {
    const threshold = index / (stepsTotal - 1);
    
    const opacity = useTransform(scrollYProgress, [threshold - 0.05, threshold], [0, 1]);
    const dotColor = useTransform(scrollYProgress, [threshold - 0.1, threshold], ["#E2E8F0", "#072267"]);

    return (
        <div className="absolute left-[30px] lg:left-1/2 ml-[-9px] lg:ml-[-9px] top-6 z-20">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="relative flex items-center justify-center"
            >
                <div className="w-4.5 h-4.5 rounded-full bg-white border-2 border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center shadow-lg relative z-10" />
                <motion.div 
                    style={{ opacity }}
                    className="absolute inset-[-3px] rounded-full bg-primary/10 blur-[2px] z-0"
                />
                <motion.div 
                    style={{ backgroundColor: dotColor }}
                    className="absolute w-1.5 h-1.5 rounded-full z-20"
                />
            </motion.div>
        </div>
    );
};

const WorkflowCard = ({ number, title, description, icon: Icon, index }) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
            className={`w-full flex ${isEven ? 'justify-start lg:pr-8' : 'justify-end lg:pl-8'} mb-6 relative z-10`}
        >
            <div className={`w-full max-w-[380px] relative group`}>
                <Card
                    className="p-4 md:p-5 flex flex-col gap-3 border border-slate-100 bg-white shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-primary/20 transition-all duration-700 overflow-hidden"
                >
                    <div className="flex items-start gap-4">
                        <div className="shrink-0 relative">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/10 transition-all duration-500">
                                <Icon className="text-xl" />
                            </div>
                            <div className={`absolute top-1/2 -translate-y-1/2 w-6 h-[2.5px] bg-slate-100 group-hover:bg-primary/10 transition-colors hidden lg:block ${isEven ? 'left-full ml-2' : 'right-full mr-2'}`} />
                        </div>

                        <div>
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Step 0{number}</div>
                            <h4 className="text-base font-bold text-slate-900 mb-1.5 tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                                {title}
                            </h4>
                            <p className="text-[12.5px] leading-relaxed text-slate-500 font-medium opacity-90 line-clamp-2">
                                {description}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

const Workflow = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const steps = [
        { number: 1, title: "Site Mapping", description: "Upload your site maps and mark all safety zones.", icon: MdOutlineFileUpload },
        { number: 2, title: "Smart Tagging", description: "Put secure QR codes on your items for easy tracking.", icon: MdOutlineQrCode2 },
        { number: 3, title: "Digital Audit", description: "Scan items on-site and sync data to the cloud instantly.", icon: MdOutlineMobileFriendly },
        { number: 4, title: "Instant Alerts", description: "Get notified immediately about missing items or safety issues.", icon: MdOutlinePsychology },
        { number: 5, title: "Smart Reports", description: "Generate clear audit reports and history in just one click.", icon: MdOutlineFactCheck }
    ];

    return (
        <section 
            id="workflow" 
            className="relative py-16 sm:py-20 px-6 overflow-hidden bg-[#f8faff]"
            ref={containerRef}
        >
            {/* Elite Blueprint Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.4]" 
                style={{ 
                    backgroundImage: `radial-gradient(#072267 0.5px, transparent 0.5px)`, 
                    backgroundSize: '24px 24px' 
                }} 
            />
            
            {/* Soft Ambient Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <SectionHeader
                    badge="Operations"
                    title={<>The Continuity <br className="hidden sm:block" /> Pipeline</>}
                    description="Standardized protocol ensures data integrity across your entire site operations."
                />

                <div className="max-w-4xl mx-auto relative mt-16">
                    {/* The Precision Axis */}
                    <div className="absolute left-[30px] lg:left-1/2 top-4 bottom-4 w-[2.5px] lg:-translate-x-1/2 z-0">
                        <div className="absolute inset-0 bg-slate-200/40 rounded-full" />
                        <motion.div 
                            style={{ scaleY, originY: 0 }}
                            className="absolute inset-0 bg-gradient-to-b from-primary via-blue-500 to-sky-400 rounded-full shadow-[0_0_15px_rgba(7,34,103,0.3)]"
                        />
                    </div>

                    <div className="relative z-10 space-y-2 lg:space-y-0">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                <MilestoneNode 
                                    scrollYProgress={scrollYProgress}
                                    index={index}
                                    stepsTotal={steps.length}
                                />
                                <WorkflowCard 
                                    {...step}
                                    index={index}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Workflow;
