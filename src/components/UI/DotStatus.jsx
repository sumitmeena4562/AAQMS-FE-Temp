import React from 'react';

const DotStatus = ({ type, text }) => {
    // Mapping types to Tailwind classes that use CSS variables defined in index.css
    const typeStyles = {
        unassigned: {
            dot: 'bg-danger',
            text: 'text-[var(--color-danger)]'
        },
        assigned: {
            dot: 'bg-success',
            text: 'text-[var(--color-success)]'
        },
        active: {
            dot: 'bg-success',
            text: 'text-[var(--color-success)]'
        },
        inactive: {
            dot: 'bg-text-muted',
            text: 'text-[var(--color-text-muted)]'
        }
    };

    const style = typeStyles[type?.toLowerCase()] || typeStyles.inactive;

    return (
        <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
            <span className={`text-sm font-medium ${style.text}`}>{text}</span>
        </div>
    );
};

export default DotStatus;
