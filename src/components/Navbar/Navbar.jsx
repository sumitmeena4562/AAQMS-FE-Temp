import React from 'react';

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
            className={className}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 24px',
                background: 'var(--color-bg-secondary)',
                borderBottom: '1px solid var(--color-border)',
                height: 'var(--navbar-height)',
                minHeight: 'var(--navbar-height)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                fontFamily: 'var(--font-family)',
                gap: '16px',
                ...style
            }}
        >
            {children ? (
                // Agar children diya hai toh seedha render karo — full control
                children
            ) : (
                // Warna left / center / right slots use karo
                <>
                    {/* Left */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: leftContent ? '0 0 auto' : undefined }}>
                        {leftContent}
                    </div>

                    {/* Center */}
                    {centerContent && (
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                            {centerContent}
                        </div>
                    )}

                    {/* Right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {rightContent}
                    </div>
                </>
            )}
        </header>
    );
};

export default Navbar;
