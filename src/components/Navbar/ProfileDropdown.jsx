import React, { useState, useRef, useEffect } from 'react';

const ProfileDropdown = ({ userInfo }) => {
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

    // Placeholder data mappings
    const name = userInfo?.name || 'Admin User';
    const email = userInfo?.email || 'admin@aisafety.com';

    return (
        <div className="relative mr-2 md:mr-4" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-white flex-shrink-0 cursor-pointer transition hover:shadow-sm focus:outline-none flex items-center justify-center p-0.5"
                style={{ border: '1px solid #e5e7eb' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div
                    className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: '#f4a374', color: '#fff' }}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[85%] h-[85%] mt-1 opacity-90"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute right-0 bg-white z-50 overflow-hidden"
                    style={{
                        marginTop: '8px',
                        width: '235px',
                        borderRadius: '12px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        border: '1px solid #f3f4f6',
                        animation: "fadeIn 0.15s ease-out"
                    }}
                >
                    {/* Header Section */}
                    <div style={{ padding: '16px 20px 12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                            style={{
                                height: '40px', width: '40px', borderRadius: '50%',
                                backgroundColor: '#f4a374', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', flexShrink: 0, overflow: 'hidden', color: '#fff'
                            }}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[85%] h-[85%] mt-1 opacity-90"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', lineHeight: '1.2' }}>
                                {name}
                            </p>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', lineHeight: '1.2' }}>
                                {email}
                            </p>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f8fafc', margin: '0 16px' }}></div>

                    {/* Menu Items */}
                    <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
                        <a
                            href="#profile"
                            className="flex items-center transition-colors"
                            style={{ padding: '8px 20px', gap: '14px', fontSize: '13.5px', fontWeight: '500', color: '#334155', textDecoration: 'none' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#334155'; }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            My Profile
                        </a>

                        <a
                            href="#settings"
                            className="flex items-center transition-colors"
                            style={{ padding: '8px 20px', gap: '14px', fontSize: '13.5px', fontWeight: '500', color: '#334155', textDecoration: 'none' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#334155'; }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><circle cx="19.5" cy="13" r="2.5"></circle><path d="M19.5 9.5v1"></path><path d="M19.5 15.5v1"></path><path d="M22.5 11.5l-.5-.5"></path><path d="M17 15l-.5-.5"></path><path d="M22.5 14.5l-.5.5"></path><path d="M17 11l-.5.5"></path></svg>
                            Account Settings
                        </a>

                        <a
                            href="#security"
                            className="flex items-center transition-colors"
                            style={{ padding: '8px 20px', gap: '14px', fontSize: '13.5px', fontWeight: '500', color: '#334155', textDecoration: 'none' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#334155'; }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            Security & JWT
                        </a>

                        <a
                            href="#support"
                            className="flex items-center transition-colors"
                            style={{ padding: '8px 20px', gap: '14px', fontSize: '13.5px', fontWeight: '500', color: '#334155', textDecoration: 'none' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#334155'; }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            Support
                        </a>
                    </div>

                    {/* Sign Out */}
                    <div style={{ padding: '4px 0' }}>
                        <a
                            href="#signout"
                            className="flex items-center transition-colors"
                            style={{
                                padding: '10px 20px', gap: '14px', fontSize: '13.5px', fontWeight: '500',
                                color: '#ef4444', textDecoration: 'none', borderTop: '1px solid #f8fafc'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                            Log Out
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;