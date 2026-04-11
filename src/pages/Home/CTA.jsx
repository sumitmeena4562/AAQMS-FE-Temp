import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button';
import { CTA_DATA } from '../../data/landingData';
import SectionWrapper from '../../components/Layout/SectionWrapper';

const CTA = () => {
    const { badge, title, description, ctaButton } = CTA_DATA;

    return (
        <SectionWrapper 
            id="contact" 
            backgroundProps={{ showScanner: false, gridOpacity: 0.1 }}
            className="pt-12 pb-6 sm:pt-24 sm:pb-8 border-t border-border/40"
        >
            <div className="max-w-4xl mx-auto relative z-10">
                <div 
                    className="bg-surface border border-border/60 py-10 px-6 sm:py-16 sm:px-16 rounded-[32px] text-center shadow-premium overflow-hidden relative"
                >
                    {/* Decorative Arcs — Theme Synchronized */}
                    <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-56 h-56 border-[10px] border-primary/5 rounded-full pointer-events-none opacity-40 hidden md:block" aria-hidden="true" />
                    <div className="absolute top-1/2 -right-28 -translate-y-1/2 w-72 h-72 border-[16px] border-primary/5 rounded-full pointer-events-none opacity-25 hidden lg:block" aria-hidden="true" />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        {/* Mini Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] font-black tracking-widest text-primary bg-primary/5 border border-primary/10 rounded-full uppercase">
                            <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                            {badge}
                        </div>

                        <div className="space-y-4 sm:space-y-6 max-w-2xl w-full">
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-title tracking-tight md:tracking-tighter leading-[1.1]">
                                {title.main} <br className="hidden sm:block" />
                                <span className="text-primary italic font-black">{title.highlight}</span>
                            </h2>
                            
                            <p className="text-text-muted text-sm sm:text-lg font-medium leading-relaxed max-w-[550px] mx-auto opacity-80">
                                {description}
                            </p>
                        </div>

                        <div className="pt-10 sm:pt-12">
                            <Link to="/login" className="inline-block transition-transform active:scale-95">
                                <Button 
                                    variant="primary" 
                                    size="lg" 
                                    aria-label={`${ctaButton} to the platform`}
                                    className="px-10 sm:px-14 rounded-2xl shadow-xl shadow-primary/20 group h-14 sm:h-16 text-sm font-black transition-all"
                                >
                                    {ctaButton}
                                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M5 12h14m-7-7 7 7-7 7" />
                                    </svg>
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default CTA;
