import { useNavigate, useLocation } from 'react-router-dom';
import { FiEdit2, FiEye, FiShieldOff } from 'react-icons/fi';
import { useFilterStore } from '../../store/useFilterStore';

const OrganizationCard = ({ org, isSiteCard = false, coordinatorContext = null, onEdit, onView, onBlock }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalComputedCoordinators = org.stats?.coordinators || 0;
  const totalComputedSites = org.stats?.sites || 0;
  const totalComputedFloors = org.stats?.floors || 0;
  const coordinatorNames = org.stats?.coordinatorNames || [];

  let siteComputedFloors = org.floors_count || 0;
  let siteComputedZones = org.zones_count || 0;
  let siteComputedAssets = org.inventory_count || 0;

  let currentStatus = org.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

  if (!isSiteCard) {
    if (totalComputedCoordinators === 0) {
      currentStatus = 'PENDING';
    } else if (org.isBlocked) {
      currentStatus = 'BLOCKED';
    } else if (org.lastInventoryAudit) {
      const auditDate = new Date(org.lastInventoryAudit);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      if (auditDate < oneMonthAgo) {
        currentStatus = 'DEACTIVE'; // Has not been audited recently
      }
    }
  }

  const { setOrg, setSite } = useFilterStore();

  const handleManage = (e) => {
    e.stopPropagation(); // Prevents card click
    if (isSiteCard) {
      setSite(org.id);
      const orgId = org.organisation_id || '';
      const orgName = org.organisation_name || location.state?.orgName || new URLSearchParams(location.search).get('org_name') || '';
      const coordName = coordinatorContext?.name || new URLSearchParams(location.search).get('coord') || '';
      const coordId = coordinatorContext?.id || new URLSearchParams(location.search).get('coord_id') || '';
      
      navigate(`/admin/floor-plan?org_id=${orgId}&org_name=${encodeURIComponent(orgName)}&coord_id=${coordId}&coord=${encodeURIComponent(coordName)}&site_id=${org.id}&site=${encodeURIComponent(org.site_name || org.name)}`, {
        state: { site: org, orgName, coordinator: coordinatorContext }
      });
    } else {
      setOrg(org.id);
      // Navigate to coordinators page with specific org filter
      navigate(`/admin/coordinators?org_id=${org.id}&org_name=${encodeURIComponent(org.name)}`, { 
        state: { org, from: 'org_card' } 
      });
    }
  };

  const handleCardClick = () => {
    if (isSiteCard) return;
    onView?.(org);
  };

  return (
    <div
      className={`h-[360px] bg-card rounded-[var(--radius-card)] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col border border-border-main overflow-hidden group/card ${isSiteCard ? 'cursor-default' : 'cursor-pointer'}`}
      onClick={handleCardClick}
    >

      {/* Top Image Section */}
      <div className="relative h-[140px] w-full shrink-0 bg-base overflow-hidden">
        <img
          src={org.imagery?.profile || org.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'}
          alt={org.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
        />
        {/* Status Badge */}
        <div className="absolute top-3.5 left-3.5">
          <span className={`px-2.5 py-0.5 rounded-lg text-[9.5px] font-extrabold tracking-widest shadow-sm uppercase
            ${currentStatus === 'ACTIVE'
              ? 'bg-[#e6f4ea] text-[#137333] border border-[#137333]/20'
              : currentStatus === 'PENDING'
                ? 'bg-amber-50 text-amber-600 border border-amber-600/20'
                : currentStatus === 'BLOCKED'
                  ? 'bg-rose-100 text-rose-600 border border-rose-600/20'
                  : currentStatus === 'MAINTENANCE'
                    ? 'bg-[#fef7e0] text-[#b06000] border border-[#b06000]/20'
                    : 'bg-[#fce8e6] text-[#c5221f] border border-[#c5221f]/20'}
          `}>
            {currentStatus}
          </span>
        </div>

        {/* Action Buttons - Compact Hover */}
        {!isSiteCard && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 translate-y-[-10px] opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit?.(org); }}
              className="w-8 h-8 rounded-lg bg-card shadow-md flex items-center justify-center text-body hover:text-primary transition-all border border-border-main disabled:opacity-50"
              title="Edit Organization"
              disabled={org.isBlocked}
            >
              <FiEdit2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col">

        {/* Header Section */}
        <div>
          <div className="flex items-center justify-between mb-1">
             <span className="text-[8px] font-black text-gray/50 uppercase tracking-[0.2em]">
               {isSiteCard ? 'OPERATIONAL SITE' : 'REGISTERED ORG'}
             </span>
          </div>
          <h3 className="text-lg font-bold text-primary tracking-tight leading-none mb-2 truncate">
            {org.site_name || org.name}
          </h3>

          {isSiteCard ? (
            <div className="space-y-1.5">
              {org.organisation_name && (
                <p className="text-[9px] text-primary/60 font-bold tracking-widest uppercase truncate">
                  {org.organisation_name}
                </p>
              )}
              <div className="flex items-start gap-1.5">
                <svg className="w-3 h-3 text-gray shrink-0 relative top-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-[11px] text-secondary font-medium leading-tight line-clamp-1">
                  {org.address}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-[9px] text-gray font-bold tracking-widest uppercase opacity-80 mt-1">
              {org.industry} • {org.region}
            </p>
          )}

          {coordinatorNames.length > 0 && !isSiteCard && (
            <div className="flex flex-wrap gap-1 mt-3">
              {coordinatorNames.slice(0, 2).map((name, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-primary/5 text-primary text-[8px] font-black rounded uppercase border border-primary/10">
                  {name}
                </span>
              ))}
              {coordinatorNames.length > 2 && (
                <span className="text-[8px] font-bold text-gray/60 flex items-center pl-1">
                  +{coordinatorNames.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <div className="flex flex-col">
            <p className="text-[7.5px] text-gray uppercase font-bold tracking-wider mb-1 opacity-70">
              {isSiteCard ? 'FLOORS' : 'COORDS'}
            </p>
            <p className="text-[15px] font-bold text-title leading-none">
              {isSiteCard ? siteComputedFloors : totalComputedCoordinators}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-[7.5px] text-gray uppercase font-bold tracking-wider mb-1 opacity-70">
              {isSiteCard ? 'ZONES' : 'SITES'}
            </p>
            <p className="text-[15px] font-bold text-title leading-none">
              {isSiteCard ? siteComputedZones : (
                org.plannedSites > 0 ? `${totalComputedSites}/${org.plannedSites}` : totalComputedSites
              )}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-[7.5px] text-gray uppercase font-bold tracking-wider mb-1 opacity-70">
              {isSiteCard ? 'ASSETS' : 'FLOORS'}
            </p>
            <p className="text-[15px] font-bold text-title leading-none">
              {isSiteCard ? siteComputedAssets.toLocaleString() : totalComputedFloors}
            </p>
          </div>
        </div>

        {/* Bottom Button */}
        <button
          onClick={handleManage}
          className="mt-auto w-full py-2 px-3 bg-base border border-border-main rounded-lg text-[11px] font-bold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2 group">
          <span>
            {isSiteCard ? 'View Floors' : 'Manage Org'}
          </span>
          <svg
            className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

      </div>
    </div>
  );
};

export default OrganizationCard;
