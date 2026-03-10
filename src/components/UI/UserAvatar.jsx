import React from 'react';

const UserAvatar = ({ name, size = "40px", fontSize = "14px" }) => {
    const getInitials = (name) => {
        if (!name) return "??";
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const getGradient = (name) => {
        const colors = [
            'from-[#6366F1] to-[#A855F7]', // Indigo to Purple
            'from-[#3B82F6] to-[#2DD4BF]', // Blue to Teal
            'from-[#F43F5E] to-[#FB923C]', // Rose to Orange
            'from-[#10B981] to-[#3B82F6]', // Emerald to Blue
            'from-[#F59E0B] to-[#D946EF]', // Amber to Fuchsia
        ];
        
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div 
            className={`flex items-center justify-center rounded-full bg-gradient-to-br ${getGradient(name)} text-white font-bold shadow-sm shrink-0`}
            style={{ width: size, height: size, fontSize: fontSize }}
        >
            {getInitials(name)}
        </div>
    );
};

export default UserAvatar;
