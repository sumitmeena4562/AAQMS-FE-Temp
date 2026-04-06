import React from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { FiX, FiShield, FiBriefcase, FiClock, FiCalendar, FiEdit2, FiTrash2, FiMapPin, FiUser, FiPhone, FiLayers } from 'react-icons/fi';
import { t } from '../../theme/theme';

const AVATAR_COLORS = t.color.avatarGradients;
function getAvatar(name) {
    if (!name) return { initials:'?', colors: AVATAR_COLORS[0] };
    let h = 0; for (let i=0;i<name.length;i++) h = name.charCodeAt(i)+((h<<5)-h);
    const p = name.split(' ');
    return { initials: (p.length>=2?`${p[0][0]}${p[1][0]}`:name.slice(0,2)).toUpperCase(), colors: AVATAR_COLORS[Math.abs(h)%AVATAR_COLORS.length] };
}

import Button from '../UI/Button';

const UserPeekView = ({ isOpen, onClose, user, onEdit, onDeactivate, onViewSites }) => {
    if (!user) return null;
    const { initials, colors } = getAvatar(user.name);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="relative w-full max-w-[520px] max-h-[85vh] bg-card border border-border-main rounded-[var(--radius-card)] shadow-xl flex flex-col overflow-hidden"
                    >
                        {/* Modal Header */}
                        <div className="relative z-10 p-6 pb-2 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-title tracking-tight leading-none mb-1.5">
                                    User Profile
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    <span className="text-[10px] font-bold text-gray uppercase tracking-wider">
                                        ID: {user.id || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="p-2 text-gray hover:bg-base hover:text-body rounded-lg transition-colors"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="relative z-10 flex-1 overflow-y-auto px-6 pt-6 pb-2 custom-scrollbar">
                            
                            {/* Profile Identity Section */}
                            <div className="flex items-center gap-5 mb-8">
                                <Motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg border-2 border-white shrink-0 overflow-hidden"
                                    style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
                                >
                                    {user.avatar ? (
                                        <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                                    ) : (
                                        initials
                                    )}
                                </Motion.div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-lg font-bold text-title truncate leading-tight mb-1">{user.name}</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-[12px] text-body font-medium truncate">{user.email}</div>
                                        <div className={`
                                            px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border
                                            ${user.status === 'active' 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                : 'bg-slate-50 text-slate-600 border-slate-200'}
                                        `}>
                                            {user.status === 'active' ? 'Active' : 'Deactive'}
                                        </div>
                                        {/* Dynamic Assignment Status */}
                                        <div className={`
                                            px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border
                                            ${(user.organization || user.region || user.zone) 
                                                ? 'bg-primary/5 text-primary border-primary/10' 
                                                : 'bg-amber-50 text-amber-600 border-amber-100'}
                                        `}>
                                            {(user.organization || user.region || user.zone) ? 'Assigned' : 'Standby'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid - Only showing fields with data */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {[
                                    { icon: <FiShield size={14} />, label: "Role", value: user.role === 'field_officer' ? 'Field Officer' : user.role?.charAt(0).toUpperCase() + user.role?.slice(1) },
                                    { icon: <FiPhone size={14} />, label: "Mobile Number", value: user.phone_number },
                                    { icon: <FiBriefcase size={14} />, label: "Organization", value: user.organization },
                                    { icon: <FiMapPin size={14} />, label: user.role === 'field_officer' ? 'Assigned Zone' : 'Region', value: user.role === 'field_officer' ? user.zone : user.region },
                                    { icon: <FiCalendar size={14} />, label: "Joined Platform", value: user.created_at || 'Recent' },
                                    { icon: <FiUser size={14} />, label: "Employee ID", value: user.employee_id || user.id }
                                ].filter(item => item.value && item.value !== 'N/A' && item.value !== 'Not Specified' && item.value !== '').map((item, idx) => (
                                    <div 
                                        key={idx}
                                        className="p-3 bg-base border border-border-main rounded-[var(--radius-card)]"
                                    >
                                        <div className="text-primary mb-1.5 opacity-70">{item.icon}</div>
                                        <div className="text-[9px] font-bold text-gray uppercase tracking-wider">{item.label}</div>
                                        <div className="text-[13px] font-bold text-body mt-0.5 truncate">{item.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Activity Section */}
                            <div className="space-y-6 mb-6">
                                {/* Activity Summary */}
                                <div className="p-5 bg-base border border-border-main rounded-[var(--radius-card)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            <span className="text-[10px] font-bold text-title uppercase tracking-wider">Activity Overview</span>
                                        </div>
                                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">LIVE</span>
                                    </div>
                                    <div className="flex items-end gap-1.5 h-12">
                                        {[40, 65, 30, 85, 50, 95, 70].map((h, i) => (
                                            <div key={i} className="flex-1 h-full flex items-end">
                                                <Motion.div 
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    className={`w-full rounded-sm ${i === 5 ? 'bg-primary' : 'bg-border-main'}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="relative z-10 p-5 bg-base border-t border-border-main flex items-center justify-end gap-2 text-right">
                            {user.role === 'coordinator' && (
                                <Button
                                    variant="outline"
                                    onClick={() => { onClose(); onViewSites?.(user); }}
                                    className="!h-10 !px-5 !text-[11px] !font-bold !uppercase !tracking-wider border-primary/30 text-primary hover:bg-primary/5 mr-auto"
                                >
                                    <FiLayers size={14} className="mr-2 inline" />
                                    View Managed Sites
                                </Button>
                            )}
                            {user.status === 'active' && (
                                <Button
                                    variant="danger"
                                    onClick={() => onDeactivate(user)}
                                    className="!h-10 !px-5 !text-[11px] !font-bold !uppercase !tracking-wider"
                                >
                                    Deactivate Account
                                </Button>
                            )}
                            <Button
                                variant="primary"
                                onClick={() => { onClose(); onEdit(user); }}
                                className="!h-10 !px-6 !rounded-[var(--radius-button)] !text-[11px] !font-bold !uppercase !tracking-wider shadow-lg shadow-primary/10"
                            >
                                Edit Profile
                            </Button>
                        </div>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default UserPeekView;
