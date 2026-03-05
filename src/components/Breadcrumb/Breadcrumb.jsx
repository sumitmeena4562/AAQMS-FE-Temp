import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb Component — Global, Reusable
 *
 * Props:
 * @param {Array} items - Breadcrumb trail array
 *   Format: [{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Zones' }]
 *   Last item (no path) = current page (bold, no link)
 * @param {string} separator - Separator character (default: '›')
 * @param {Object} style - Extra custom styles for container
 * @param {string} className - Extra CSS classes
 *
 * Usage:
 *   <Breadcrumb items={[
 *       { label: 'Dashboard', path: '/admin/dashboard' },
 *       { label: 'Organizations', path: '/admin/organizations' },
 *       { label: 'Acme Logistics Hub', path: '/admin/organizations/1' },
 *       { label: 'Zones' }  // last item = current page
 *   ]} />
 */

const Breadcrumb = ({
    items = [],
    separator = '›',
    style = {},
    className = ''
}) => {
    if (!items.length) return null;

    return (
        <nav
            className={className}
            aria-label="Breadcrumb"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'var(--color-bg-secondary)',
                borderBottom: '1px solid var(--color-border)',
                fontFamily: 'var(--font-family)',
                fontSize: '13.5px',
                flexWrap: 'wrap',
                ...style
            }}
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={index}>
                        {/* Separator (skip before first item) */}
                        {index > 0 && (
                            <span style={{
                                color: 'var(--color-text-muted)',
                                fontSize: '14px',
                                userSelect: 'none',
                                opacity: 0.6
                            }}>
                                {separator}
                            </span>
                        )}

                        {/* Breadcrumb Item */}
                        {isLast || !item.path ? (
                            // Current page — bold, no link
                            <span style={{
                                fontWeight: 600,
                                color: 'var(--color-text-primary)',
                                letterSpacing: '-0.01em'
                            }}>
                                {item.label}
                            </span>
                        ) : (
                            // Clickable link
                            <Link
                                to={item.path}
                                style={{
                                    fontWeight: 450,
                                    color: 'var(--color-text-tertiary)',
                                    textDecoration: 'none',
                                    transition: 'color 150ms ease',
                                    letterSpacing: '-0.01em'
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
                            >
                                {item.label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;
