import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../Branding/Logo';

const LandingNavbar = ({
    navLinks = [],
    buttons = [],
    sticky = true,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Track scroll for background change
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    const menuVariants = {
        closed: { 
            opacity: 0,
            y: -20,
            transition: { type: 'spring', stiffness: 400, damping: 40 }
        },
        open: { 
            opacity: 1,
            y: 0,
            transition: { 
                type: 'spring', 
                stiffness: 400, 
                damping: 40,
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, x: -20 },
        open: { opacity: 1, x: 0 }
    };

    return (
        <>
            <motion.header 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`
                    ${sticky ? 'sticky' : 'relative'} top-0 left-0 right-0 z-50 px-6 transition-all duration-500
                    ${isScrolled 
                        ? 'h-16 py-2 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]' 
                        : 'h-20 py-4 bg-transparent border-b border-transparent'}
                `}
            >
                <nav className="flex items-center justify-between h-full max-w-7xl mx-auto overflow-visible">
                    {/* Left — Logo */}
                    <div className="flex-1 flex justify-start z-[60]">
                        <motion.div 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            className="cursor-pointer"
                        >
                            <Logo size="md" />
                        </motion.div>
                    </div>

                    {/* Center — Desktop Nav Links */}
                    <div className="hidden lg:flex items-center justify-center gap-10 flex-[2]">
                        {navLinks.map((link) => (
                            <motion.a
                                key={link.label}
                                href={link.href || '#'}
                                onClick={(e) => {
                                    if (link.onClick) {
                                        e.preventDefault();
                                        link.onClick();
                                    }
                                }}
                                whileHover={{ y: -2 }}
                                className="relative text-[13px] font-bold tracking-tight text-slate-500 hover:text-primary transition-colors duration-300 group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
                            </motion.a>
                        ))}
                    </div>

                    {/* Right — Desktop Buttons */}
                    <div className="hidden lg:flex items-center justify-end gap-3 flex-1">
                        {buttons.map((btn) => (
                            <motion.button
                                key={btn.label}
                                onClick={btn.onClick}
                                whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: btn.variant === 'filled' ? '0 10px 20px -5px rgba(var(--color-primary-rgb), 0.3)' : 'none'
                                }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    px-6 py-2.5 text-[12px] font-black uppercase tracking-widest border rounded-xl transition-all duration-300
                                    ${btn.variant === 'filled' 
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                        : 'bg-white/50 backdrop-blur-md border-slate-200 text-slate-900 hover:bg-white/80'}
                                `}
                            >
                                {btn.label}
                            </motion.button>
                        ))}
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="lg:hidden relative z-[60] p-2 bg-white/50 backdrop-blur-md border border-slate-200 rounded-xl text-slate-900 shadow-sm"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className="w-6 h-6 flex flex-col items-center justify-center gap-1.5">
                            <motion.span 
                                animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                                className="w-full h-0.5 bg-current rounded-full" 
                            />
                            <motion.span 
                                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="w-full h-0.5 bg-current rounded-full" 
                            />
                            <motion.span 
                                animate={isMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                                className="w-full h-0.5 bg-current rounded-full" 
                            />
                        </div>
                    </motion.button>
                </nav>
            </motion.header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 z-[55] flex flex-col bg-white/95 backdrop-blur-2xl p-8 pt-28 gap-12 lg:hidden"
                    >
                        <div className="flex flex-col gap-8">
                            <div className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Navigation</div>
                            <div className="flex flex-col gap-6">
                                {navLinks.map((link) => (
                                    <motion.a
                                        key={link.label}
                                        variants={itemVariants}
                                        href={link.href || '#'}
                                        onClick={(e) => {
                                            setIsMenuOpen(false);
                                            if (link.onClick) {
                                                e.preventDefault();
                                                link.onClick();
                                            }
                                        }}
                                        whileHover={{ x: 10 }}
                                        className="text-2xl font-black text-slate-900 flex items-center gap-4 transition-colors hover:text-primary group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.label}
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        <div className="flex flex-col gap-8">
                            <div className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Account</div>
                            <div className="flex flex-col gap-4">
                                {buttons.map((btn) => (
                                    <motion.button
                                        key={btn.label}
                                        variants={itemVariants}
                                        onClick={() => { btn.onClick?.(); setIsMenuOpen(false); }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                                            w-full py-5 text-[14px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all
                                            ${btn.variant === 'filled' 
                                                ? 'bg-primary text-white shadow-primary/20' 
                                                : 'bg-white border border-slate-200 text-slate-900'}
                                        `}
                                    >
                                        {btn.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LandingNavbar;
