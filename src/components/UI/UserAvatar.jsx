import React, { useState, useEffect } from 'react';
import { t } from '../../theme/theme';

const UserAvatar = ({ name, avatar, size = "40px", fontSize = "14px", className = "" }) => {
    const [imgError, setImgError] = useState(false);

    // Reset error state if avatar prop changes
    useEffect(() => {
        setImgError(false);
    }, [avatar]);

    const getInitials = (name) => {
        if (!name) return "??";
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const getGradientStyle = (name) => {
        const gradients = t.color.avatarGradients;
        
        const nameKey = name || "unknown";
        let hash = 0;
        for (let i = 0; i < nameKey.length; i++) {
            hash = nameKey.charCodeAt(i) + ((hash << 5) - hash);
        }
        const [from, to] = gradients[Math.abs(hash) % gradients.length];
        return { background: `linear-gradient(135deg, ${from}, ${to})` };
    };

    return (
        <div 
            className={`flex items-center justify-center rounded-full text-white font-bold shadow-sm shrink-0 overflow-hidden ${className}`}
            style={{ width: size, height: size, fontSize: fontSize, ...getGradientStyle(name) }}
        >
            {avatar && !imgError ? (
                <img 
                    src={avatar} 
                    alt={name} 
                    className="w-full h-full object-cover" 
                    onError={() => setImgError(true)} 
                />
            ) : (
                getInitials(name)
            )}
        </div>
    );
};

export default UserAvatar;
