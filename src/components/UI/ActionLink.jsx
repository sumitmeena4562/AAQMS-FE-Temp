import React from 'react';

const ActionLink = ({ label, icon, onClick, type = 'edit' }) => {
    const typeStyles = {
        edit: 'text-[#3B82F6] hover:text-blue-700',
        delete: 'text-red-500 hover:text-red-700',
        view: 'text-gray-500 hover:text-gray-700'
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${typeStyles[type] || typeStyles.view}`}
        >
            {label}
            {icon && <span className="flex items-center">{icon}</span>}
        </button>
    );
};

export default ActionLink;
