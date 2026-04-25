import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '../components/Branding/Logo';

const AuthLayout = ({ children }) => {
    return (
        <div className="flex h-[100dvh] w-full bg-base relative overflow-hidden font-sans selection:bg-primary/20">
            {/* --- Elite Background System --- */}
            <div className="absolute inset-0 z-0">
                {/* Mesh Gradient Base */}
                <div className="absolute inset-0 bg-base opacity-80" />
                
                {/* Animated Mesh Blobs */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        x: [0, 30, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[120px]"
                />
                
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        x: [0, -40, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] bg-blue-400/5 rounded-full blur-[140px]"
                />

                {/* Subtle Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" 
                     style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
                />
            </div>

            {/* --- Left Side: Enterprise Sidebar (Hidden on Mobile) --- */}
            <div 
                className="hidden lg:flex flex-[1.5] bg-title flex-col justify-start relative overflow-hidden z-10 min-w-[550px]"
                style={{ 
                    clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {/* Digital Blueprint Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                     style={{ 
                         backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
                         backgroundSize: '40px 40px' 
                     }} 
                />
                {/* Side Content Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-title via-title to-primary/20 opacity-100" />
                
                {/* Angled Cut Decoration */}
                <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
                
                {/* Top: Logo - Properly Aligned */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1] }}
                    className="absolute top-0 left-0 h-24 flex items-center px-12 xl:px-16 z-20"
                >
                    <Link to="/">
                        <Logo size="lg" inverse />
                    </Link>
                </motion.div>


                {/* Main: Unified Content Flow */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 1, 0.36, 1] }}
                    className="relative z-10 px-12 xl:px-16 pt-36 pb-8 w-full block flex-shrink-0"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-black tracking-[0.2em] text-blue-200 uppercase mb-2 shadow-xl">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 animate-pulse" />
                        Enterprise Governance
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] max-w-[500px]">
                        <div className="text-white mb-1">Structured Safety.</div>
                        <div className="text-blue-300">Intelligent Monitoring.</div>
                    </h1>

                    <p className="text-base text-white/70 leading-relaxed font-medium mb-5 w-[450px] block">
                        Seamlessly manage environmental compliance and asset audits with our next-gen predictive engine.
                    </p>

                    {/* Featured List to fill space */}
                    <div className="flex flex-col gap-4 mb-6 max-w-[400px]">
                        {[
                            'Real-time spatial visualization',
                            'Predictive safety protocols',
                            '100% compliance integrity'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-5 group">
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                                </div>
                                <p className="text-sm text-white/70 font-bold tracking-tight">{item}</p>
                            </div>
                        ))}
                    </div>

                    {/* Footer Stats / Features for Sidebar */}
                    <div className="mt-10 flex gap-8">
                        <div>
                            <div className="text-2xl font-black text-white leading-none">99.9%</div>
                            <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Uptime SLA</div>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div>
                            <div className="text-2xl font-black text-white leading-none">256-bit</div>
                            <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">AES Encryption</div>
                        </div>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-[20%] right-[10%] w-80 h-80 rounded-full border border-white/5 z-0" />
                <div className="absolute top-[25%] right-[15%] w-60 h-60 rounded-full border border-white/[0.03] z-0" />
            </div>

            {/* --- Right Side: Auth Form --- */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12 relative z-20 overflow-hidden">
                {/* Mobile Logo Only */}
                <div className="absolute top-6 left-6 sm:top-8 sm:left-8 lg:hidden">
                    <Link to="/">
                        <Logo size="md" />
                    </Link>
                </div>

                <div className="w-full max-w-[440px] mt-12 lg:mt-0 relative flex flex-col">
                    {children}
                    <div className="text-center mt-8 opacity-40">
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            Enterprise Portal &bull; Restricted Access
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
