import React from "react";
import { motion } from 'framer-motion';
import { t } from '../../theme/theme';
import { FiSearch } from 'react-icons/fi';

const S = {
    header: {
        position: 'sticky',
        top: 0,
        zIndex: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: `0.5px solid rgba(0, 0, 0, 0.08)`,
        height: t.layout.navbarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        boxShadow: `
            0 1px 2px rgba(0,0,0,0.02),
            0 4px 12px rgba(0,0,0,0.01),
            inset 0 -1px 0 rgba(255,255,255,0.5)
        `,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    inner: {
        width: '100%',
        maxWidth: t.layout.maxContentWidth,
        margin: '0 auto',
        padding: `0 ${t.layout.contentPadding}px`,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        height: '100%',
    },
    left: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        justifyContent: 'flex-start',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 340,
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'flex-end',
    },
    searchContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 320,
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    searchInput: {
        width: '100%',
        padding: '8px 14px 8px 36px',
        borderRadius: '11px',
        border: `0.5px solid rgba(0, 0, 0, 0.12)`,
        fontSize: 12.5,
        fontWeight: 500,
        background: 'rgba(241, 243, 245, 0.5)',
        color: t.color.text,
        outline: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        letterSpacing: '-0.015em',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
    },
    searchIcon: {
        position: 'absolute',
        left: 13,
        color: t.color.textMuted,
        fontSize: 14,
        transition: 'all 0.3s ease',
        pointerEvents: 'none',
    },
    shortcutHint: {
        position: 'absolute',
        right: 10,
        fontSize: 9,
        fontWeight: 800,
        color: t.color.textPlaceholder,
        padding: '2.5px 5px',
        background: 'rgba(255, 255, 255, 0.9)',
        border: `0.5px solid rgba(0, 0, 0, 0.08)`,
        borderRadius: 5,
        pointerEvents: 'none',
        boxShadow: '0 1px 1px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        letterSpacing: '0.02em',
    },
    iconBtn: {
        width: 34,
        height: 34,
        borderRadius: '9px',
        border: '0.5px solid transparent',
        background: 'transparent',
        cursor: 'pointer',
        color: t.color.textTertiary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    menuBtn: {
        padding: 7,
        borderRadius: '8px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: t.color.textMuted,
        marginRight: 2,
    },
};

// ── Reusable Extracted Components ──

export const NavSearch = ({ placeholder = "Quick find...", shortcut = "⌘K", onSearch, value, onChange }) => {
    const inputRef = React.useRef(null);

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            // Support '/' and 'Cmd/Ctrl + K'
            if ((e.key === '/' && document.activeElement !== inputRef.current && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) || 
                ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div style={S.searchContainer} className="nav-search-box">
            <FiSearch style={S.searchIcon} className="nav-search-icon" />
            <input 
                ref={inputRef}
                style={S.searchInput} 
                placeholder={placeholder} 
                className="nav-search-input"
                value={value}
                onChange={(e) => {
                    onChange?.(e.target.value);
                    onSearch?.(e.target.value);
                }}
            />
            {shortcut && <span style={S.shortcutHint} className="nav-shortcut-hint">{shortcut}</span>}
        </div>
    );
};

export const NavIconButton = ({ icon: Icon, onClick, className = "" }) => (
    <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={S.iconBtn}
        onClick={onClick}
        className={`nav-icon-btn ${className}`}
    >
        {typeof Icon === 'function' ? <Icon size={20} /> : Icon}
    </motion.button>
);

// ── Main Navbar Component ──

const Navbar = ({
    leftContent,
    centerContent,
    rightContent,
    showMenuButton = false,
    onMenuClick,
}) => {
    return (
        <header style={S.header}>
            <div style={S.inner} className="nav-inner-grid">
                {/* Left Slot: Mobile Menu + Breadcrumbs */}
                <div style={S.left}>
                    {showMenuButton && (
                        <button
                            onClick={onMenuClick}
                            style={S.menuBtn}
                            className="nav-menu-btn"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                        </button>
                    )}
                    <div className="nav-left-content">{leftContent}</div>
                </div>

                {/* Center Slot: Global Search (Hidden on Mobile) */}
                <div style={S.center} className="nav-center-slot">
                    {centerContent}
                </div>

                {/* Right Slot: Utilities + Profile */}
                <div style={S.right}>
                    {/* Secondary Search Icon for Mobile (hidden on desktop) */}
                    <NavIconButton 
                        icon={FiSearch} 
                        className="mobile-search-trigger"
                        onClick={() => console.log('Mobile search open')} 
                    />
                    {rightContent}
                </div>
            </div>

            <style>{`
                .nav-menu-btn { display: none !important; }
                .nav-left-content { display: flex; align-items: center; }
                .mobile-search-trigger { display: none !important; }

                /* Tablet Polish (<= 1024px) */
                @media (max-width: 1024px) {
                    .nav-center-slot { min-width: 200px; }
                    .nav-search-box { max-width: 240px !important; }
                }

                /* Mobile Polish (<= 768px) */
                @media (max-width: 768px) {
                    header { background-color: #ffffff !important; }
                    .nav-menu-btn { display: flex !important; }
                    
                    /* Hide Breadcrumbs and Center Search on Mobile */
                    .nav-left-content { display: none !important; }
                    .nav-center-slot { display: none !important; }
                    
                    /* Show Mobile Search Trigger */
                    .mobile-search-trigger { display: flex !important; }

                    /* Reset Inner Grid for Mobile (Two column focus) */
                    .nav-inner-grid {
                        grid-template-columns: auto 1fr !important;
                        gap: 12px;
                    }
                }

                .nav-search-input:focus {
                    background: #ffffff !important;
                    border-color: ${t.color.primary} !important;
                    box-shadow: 
                        0 0 0 3px rgba(7, 34, 103, 0.08),
                        0 12px 30px -5px rgba(0, 0, 0, 0.08),
                        0 4px 10px -2px rgba(0, 0, 0, 0.03) !important;
                }
                .nav-search-box:focus-within {
                    max-width: 440px !important;
                    z-index: 10;
                }
                .nav-search-box:focus-within .nav-shortcut-hint {
                    opacity: 0;
                    transform: translateX(8px);
                    pointer-events: none;
                }
                .nav-shortcut-hint {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .nav-search-box:focus-within .nav-search-icon {
                    color: ${t.color.primary} !important;
                    transform: scale(1.1);
                }

                .nav-icon-btn {
                    border: 0.5px solid transparent !important;
                }
                .nav-icon-btn:hover {
                    background: #ffffff !important;
                    border-color: rgba(0, 0, 0, 0.08) !important;
                    color: ${t.color.primary} !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
                }
            `}</style>
        </header>
    );
};

export default Navbar;
;