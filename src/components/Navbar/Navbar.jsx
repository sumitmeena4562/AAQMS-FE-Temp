import React from "react";

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
        <header
            className={`flex flex-col  flex-shrink-0 sticky top-0 z-20 ${className}`}
            style={{
                padding:"0 20px",
                backgroundColor: "var(--color-bg-primary)",
                borderBottom: "1px solid var(--color-border)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                ...style
            }}
        >
            {/* Top Row: Navigation + Search + User */}
            <div className="flex items-center justify-between px-8 h-16">
                {children ? (
                    children
                ) : (
                    <>
                        {/* Hamburger (Mobile Only) */}
                        <div className="md:hidden flex items-center">
                            {showMenuButton && (
                                <button
                                    onClick={onMenuClick}
                                    className="p-1.5 -ml-1.5 rounded-xl hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-colors cursor-pointer"
                                    aria-label="Open menu"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-[var(--color-text-primary)] transition-colors"><line x1="5" y1="12" x2="19" y2="12"></line><line x1="5" y1="6" x2="19" y2="6"></line><line x1="5" y1="18" x2="19" y2="18"></line></svg>
                                </button>
                            )}
                        </div>

                        {/* Breadcrumbs (Desktop Only in this row) */}
                        <div className="hidden md:flex items-center flex-1 overflow-hidden mr-4">
                            {leftContent}
                        </div>

                        {/* Search and Right Icons (Mobile & Desktop) */}
                        <div className="flex-1 md:flex-none flex items-center justify-end">
                            {rightContent}
                        </div>
                    </>
                )}
            </div>

            {/* Bottom Row: Breadcrumbs (Mobile Only) */}
            {!children && leftContent && (
                <div
                    className="md:hidden flex items-center overflow-x-auto no-scrollbar border-t"
                    style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        borderColor:
                            'color-mix(in srgb, var(--color-border) 60%, transparent)',
                        paddingLeft: 'clamp(24px, 4vw, 40px)',
                        paddingRight: 'clamp(24px, 4vw, 40px)'
                    }}
                >
                    <div className="flex items-center whitespace-nowrap min-w-max py-2">
                        {leftContent}
                    </div>
                </div>
            )}

            {/* Optional Center Content (Mobile) */}
            {centerContent && (
                <div className="md:hidden px-6 pb-2">
                    {centerContent}
                </div>
            )}

            {/* Hide Scrollbar */}
            <style>
                {`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
      `}
            </style>
        </header>
    );
};

export default Navbar;