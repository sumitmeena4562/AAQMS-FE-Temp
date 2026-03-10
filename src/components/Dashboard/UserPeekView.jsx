import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiMapPin, FiBriefcase, FiCalendar, FiShield, FiClock } from 'react-icons/fi';
import Button from '../UI/Button';
import UserAvatar from '../UI/UserAvatar';

const UserPeekView = ({ isOpen, onClose, user }) => {
    if (!user) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[99]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-[450px] bg-white shadow-2xl z-[100] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-border flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-[18px] font-black uppercase tracking-widest text-text-primary">
                                User Profile
                            </h3>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-border"
                            >
                                <FiX className="text-[20px] text-text-muted" />
                            </button>
                        </div>

                        {/* Profile Content */}
                        <div className="p-8">
                            <div className="flex flex-col items-center text-center mb-10">
                                <UserAvatar name={user.name} size="96px" fontSize="32px" />
                                <h2 className="mt-6 text-[24px] font-black text-text-primary tracking-tight">
                                    {user.name}
                                </h2>
                                <p className="text-[14px] font-bold text-text-muted mt-1 opacity-70 italic">
                                    {user.email}
                                </p>
                                <div className="mt-6 flex gap-3">
                                    <Button variant="primary" className="h-[40px] px-6 rounded-full text-[12px] font-bold">
                                        Edit Profile
                                    </Button>
                                    <Button variant="ghost" className="h-[40px] px-6 rounded-full text-[12px] font-bold border border-border">
                                        Send Mail
                                    </Button>
                                </div>
                            </div>

                            <hr className="border-border/50 mb-10" />

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 gap-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/5 rounded-xl text-primary">
                                        <FiShield className="text-[20px]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Global Role</span>
                                        <span className="text-[15px] font-bold text-text-primary mt-0.5">{user.role}</span>
                                    </div>
                                </div>
                                

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/5 rounded-xl text-primary">
                                        <FiBriefcase className="text-[20px]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Organization</span>
                                        <span className="text-[15px] font-bold text-text-primary mt-0.5">{user.organization || 'No Organization'}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/5 rounded-xl text-primary">
                                        <FiClock className="text-[20px]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Account Status</span>
                                        <span className={`text-[13px] font-black uppercase tracking-wider mt-1 px-3 py-1 rounded-full border ${user.status === 'active' ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
                                            {user.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-border/50">
                                <div className="flex items-center gap-2 mb-4">
                                    <FiCalendar className="text-text-muted" />
                                    <span className="text-[12px] font-bold text-text-secondary uppercase tracking-wider">Recent Activity</span>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shadow-[0_0_8px_var(--color-primary)]"></div>
                                            <div className="flex flex-col">
                                                <p className="text-[13px] font-bold text-text-primary leading-tight">Logged in from Mumbai, India</p>
                                                <span className="text-[11px] text-text-muted font-medium mt-1">2 hours ago • Chrome/Windows</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UserPeekView;
