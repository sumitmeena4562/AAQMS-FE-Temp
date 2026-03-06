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
                            <span className="px-3 py-[2px] text-blue-600 font-semibold bg-blue-50 border border-blue-100 rounded-full">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                to={item.path}
                                className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition"
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
                            <span className="text-gray-400">{">"}</span>
                        )}

                    </React.Fragment>
                );
            })}

            {/* Hide Scrollbar */}
            <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </nav>
    );
};

export default Breadcrumb;