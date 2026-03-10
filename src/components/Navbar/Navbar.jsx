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
            className={`flex flex-col flex-shrink-0 sticky top-0 z-20 ${className}`}
            style={{
                backgroundColor: "var(--color-bg-secondary)",
                borderBottom: "1px solid var(--color-border-light)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                height: "var(--navbar-height, 64px)",
                justifyContent: "center",
                ...style
            }}
        >
            <div className="w-full max-w-[1400px] mx-auto px-12 sm:px-24 lg:px-40">
                {/* Top Row: Navigation + Search + User */}
                <div className="flex items-center justify-between h-full">
                    {children ? (
                        children
                    ) : (
                        <>
                            {/* Left section: Breadcrumbs/Logo */}
                            <div className="flex items-center gap-4">
                                {showMenuButton && (
                                    <button
                                        onClick={onMenuClick}
                                        className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden cursor-pointer"
                                        aria-label="Open menu"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="3" y1="12" x2="21" y2="12"></line>
                                            <line x1="3" y1="6" x2="21" y2="6"></line>
                                            <line x1="3" y1="18" x2="21" y2="18"></line>
                                        </svg>
                                    </button>
                                )}
                                {leftContent}
                            </div>

                            {/* Right Section: Actions + Profile */}
                            <div className="flex items-center ml-auto">
                                {rightContent}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* Optional Center Content (Mobile) */}
            {centerContent && (
                <div className="md:hidden px-6 pb-2">
                    {centerContent}
                </div>
            )}
        </header>
    );
};

export default Navbar;