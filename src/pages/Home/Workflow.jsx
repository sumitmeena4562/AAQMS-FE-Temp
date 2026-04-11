import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import SectionHeader from '../../components/UI/SectionHeader';
import Card from '../../components/UI/Card';
import { WORKFLOW_DATA } from '../../data/landingData';

const LineSegment = ({ scrollYProgress, index, stepsTotal }) => {
    // Each row takes an equal chunk of the container's scroll progress
    const segmentSize = 1 / stepsTotal;
    const start = index * segmentSize;
    const end = (index + 1) * segmentSize;
    
    // Scale the line growth within this row's scroll window
    const scaleY = useTransform(scrollYProgress, [start, end], [0, 1]);
    
    const isFirst = index === 0;
    const isLast = index === stepsTotal - 1;

    return (
        <div className="absolute inset-x-0 top-0 bottom-0 flex justify-center z-0 pointer-events-none">
            {/* Background Track Segment */}
            <div className={`w-[2px] bg-border/20 ${isFirst ? 'top-1/2' : 'top-0'} ${isLast ? 'bottom-1/2' : 'bottom-0'} absolute`} />
            
            {/* Animated Active Segment */}
            <motion.div 
                style={{ 
                    scaleY, 
                    originY: 0,
                    top: isFirst ? '50%' : '0%',
                    bottom: isLast ? '50%' : '0%',
                    left: '50%',
                    marginLeft: '-1px'
                }}
                className="absolute w-[2px] bg-gradient-to-b from-primary via-secondary to-accent shadow-[0_0_15px_var(--color-primary)] opacity-80"
            />
        </div>
    );
};

const MilestoneNode = ({ scrollYProgress, index, stepsTotal }) => {
    const threshold = index / (stepsTotal - 1);
    const opacity = useTransform(scrollYProgress, [threshold - 0.05, threshold], [0, 1]);
    const dotColor = useTransform(scrollYProgress, [threshold - 0.1, threshold], ["var(--color-border)", "var(--color-primary)"]);

    return (
        <div className="relative z-20 flex items-center justify-center w-12 h-12">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="relative flex items-center justify-center"
            >
                <div className="w-[18px] h-[18px] rounded-full bg-surface border-2 border-border flex items-center justify-center shadow-soft relative z-10" />
                <motion.div 
                    style={{ opacity }}
                    className="absolute inset-[-3px] rounded-full bg-primary/10 blur-[2px] z-0"
                />
                <motion.div 
                    style={{ backgroundColor: dotColor }}
                    className="absolute w-2 h-2 rounded-full z-20"
                />

                {/* Horizontal Connectors */}
                <div className={`hidden lg:block absolute top-1/2 -translate-y-1/2 w-16 h-[2px] bg-border/20 ${index % 2 === 0 ? 'right-full' : 'left-full'}`} aria-hidden="true" />
                <div className="lg:hidden absolute top-1/2 -translate-y-1/2 left-full w-8 h-[2px] bg-border/20" aria-hidden="true" />
            </motion.div>
        </div>
    );
};

const WorkflowCard = ({ number, title, description, icon: Icon, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
            className="w-full relative group"
        >
            <Card className="p-5 md:p-6 flex flex-col gap-3 border border-border/60 bg-surface shadow-soft hover:shadow-premium hover:border-primary/20 transition-all duration-700 overflow-hidden">
                <div className="flex items-start gap-4">
                    <div className="shrink-0 relative">
                        <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500">
                            <Icon className="text-xl" aria-hidden="true" />
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1.5 opacity-60">Step 0{number}</div>
                        <h4 className="text-[17px] font-black text-text-title mb-1.5 tracking-tight group-hover:text-primary transition-colors">
                            {title}
                        </h4>
                        <p className="text-[13px] leading-relaxed text-text-muted font-medium opacity-90">
                            {description}
                        </p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

const Workflow = () => {
    const { badge, title, description, steps } = WORKFLOW_DATA;
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    return (
        <section 
            id="workflow" 
            className="relative py-20 sm:py-32 px-6 overflow-hidden bg-surface"
            ref={containerRef}
        >
            {/* Elite Blueprint Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.35]" 
                style={{ 
                    backgroundImage: `radial-gradient(var(--color-primary) 0.5px, transparent 0.5px)`, 
                    backgroundSize: '24px 24px' 
                }} 
                aria-hidden="true"
            />
            
            <div className="container mx-auto px-6 relative z-10">
                <SectionHeader badge={badge} title={title} description={description} />

                <div className="max-w-5xl mx-auto relative mt-20 sm:mt-24">
                    <div className="relative z-10 flex flex-col">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={index} className="grid grid-cols-[auto_1fr] lg:grid-cols-[1fr_auto_1fr] items-center gap-6 lg:gap-12 relative min-h-[160px] lg:min-h-[220px]">
                                    {/* Line Segment Logic (Segmented Continuity) */}
                                    <div className="absolute inset-0 flex lg:justify-center left-[24px] lg:left-0 z-0">
                                        <LineSegment 
                                            scrollYProgress={scrollYProgress} 
                                            index={index} 
                                            stepsTotal={steps.length} 
                                        />
                                    </div>

                                    {/* Column 1: Card (Even) / Spacer (Odd) */}
                                    <div className="hidden lg:block z-10">
                                        {isEven ? <WorkflowCard {...step} index={index} /> : null}
                                    </div>

                                    {/* Column 2: Milestone Dot */}
                                    <div className="flex justify-center z-10">
                                        <MilestoneNode 
                                            scrollYProgress={scrollYProgress}
                                            index={index}
                                            stepsTotal={steps.length}
                                        />
                                    </div>

                                    {/* Column 3: Card (Odd) / Spacer (Even) */}
                                    <div className="w-full z-10">
                                        {!isEven ? (
                                            <WorkflowCard {...step} index={index} />
                                        ) : (
                                            <div className="hidden lg:block" />
                                        )}
                                        <div className="lg:hidden">
                                            {isEven ? <WorkflowCard {...step} index={index} /> : null}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Workflow;
