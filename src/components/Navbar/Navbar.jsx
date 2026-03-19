import React from "react";

const Navbar = ({
    leftContent,
    centerContent,
    rightContent,
    showMenuButton = false,
    onMenuClick,
    className = "",
    children
}) => {
    return (
        <header className={`flex flex-col flex-shrink-0 sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 justify-center box-border ${className}`}>
            <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 box-border">
                <div className="flex items-center justify-between h-full">
                    {children ? (
                        children
                    ) : (
                        <>
                            {/* Left: Menu + Breadcrumbs */}
                            <div className="flex items-center gap-2.5">
                                {showMenuButton && (
                                    <button
                                        onClick={onMenuClick}
                                        className="hidden max-md:flex p-2 -ml-1.5 rounded-md border-none bg-transparent cursor-pointer items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
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

                            {/* Center Content */}
                            {centerContent && (
                                <div className="flex-1 flex justify-center">
                                    {centerContent}
                                </div>
                            )}

                            {/* Right: Actions + Profile */}
                            <div className="flex items-center ml-auto">
                                {rightContent}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;