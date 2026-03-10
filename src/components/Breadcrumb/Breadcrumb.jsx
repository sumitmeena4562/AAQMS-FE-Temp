import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items = [], className = "" }) => {
    if (!items.length) return null;

    return (
        <nav
            aria-label="Breadcrumb"
            className={`flex items-center text-[14px] gap-2 overflow-x-auto whitespace-nowrap no-scrollbar ${className}`}
            style={{ letterSpacing: "-0.01em" }}
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isFirst = index === 0;

                return (
                    <React.Fragment key={index}>

                        {/* Item */}
                        {isLast ? (
                            <span className="px-3 py-[2px] text-[var(--color-accent)] font-medium rounded-full text-[13.5px] flex items-center" style={{ backgroundColor: 'var(--color-accent-soft)' }}>
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                to={item.path}
                                className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition"
                            >
                                {isFirst && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                )}

                                {item.label}
                            </Link>
                        )}

                        {/* Separator */}
                        {!isLast && (
                            <span className="text-[var(--color-text-muted)]">{">"}</span>
                        )}

                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;