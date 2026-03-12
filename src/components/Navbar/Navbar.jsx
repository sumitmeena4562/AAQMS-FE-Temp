import React from "react";
import { t } from '../../theme/theme';

const S = {
    header: {
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 20,
        backgroundColor: t.color.navbarBg,
        borderBottom: `1px solid ${t.color.navbarBorder}`,
        height: t.layout.navbarHeight,
        justifyContent: 'center',
        boxSizing: 'border-box',
    },
    inner: {
        width: '100%',
        maxWidth: t.layout.maxContentWidth,
        margin: '0 auto',
        padding: `0 ${t.layout.contentPadding}px`,
        boxSizing: 'border-box',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
    },
    left: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    menuBtn: {
        padding: t.space.sm,
        marginLeft: -6,
        borderRadius: t.radius.sm,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: t.color.textMuted,
    },
};

const Navbar = ({
    leftContent,
    centerContent,
    rightContent,
    showMenuButton = false,
    onMenuClick,
    className = "",
    children,
    style
}) => {
    return (
        <header style={{ ...S.header, ...style }}>
            <div style={S.inner}>
                <div style={S.row}>
                    {children ? (
                        children
                    ) : (
                        <>
                            {/* Left: Menu + Breadcrumbs */}
                            <div style={S.left}>
                                {showMenuButton && (
                                    <button
                                        onClick={onMenuClick}
                                        style={S.menuBtn}
                                        className="nav-menu-btn"
                                        aria-label="Open menu"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="3" y1="12" x2="21" y2="12" />
                                            <line x1="3" y1="6" x2="21" y2="6" />
                                            <line x1="3" y1="18" x2="21" y2="18" />
                                        </svg>
                                    </button>
                                )}
                                {leftContent}
                            </div>

                            {/* Right: Actions + Profile */}
                            <div style={S.right}>
                                {rightContent}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* Hide menu button on desktop — only show on mobile ≤768px */}
            <style>{`
                .nav-menu-btn { display: none !important; }
                @media (max-width: 768px) {
                    .nav-menu-btn { display: flex !important; }
                }
            `}</style>
        </header>
    );
};

export default Navbar;