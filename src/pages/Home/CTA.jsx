import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Section from '../../components/UI/Section';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';

const CTA = () => {
    return (
        <Section id="contact" className="bg-[#f8faff] py-12 sm:py-20" background="transparent" withGlow={false}>
            <div className="max-w-4xl mx-auto relative z-10 px-6">
                <Card 
                    className="bg-white border-slate-200/60 py-10 px-6 sm:py-14 sm:px-16 rounded-[24px] text-center shadow-xl overflow-hidden relative"
                    hoverEffect={false}
                >
                    {/* Decorative Arcs — Optimized for Production */}
                    <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-56 h-56 border-[10px] border-primary/5 rounded-full pointer-events-none opacity-40 hidden md:block" />
                    <div className="absolute top-1/2 -right-28 -translate-y-1/2 w-72 h-72 border-[16px] border-primary/5 rounded-full pointer-events-none opacity-25 hidden lg:block" />
                    
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        {/* Status Badge */}
                        <Badge color="primary" variant="light" size="pill" className="mb-5 sm:mb-6 border-primary/10">
                            <span className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                Quickly test — SaaS Analytics
                            </span>
                        </Badge>

                        <div className="space-y-4 sm:space-y-5 max-w-2xl w-full">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                                Start your <br className="sm:hidden" />
                                <span className="text-primary italic"> free trial today</span>
                            </h2>
                            
                            <p className="text-slate-600 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-[500px] mx-auto opacity-90">
                                Unlock the full potential of your site data with our comprehensive SaaS analytics platform.
                            </p>
                        </div>

                        <div className="pt-8 sm:pt-10">
                            <Link to="/login" className="inline-block transform transition-active active:scale-95">
                                <Button 
                                    variant="primary" 
                                    size="md" 
                                    aria-label="Start your free trial now"
                                    className="min-w-[200px] sm:min-w-[240px] rounded-xl shadow-xl shadow-primary/20 h-12 sm:h-14 text-sm font-black hover:bg-primary/95 transition-all"
                                >
                                    Get Started Now
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </Card>
            </div>
        </Section>
    );
};

export default CTA;
