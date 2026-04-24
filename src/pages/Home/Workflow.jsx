import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import SectionHeader from '../../components/UI/SectionHeader';
import Card from '../../components/UI/Card';
import { WORKFLOW_DATA } from '../../data/landingData';
import SectionWrapper from '../../components/Layout/SectionWrapper';

// Removed LineSegment component in favor of a single master line for perfect continuity

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
    const stepsRef = useRef(null); // Ref for the actual steps container
    
    // Target the steps block for precise scroll tracking
    const { scrollYProgress } = useScroll({
        target: stepsRef,
        offset: ["start center", "end center"]
    });

    const springProgress = useSpring(scrollYProgress, { 
        stiffness: 100, 
        damping: 30, 
        restDelta: 0.001 
    });

    return (
        <SectionWrapper 
            ref={containerRef}
        >
            <div className="container mx-auto px-6 relative z-10">
                <SectionHeader badge={badge} title={title} description={description} />

                <div ref={stepsRef} className="max-w-5xl mx-auto relative mt-20 sm:mt-24">
                    {/* SINGLE CONTINUOUS PIPELINE LINE - Locked between first and last dots */}
                    <div className="absolute lg:left-1/2 left-[24px] top-[80px] bottom-[80px] lg:top-[110px] lg:bottom-[110px] w-[2px] -translate-x-1/2 z-0">
                        {/* Static Track */}
                        <div className="absolute inset-0 bg-border/20" />
                        
                        {/* Animated Active Line */}
                        <motion.div
                            style={{ 
                                scaleY: springProgress,
                                originY: 0
                            }}
                            className="absolute inset-0 bg-gradient-to-b from-primary via-secondary to-accent shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)] opacity-80"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={index} className="grid grid-cols-[auto_1fr] lg:grid-cols-[1fr_auto_1fr] items-center gap-6 lg:gap-12 relative min-h-[160px] lg:min-h-[220px]">
                                    {/* Column 1: Card (Even) / Spacer (Odd) */}
                                    <div className="hidden lg:block z-10">
                                        {isEven ? <WorkflowCard {...step} index={index} /> : null}
                                    </div>

                                    {/* Column 2: Milestone Dot */}
                                    <div className="flex justify-center z-10">
                                        <MilestoneNode 
                                            scrollYProgress={springProgress}
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
        </SectionWrapper>
    );
};

export default Workflow;
