import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProfileDropdown = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const name = user?.name || 'Admin User';
    const email = user?.email || 'admin@aisafety.com';

    const handleLogout = (e) => { e.preventDefault(); logout(); navigate('/login'); };

    const menuItems = [
        { label: 'My Profile', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
        { label: 'Settings', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
        { label: 'Support', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    ];

    return (
        <div ref={ref} className="relative">
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold transition-all duration-200 hover:ring-2 hover:ring-primary/10 ${isOpen ? 'ring-2 ring-primary/10 shadow-lg' : ''}`}
            >
                {name.charAt(0).toUpperCase()}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-[240px] bg-white border border-slate-200 rounded-2xl shadow-[0_20px_60px_rgba(7,34,103,0.15)] z-[2000] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Section */}
                    <div className="p-4 flex items-center gap-3.5 bg-gradient-to-br from-primary/[0.05] to-transparent border-b border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#6366F1] flex items-center justify-center text-white text-[15px] font-extrabold shadow-md relative shrink-0">
                            {name.charAt(0).toUpperCase()}
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                        </div>
                        <div className="overflow-hidden">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <p className="text-slate-900 text-sm font-extrabold truncate leading-tight">{name}</p>
                                <span className="text-[9px] font-black bg-primary text-white px-1.5 py-0.5 rounded uppercase tracking-wider">ADMIN</span>
                            </div>
                            <p className="text-slate-500 text-[11px] font-semibold truncate">{email.toLowerCase()}</p>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2.5">
                        {menuItems.map((item, i) => (
                            <button
                                key={i}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-150 hover:bg-primary/[0.04] hover:text-primary group text-left"
                            >
                                <span className="text-primary/60 group-hover:text-primary transition-colors">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-slate-100 p-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-500 rounded-xl transition-all duration-150 hover:bg-rose-50 group text-left"
                        >
                            <svg className="stroke-[2.5]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            <span>Log out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;