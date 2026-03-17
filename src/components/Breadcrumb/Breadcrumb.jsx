import React from 'react';
import { Link } from 'react-router-dom';

const ChevronIcon = () => (
  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

const Breadcrumb = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav className="flex items-center flex-wrap gap-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {/* Agar item active hai, to Blue Pill (Figma style) dikhayega */}
            {item.isActive ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-md shadow-sm">
                {item.icon && <span className="text-gray-500 flex items-center">{item.icon}</span>}
                <span className="text-[13px] font-medium text-gray-700 leading-none mt-[1px]">
                  {item.label}
                </span>
              </div>
            ) : (
              /* Normal inactive path */
              <Link
                to={item.path || "#"}
                state={item.state}
                className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {item.icon && <span className="text-gray-400 flex items-center">{item.icon}</span>}
                <span className="leading-none mt-[1px]">{item.label}</span>
              </Link>
            )}

            {/* Separator Chevron > */}
            {!isLast && <ChevronIcon />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;