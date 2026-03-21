import React from 'react';
import { FiEdit2, FiExternalLink, FiCheckCircle, FiClock, FiActivity, FiUserCheck, FiTarget } from 'react-icons/fi';
import UserAvatar from './UserAvatar';
import Badge from './Badge';
import DotStatus from './DotStatus';

const UserCard = ({ user, isSelected, onSelect, onEdit, onView, selectable }) => {
  const isBanned = user.status === 'banned';
  const isActive = user.status === 'active';
  const isAssigned = user.assignment === 'assigned';

  // Calculate Tenure (Days since createdAt)
  const createdDate = new Date(user.createdAt || '2024-01-01');
  const diffDays = Math.ceil(Math.abs(new Date() - createdDate) / (1000 * 60 * 60 * 24));

  return (
    <div 
      className={`h-[360px] bg-card rounded-[var(--radius-card)] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col border overflow-hidden group/card
        ${isSelected ? 'border-primary ring-1 ring-primary/20 bg-primary/[0.01]' : 'border-border-main/60 hover:border-border-main'}
      `}
      onClick={() => selectable ? onSelect?.(user.id) : onView?.(user)}
    >
      {/* 1. Header Section — Global Theme Integration */}
      <div className="relative h-[90px] w-full shrink-0 bg-base overflow-hidden">
        {/* Using Theme-Mapped Gradients */}
        <div className={`absolute inset-0 opacity-15 bg-gradient-to-br transition-all duration-500 group-hover/card:scale-110 
            ${isActive ? 'from-[var(--color-success)] to-[var(--color-primary)]' : 'from-[var(--color-gray)] to-[var(--color-title)]'}
        `} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
        
        {/* Selection Checkbox — Styled via Theme */}
        {selectable && (
          <div className="absolute top-3 left-3 z-10">
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
              isSelected ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white/90 border-border-main backdrop-blur-sm'
            }`}>
              {isSelected && <FiCheckCircle size={14} strokeWidth={3} />}
            </div>
          </div>
        )}

        {/* Status Badge (Top Right) — Fully Theme Mapped */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant="light" 
            color={isActive ? 'success' : isBanned ? 'danger' : 'neutral'}
            className="!text-[9px] !px-2 !py-0.5 !font-black !uppercase !tracking-widest"
          >
            {user.status}
          </Badge>
        </div>
      </div>

      {/* 2. Avatar Overlay — Overlaps Header and Body */}
      <div className="relative -mt-10 px-4 flex items-end justify-between">
        <div className="relative">
          <UserAvatar 
            name={user.name} 
            avatar={user.avatar} 
            size="72px" 
            className="shadow-xl border-4 border-card ring-1 ring-border-main/20"
          />
          <div className="absolute bottom-1 right-1">
            <DotStatus status={isActive ? 'active' : 'inactive'} className="ring-4 ring-card" />
          </div>
        </div>
        
        <div className="flex flex-col items-end pb-1 translate-y-2 opacity-0 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300">
           <button 
            onClick={(e) => { e.stopPropagation(); onEdit?.(user); }}
            className="w-8 h-8 flex items-center justify-center text-gray hover:text-white hover:bg-primary transition-all rounded-xl border border-border-main bg-card shadow-sm"
            title="Edit User"
          >
            <FiEdit2 size={13} />
          </button>
        </div>
      </div>

      {/* 3. Card Information Section — Just the Essentials */}
      <div className="p-4 pt-3 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-base font-black text-title tracking-tight leading-none mb-1.5 truncate pr-8" title={user.name}>
            {user.name}
          </h3>
          <p className="text-[10px] font-bold text-gray truncate uppercase tracking-widest opacity-80 mb-3">
            {user.email}
          </p>
          <div className="flex items-center gap-1.5">
            <Badge 
                variant="solid" 
                color={user.role === 'Coordinator' ? 'coordinator' : user.role === 'Admin' ? 'admin' : 'fieldOfficer'}
                className="!text-[8px] !px-1.5 !py-0.5 !font-black !uppercase !tracking-widest"
            >
              {user.role}
            </Badge>
            <Badge 
                variant="light" 
                color={isAssigned ? 'success' : 'neutral'}
                className="!text-[8px] !px-1.5 !py-0.5 !font-black !uppercase !tracking-widest"
            >
              {isAssigned ? 'Assigned' : 'Standby'}
            </Badge>
          </div>
        </div>

        {/* 2-Column Info Grid — Proper Profile Data */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border-main/30 border-dashed">
          <div className="flex flex-col">
            <span className="text-[7.5px] font-black text-gray/60 uppercase tracking-widest mb-1 leading-none">Organization & Zone</span>
            <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-black text-body truncate">{user.organization || 'Freelance'}</span>
                <span className="text-[9px] font-bold text-gray/80 truncate">{user.region || 'No Zone'}</span>
            </div>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="text-[7.5px] font-black text-gray/60 uppercase tracking-widest mb-1 leading-none">Activity & Joined</span>
            <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-black text-body truncate">{user.lastActive || 'Never'}</span>
                <span className="text-[9px] font-bold text-gray/80 truncate">Joined {user.createdAt || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* 4. Full-Width Footer Action */}
        <button 
          onClick={(e) => { e.stopPropagation(); onView?.(user); }}
          className="mt-auto w-full py-2.5 px-4 bg-base border border-border-main rounded-xl text-[10.5px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2 group/btn"
        >
          <FiExternalLink className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" size={13} />
          <span>Full Profile</span>
        </button>
      </div>
    </div>
  );
};

export default UserCard;
