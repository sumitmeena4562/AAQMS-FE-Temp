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
                                color: t.color.primary, 
                                fontWeight: 800, 
                                fontSize: 13,
                                letterSpacing: '-0.2px'
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
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: t.color.textPlaceholder,
                                    transition: `color ${t.transition.fast}`,
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = t.color.textSecondary}
                                onMouseLeave={e => e.currentTarget.style.color = t.color.textPlaceholder}
                            >
                                {isFirst && <FiHome size={14} style={{ marginBottom: 1 }} />}
                                {item.label}
                            </Link>
                        )}

                        {/* Modern Separator */}
                        {!isLast && (
                            <FiChevronRight size={14} color={t.color.borderDark} style={{ opacity: 0.6 }} />
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;