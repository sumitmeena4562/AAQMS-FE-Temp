import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChevronIcon = () => (
  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

const Breadcrumb = ({ items = [] }) => {
  const navigate = useNavigate();
  if (!items.length) return null;

  return (
    <nav className="flex items-center flex-wrap gap-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        const handleClick = () => {
          if (item.path) {
            navigate(item.path);
          }
        };

        return (
          <React.Fragment key={index}>
            {/* Active Style - Simple & Nice */}
            {item.isActive ? (
              <div 
                onClick={handleClick}
                className="flex items-center gap-1.5 px-2 py-1 bg-blue-50/50 text-primary rounded-md cursor-pointer hover:bg-blue-100/50 transition-colors"
              >
                {item.icon && <span className="flex items-center opacity-90">{item.icon}</span>}
                <span className="text-[11.5px] font-bold tracking-tight">
                  {item.label}
                </span>
              </div>
            ) : (
              /* Inactive Style - Subtle */
              <div
                onClick={handleClick}
                className="flex items-center gap-1.5 px-1.5 py-1 text-[11.5px] font-medium text-slate-400 hover:text-primary transition-all duration-200 group cursor-pointer"
              >
                {item.icon && <span className="opacity-60 group-hover:opacity-100 flex items-center transition-opacity">{item.icon}</span>}
                <span className="tracking-tight">{item.label}</span>
              </div>
            )}

            {/* Simple Separator */}
            {!isLast && (
              <div className="opacity-20 text-slate-400">
                <ChevronIcon />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;