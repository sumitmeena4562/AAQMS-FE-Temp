import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';

const CTA = () => {
    return (
        <section id="contact" className="py-16 px-6 bg-[#071121] relative overflow-hidden">
            {/* Complex Multi-layered Background */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_10%_10%,_rgba(var(--color-primary-light-rgb),0.15)_0%,_transparent_40%),_radial-gradient(circle_at_90%_90%,_rgba(var(--color-primary-light-rgb),0.15)_0%,_transparent_40%)]" />

            <motion.div
                animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/5 right-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[80px] z-0"
            />

            <div className="max-w-5xl mx-auto relative z-10">
                <Card 
                    className="bg-white/5 backdrop-blur-3xl border-white/10 py-12 md:py-16 px-6 md:px-12 rounded-[32px] text-center shadow-2xl ring-1 ring-white/10"
                    hoverEffect={false}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1] }}
                    >
                        <h2 className="text-[clamp(1.75rem,5vw,2.5rem)] font-black text-white mb-6 tracking-tighter leading-[1.05]">
                            Ready to Modernize Your <br />
                            <span className="bg-gradient-to-r from-primary-light to-blue-400 bg-clip-text text-transparent">Safety Operations?</span>
                        </h2>
                        
                        <p className="text-base md:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-semibold">
                            Join industry leaders who trust our AI-enabled platform for precision auditing and global inventory accountability.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                            <motion.button 
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(var(--color-primary-light-rgb), 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-5 bg-white text-slate-900 rounded-2xl text-base font-black tracking-tight hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                Get Started Now
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.08)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-5 bg-transparent text-white border border-white/20 rounded-2xl text-base font-black tracking-tight transition-all cursor-pointer"
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
