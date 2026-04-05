import React, { useEffect } from 'react';


/**
 * Accessibility Enhancer Component
 * Adds ARIA labels, keyboard navigation, and screen reader support
 */
const AccessibilityEnhancer = () => {
    useEffect(() => {
        // Add keyboard navigation support
        const handleKeyDown = (e) => {
            // Skip to main content
            if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.focus();
                }
            }
            
            // Escape key to close modals/menu
            if (e.key === 'Escape') {
                const openMenu = document.querySelector('.mobile-menu.open');
                if (openMenu) {
                    const toggleButton = document.querySelector('.mobile-toggle');
                    if (toggleButton) toggleButton.click();
                }
            }
        };

        // Add focus management
        const handleFocus = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                e.target.style.outline = '2px solid #3b82f6';
                e.target.style.outlineOffset = '2px';
            }
        };

        const handleBlur = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                e.target.style.outline = 'none';
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('focus', handleFocus, true);
        window.addEventListener('blur', handleBlur, true);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('focus', handleFocus, true);
            window.removeEventListener('blur', handleBlur, true);
        };
    }, []);

    // Add skip link for screen readers
    useEffect(() => {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.position = 'absolute';
        skipLink.style.left = '-9999px';
        skipLink.style.top = 'auto';
        skipLink.style.width = '1px';
        skipLink.style.height = '1px';
        skipLink.style.overflow = 'hidden';
        skipLink.style.zIndex = '9999';
        skipLink.style.padding = '8px';
        skipLink.style.background = '#fff';
        skipLink.style.border = '1px solid #ccc';
        skipLink.style.borderRadius = '4px';
        skipLink.style.fontSize = '14px';
        skipLink.style.color = '#333';
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.left = '20px';
            skipLink.style.top = '20px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.left = '-9999px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        return () => {
            document.body.removeChild(skipLink);
        };
    }, []);

    return (
        <div style={{ display: 'none' }}>
            {/* Screen reader announcements */}
            <div 
                role="status" 
                aria-live="polite" 
                aria-atomic="true"
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
            >
                {/* Dynamic announcements will be injected here */}
            </div>
        </div>
    );
};

/**
 * Accessible Button Component
 */
export const AccessibleButton = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'md',
    ariaLabel,
    disabled = false,
    ...props 
}) => {
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px',
        fontWeight: 600,
        borderRadius: '8px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
        padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '8px 16px',
        fontFamily: 'inherit',
        color: '#fff',
        backgroundColor: variant === 'primary' ? 'var(--color-primary)' : '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        ...props.style
    };

    if (variant === 'secondary') {
        baseStyles.color = 'var(--color-primary)';
        baseStyles.backgroundColor = '#fff';
        baseStyles.border = '1px solid #e2e8f0';
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel || children}
            style={baseStyles}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }
            }}
            onFocus={(e) => {
                e.target.style.outline = '2px solid #3b82f6';
                e.target.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
                e.target.style.outline = 'none';
            }}
            {...props}
        >
            {children}
        </button>
    );
};

/**
 * Accessible Link Component
 */
export const AccessibleLink = ({ children, href, target = '_self', ...props }) => {
    return (
        <a
            href={href}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            style={{
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                ...props.style
            }}
            onMouseEnter={(e) => {
                e.target.style.color = '#0f172a';
                e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
                e.target.style.color = 'var(--color-primary)';
                e.target.style.textDecoration = 'none';
            }}
            onFocus={(e) => {
                e.target.style.outline = '2px solid #3b82f6';
                e.target.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
                e.target.style.outline = 'none';
            }}
            {...props}
        >
            {children}
        </a>
    );
};

/**
 * Accessible Card Component
 */
export const AccessibleCard = ({ children, onClick, ...props }) => {
    const isClickable = !!onClick;
    
    return (
        <div
            role={isClickable ? 'button' : 'article'}
            tabIndex={isClickable ? 0 : undefined}
            onClick={onClick}
            onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f1f5f9',
                cursor: isClickable ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                ...props.style
            }}
            onMouseEnter={(e) => {
                if (isClickable) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 15px -3px rgba(0, 0, 0, 0.1)';
                }
            }}
            onMouseLeave={(e) => {
                if (isClickable) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
            }}
            onFocus={(e) => {
                e.target.style.outline = '2px solid #3b82f6';
                e.target.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
                e.target.style.outline = 'none';
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export default AccessibilityEnhancer;