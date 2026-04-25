import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import ConfirmModal from '../UI/ConfirmModal';

const ProfileDropdown = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const fullName = user?.name || 'Admin User';
    const initials = fullName.charAt(0).toUpperCase();
    const email = user?.email || 'admin@aisafety.com';

    const handleLogout = (e) => { 
        e.preventDefault(); 
        setIsOpen(false); // Close dropdown
        setIsLogoutModalOpen(true); // Open confirm modal
    };

    const confirmLogout = () => {
        logout(); 
        setIsLogoutModalOpen(false);
        navigate('/login');
    };

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
                className={`w-9 h-9 rounded-full bg-primary border-2 border-white/10 flex items-center justify-center text-white text-[13px] font-black transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 ${isOpen ? 'ring-4 ring-primary/10 shadow-xl' : ''}`}
            >
                {initials}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-[260px] bg-card border border-border-main rounded-2xl shadow-[0_30px_90px_-15px_rgba(7,34,103,0.2)] z-[2000] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* User Info Section */}
                    <div className="p-4 flex items-center gap-3.5 bg-gradient-to-br from-primary/[0.03] to-transparent border-b border-border-main/50">
                        <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white text-[16px] font-black shadow-lg relative shrink-0">
                            {initials}
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-[2.5px] border-white shadow-sm" />
                        </div>
                        <div className="overflow-hidden">
                            <div className="flex flex-col gap-0.5 mb-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-title text-[15px] font-black truncate leading-tight">{fullName}</p>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary/20">{user?.role || 'USER'}</span>
                                </div>
                            </div>
                            <p className="text-gray/70 text-[11px] font-bold truncate tracking-tight">{email.toLowerCase()}</p>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2.5">
                        {menuItems.map((item, i) => (
                            <button
                                key={i}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-body transition-all duration-150 hover:bg-primary/[0.04] hover:text-primary group text-left"
                            >
                                <span className="text-primary/60 group-hover:text-primary transition-colors">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-border-main/50 p-2">
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
            {/* Logout Confirmation Modal */}
            <ConfirmModal 
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={confirmLogout}
                title="Logout Confirmation"
                message="Are you sure you want to log out of your account? You will need to sign in again to access the dashboard."
                confirmText="Log Out"
                danger={true}
            />
        </div>
    );
};

export default ProfileDropdown;