import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProfileDropdown = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Use dynamic data from authStore
    const name = user?.name || 'Admin User';
    const email = user?.email || 'admin@aisafety.com';

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                className="h-9 w-9 rounded-lg bg-white flex-shrink-0 cursor-pointer transition-all hover:shadow-md focus:outline-none flex items-center justify-center p-0.5"
                style={{ border: '1.5px solid var(--color-border-light)' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div
                    className="w-full h-full rounded-md flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: 'var(--color-primary-50, rgba(7, 34, 103, 0.05))', color: 'var(--color-primary)' }}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[80%] h-[80%] opacity-90"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute right-0 bg-white z-50 overflow-hidden"
                    style={{
                        marginTop: '12px',
                        width: '240px',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-premium)',
                        border: '1px solid var(--color-border-light)',
                        animation: "fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                >
                    {/* Header Section */}
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                            style={{
                                height: '42px', width: '42px', borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', flexShrink: 0, overflow: 'hidden', color: '#fff',
                                boxShadow: '0 2px 8px rgba(7, 34, 103, 0.15)'
                            }}
                        >
                             <span style={{ fontWeight: 800, fontSize: '15px' }}>{name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', lineHeight: '1.2' }}>
                                {name}
                            </p>
                            <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: '3px 0 0 0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', lineHeight: '1.2' }}>
                                {email}
                            </p>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border-light)', margin: '0 16px' }}></div>

                    {/* Menu Items */}
                    <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
                        {[
                            { label: 'My Profile', href: '#profile', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
                            { label: 'Account Settings', href: '#settings', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> },
                             { label: 'Security & Analytics', href: '#security', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> },
                            { label: 'Support', href: '#support', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg> },
                        ].map((item, idx) => (
                            <a
                                key={idx}
                                href={item.href}
                                style={{
                                    padding: '10px 20px', gap: '12px', fontSize: '13px', fontWeight: '550',
                                    color: 'var(--color-text-secondary)', textDecoration: 'none',
                                    display: 'flex', alignItems: 'center', transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
                            >
                                <span style={{ opacity: 0.6 }}>{item.icon}</span>
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Sign Out */}
                    <div style={{ padding: '4px 0', borderTop: '1px solid var(--color-border-light)' }}>
                        <a
                            href="#signout"
                            style={{
                                padding: '12px 20px', gap: '12px', fontSize: '13px', fontWeight: '600',
                                color: 'var(--color-danger)', textDecoration: 'none',
                                display: 'flex', alignItems: 'center', transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-danger-bg, rgba(239, 68, 68, 0.05))'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                            onClick={handleLogout}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                            Log Out
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;