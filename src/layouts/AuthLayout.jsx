import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../components/Branding/Logo';

const AuthLayout = ({ children }) => {
    return (
        <div className="flex h-[100dvh] w-full bg-slate-50 relative overflow-hidden font-sans selection:bg-primary/20">
            {/* --- Elite Background System --- */}
            <div className="absolute inset-0 z-0">
                {/* Mesh Gradient Base */}
                <div className="absolute inset-0 bg-[#f8fafc] opacity-80" />
                
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
                className="hidden lg:flex flex-1.2 bg-slate-900 p-12 lg:p-16 flex-col justify-between relative overflow-hidden z-10"
                style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}
            >
                {/* Side Content Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-primary/20 opacity-100" />
                
                {/* Angled Cut Decoration */}
                <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />

                {/* Top: Logo */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <Logo size="lg" inverse />
                </motion.div>

                {/* Bottom: Text Content */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 1, 0.36, 1] }}
                    className="relative z-10 max-w-xl pr-8"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-black tracking-[0.2em] text-blue-200 uppercase mb-8 shadow-xl">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 animate-pulse" />
                        Enterprise Governance
                    </div>

                    <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-black text-white leading-[1.05] tracking-tighter mb-6">
                        Structured Safety.<br />
                        <span className="bg-gradient-to-r from-blue-300 to-indigo-200 bg-clip-text text-transparent">
                            Intelligent Monitoring.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 leading-relaxed max-w-md font-medium">
                        Seamlessly manage environmental compliance and asset audits with our next-gen predictive engine.
                    </p>

                    {/* Footer Stats / Features for Sidebar */}
                    <div className="mt-12 flex gap-8">
                        <div>
                            <div className="text-2xl font-black text-white leading-none">99.9%</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Uptime SLA</div>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div>
                            <div className="text-2xl font-black text-white leading-none">256-bit</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">AES Encryption</div>
                        </div>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-[20%] right-[10%] w-80 h-80 rounded-full border border-white/5 z-0" />
                <div className="absolute top-[25%] right-[15%] w-60 h-60 rounded-full border border-white/[0.03] z-0" />
            </div>

            {/* --- Right Side: Auth Form --- */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12 relative z-20 overflow-y-auto">
                {/* Mobile Logo Only */}
                <div className="absolute top-6 left-6 sm:top-8 sm:left-8 lg:hidden">
                    <Logo size="md" />
                </div>

                <div className="w-full max-w-[440px] mt-12 lg:mt-0">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
