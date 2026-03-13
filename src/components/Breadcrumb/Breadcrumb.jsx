import React from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiHome } from "react-icons/fi";
import { t } from "../../theme/theme";

const Breadcrumb = ({ items = [], className = "" }) => {
    if (!items.length) return null;

    return (
        <nav
            aria-label="Breadcrumb"
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                overflowX: 'auto', 
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
                ...className
            }}
            className="no-scrollbar"
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isFirst = index === 0;

                return (
                    <React.Fragment key={index}>
                        {/* Item */}
                        {isLast ? (
                            <span style={{ 
                                padding: '4px 0', 
                                color: t.color.text, 
                                fontWeight: 750, 
                                fontSize: 13,
                                letterSpacing: '-0.02em',
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    textDecoration: 'none',
                                    fontSize: 12.5,
                                    fontWeight: 550,
                                    color: t.color.textMuted,
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                    letterSpacing: '-0.01em',
                                }}
                                className="breadcrumb-link"
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = t.color.primary;
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = t.color.textMuted;
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {isFirst && <FiHome size={13} style={{ marginBottom: 1.5, opacity: 0.8 }} />}
                                {item.label}
                            </Link>
                        )}

                        {/* Minimalist Separator */}
                        {!isLast && (
                            <FiChevronRight 
                                size={12} 
                                style={{ 
                                    color: t.color.textPlaceholder, 
                                    opacity: 0.5, 
                                    margin: '0 2px',
                                    flexShrink: 0
                                }} 
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;