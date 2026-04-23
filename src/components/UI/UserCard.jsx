import React from 'react';
import { FiEdit2, FiExternalLink, FiCheckCircle, FiClock, FiActivity, FiUserCheck, FiTarget } from 'react-icons/fi';
import UserAvatar from './UserAvatar';
import Badge from './Badge';
import DotStatus from './DotStatus';

const UserCard = React.memo(({ user, isSelected, onSelect, onEdit, onView, selectable }) => {
  const isActive = user?.status?.toLowerCase() === 'active' || user?.is_active === true;
  
  const rawRole = (user?.role?.role_name || user?.role_name || (typeof user?.role === 'string' ? user.role : '') || '').toLowerCase();
  
  const getValid = (val) => (!val || val === 'N/A' || val === 'not_provided') ? null : val;

  const orgName = getValid(user?.org_name) || getValid(user?.organisation_name) || getValid(user?.organization) || 'Unassigned';
  const regionName = getValid(user?.assigned_region) || getValid(user?.region) || getValid(user?.site_name) || 'No Region';
  const zoneName = getValid(user?.zone_name) || getValid(user?.zone) || 'No Zone';
  
  const isAssigned = orgName !== 'Unassigned';

  const isFieldOfficer = rawRole.includes('field_officer') || rawRole.includes('fieldofficer');

  const roleLabel = rawRole.includes('admin') ? 'Admin' 
    : rawRole.includes('coordinator') ? 'Coordinator' 
    : isFieldOfficer ? 'Field Officer' 
    : (rawRole || 'Unknown Role').toUpperCase();

  const roleColor = rawRole.includes('admin') ? 'admin' 
    : rawRole.includes('coordinator') ? 'coordinator' 
    : isFieldOfficer ? 'fieldOfficer' 
    : 'neutral';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr.split('T')[0];
        return d.toLocaleDateString();
    } catch {
        return dateStr;
    }
  };

  const displayDate = formatDate(user?.created_at);
  const displayLogin = formatDate(user?.last_login) === 'N/A' ? 'Never' : formatDate(user?.last_login);

  return (
    <div 
      className={`h-[400px] elite-card elite-card-hover flex flex-col overflow-hidden group/card
        ${isSelected ? '!border-primary ring-1 ring-primary/20 bg-primary/[0.01]' : ''}
      `}
      onClick={() => selectable ? onSelect?.(user.id) : onView?.(user)}
    >
      {/* 1. Header Section */}
      <div className="relative h-[90px] w-full shrink-0 bg-base overflow-hidden">
        <div className={`absolute inset-0 opacity-15 bg-gradient-to-br transition-all duration-500 group-hover/card:scale-110 
            ${isActive ? 'from-[var(--color-success)] to-[var(--color-primary)]' : 'from-[var(--color-gray)] to-[var(--color-title)]'}
        `} />
        
        {selectable && (
          <div className="absolute top-3 left-3 z-10">
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
              isSelected ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white/90 border-border-main backdrop-blur-sm'
            }`}>
              {isSelected && <FiCheckCircle size={14} strokeWidth={3} />}
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <Badge 
            variant="light" 
            color={isActive ? 'success' : 'neutral'}
            className="!text-[9px] !px-2 !py-0.5 !font-black !uppercase !tracking-widest"
          >
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      {/* 2. Avatar Overlay */}
      <div className="relative -mt-10 px-4 flex items-end justify-between">
        <div className="relative">
          <UserAvatar 
            name={user?.name || 'U'} 
            avatar={user?.avatar} 
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
            className="w-8 h-8 flex items-center justify-center text-gray hover:text-white hover:bg-[var(--color-hover-blue)] hover:border-[var(--color-hover-blue)] transition-all rounded-xl border border-border-main bg-card shadow-sm"
          >
            <FiEdit2 size={13} />
          </button>
        </div>
      </div>

      {/* 3. Card Body */}
      <div className="p-4 flex-1 flex flex-col min-h-0">
        <div>
          <div className="mb-1 min-h-[44px]">
            <h3 className="text-base font-bold text-title tracking-tight leading-tight line-clamp-2 break-all" title={user?.name}>
              {user?.name || 'Unnamed User'}
            </h3>
          </div>
          <p className="text-[10px] font-bold text-gray truncate uppercase tracking-widest opacity-80 mb-3" title={user?.email}>
            {user?.email || 'No Email'}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="solid" color={roleColor} className="!text-[9px] !px-2 !py-0.5 !font-black !uppercase">
              {roleLabel}
            </Badge>
            <Badge variant="light" color={isAssigned ? 'success' : 'neutral'} className="!text-[9px] !px-2 !py-0.5 !font-black !uppercase">
              {isAssigned ? 'Assigned' : 'Standby'}
            </Badge>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border-main/40 border-dashed">
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-black text-gray/60 uppercase tracking-widest mb-1.5 leading-none">
                {isFieldOfficer ? 'Org & Zone' : 'Org & Region'}
            </span>
            <div className="flex flex-col gap-0.5">
                <p className="text-[11px] font-bold text-body truncate" title={orgName}>{orgName}</p>
                <p className="text-[10px] font-medium text-gray/80 truncate" title={isFieldOfficer ? zoneName : regionName}>
                    {isFieldOfficer ? zoneName : regionName}
                </p>
            </div>
          </div>
          <div className="flex flex-col items-end text-right min-w-0 border-l border-border-main/20 pl-4">
            <span className="text-[9px] font-black text-gray/60 uppercase tracking-widest mb-1.5 leading-none">Activity</span>
            <div className="flex flex-col gap-0.5 items-end">
                <p className="text-[11px] font-bold text-body">{displayLogin}</p>
                <p className="text-[10px] font-medium text-gray/80">Joined {displayDate}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onView?.(user); }}
          className="mt-auto w-full py-2.5 px-4 bg-base border border-border-main rounded-xl text-[10.5px] font-bold text-primary uppercase tracking-widest hover:bg-[var(--color-hover-blue)] hover:text-white hover:border-[var(--color-hover-blue)] transition-all flex items-center justify-center gap-2 group/btn"
        >
          <FiExternalLink size={13} />
          <span>Full Profile</span>
        </button>
      </div>
    </div>
  );
});

export default UserCard;
