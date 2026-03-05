import React from 'react';

const ActionLink = ({ label, icon, onClick, type = 'edit' }) => {
    const typeStyles = {
        edit: 'text-[var(--color-accent-bright)] hover:text-[var(--color-primary-dark)]',
        delete: 'text-[var(--color-danger)] hover:text-[var(--color-danger-dark)]',
        view: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${typeStyles[type] || typeStyles.view}`}
        >
            {label}
            {icon && <span className="opacity-70">{icon}</span>}
        </button>
    );
};

export default ActionLink;
