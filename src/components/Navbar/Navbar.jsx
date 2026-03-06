import React from 'react';
import Search from '../UI/Search';

/**
 * Navbar Component — Global, Reusable Container
 *
 * Ye ek khali frame hai — andar jo chahiye wo tum props mein de do.
 *
 * Props:
 * @param {React.ReactNode} leftContent  - Left side mein jo dikhana hai (breadcrumb, title, etc.)
 * @param {React.ReactNode} centerContent - Center mein jo dikhana hai (search bar, tabs, etc.)
 * @param {React.ReactNode} rightContent  - Right side mein jo dikhana hai (bell, avatar, buttons, etc.)
 * @param {React.ReactNode} children      - Ya seedha children de do, full control tumhara
 * @param {Object} style                  - Extra custom styles
 * @param {string} className              - Extra custom classes
 */

const Navbar = ({
    leftContent,
    centerContent,
    rightContent,
    children,
    style = {},
    className = ''
}) => {
    return (
        <header
            className={`flex flex-col flex-shrink-0 z-10 sticky top-0 ${className}`}
            style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border)', ...style }}
        >
            <div className="h-16 flex items-center justify-between px-8" style={{ borderBottom: '1px solid var(--color-bg-secondary)' }}>
                {children ? (
                    children
                ) : (
                    <>
                        {/* Left Content (Breadcrumbs, title, etc) */}
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 overflow-x-auto no-scrollbar whitespace-nowrap flex-1">
                            {leftContent}
                        </div>

                        {/* Center Content */}
                        {centerContent && (
                            <div className="flex items-center flex-1 justify-center">
                                {centerContent}
                            </div>
                        )}

                        {/* Right Content (Search, Bell, Profile) */}
                        <div className="flex items-center gap-6 ml-4">
                            {rightContent}
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default Navbar;
