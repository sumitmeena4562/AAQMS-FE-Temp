import { useNavigate, useLocation } from 'react-router-dom';
import useUserStore from '../../store/userStore';
import { generateSitePlansForCoordinator } from '../../utils/mockSiteData';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const OrganizationCard = ({ org, isSiteCard = false, coordinatorContext = null, onEdit, onDelete, onView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const users = useUserStore(state => state.users);

  // Derive coordinators exactly as stored in User Management: 
  // users mapping to this organization
  const orgCoordinators = users.filter(u => 
    (u.organization || "").trim().toLowerCase() === (org.name || "").trim().toLowerCase() && 
    u.role === 'Coordinator'
  );

  let totalComputedSites = 0;
  let totalComputedFloors = 0;

  if (!isSiteCard) {
    if (orgCoordinators.length > 0) {
      orgCoordinators.forEach(coord => {
        const plans = generateSitePlansForCoordinator(coord.id);
        totalComputedSites += plans.length;
        totalComputedFloors += plans.reduce((acc, p) => acc + p.stats.floors, 0);
      });
    } else {
      // Fallback to static stats if no coordinators assigned yet
      totalComputedSites = org.stats?.sites || 0;
      totalComputedFloors = org.stats?.floors || 0;
    }
  }

  let currentStatus = org.status || 'ACTIVE';

  if (!isSiteCard) {
    if (org.lastInventoryAudit) {
      const auditDate = new Date(org.lastInventoryAudit);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      // If audit is older than 1 month, it's DEACTIVE
      if (auditDate < oneMonthAgo) {
        currentStatus = 'DEACTIVE';
      }
    }
  }

  const handleAction = (e) => {
    if (e) e.stopPropagation();
    if (isSiteCard) {
      const currentOrg = location.state?.orgName || new URLSearchParams(location.search).get('org') || '';
      const coordName = coordinatorContext?.name || new URLSearchParams(location.search).get('coord') || '';
      navigate(`/admin/floor-plan?org=${encodeURIComponent(currentOrg)}&coord=${encodeURIComponent(coordName)}&site=${encodeURIComponent(org.name)}`, { 
        state: { site: org, orgName: currentOrg, coordinator: coordinatorContext } 
      });
    } else {
      // Instead of navigating, open the view modal
      onView?.(org);
    }
  };

  return (
    <div 
      className={`h-[360px] bg-card rounded-[var(--radius-card)] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col border border-border-main overflow-hidden group/card ${isSiteCard ? 'cursor-default' : 'cursor-pointer'}`}
      onClick={handleAction}
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
              className="w-6 h-6 rounded-lg bg-card shadow-md flex items-center justify-center text-body hover:text-primary transition-all border border-border-main"
              title="Edit Organization"
            >
              <FiEdit2 size={11} />
            </button>
            {/* <button
              onClick={(e) => { e.stopPropagation(); onDelete?.(org.id); }}
              className="w-6 h-6 rounded-lg bg-white shadow-md flex items-center justify-center text-slate-500 hover:text-red-500 transition-all border border-slate-100"
              title="Delete Organization"
            >
              <FiTrash2 size={11} />
            </button> */}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col">

        {/* Header Section */}
        <div>
          <h3 className="text-lg font-bold text-primary tracking-tight leading-none mb-2 truncate">
            {org.name}
          </h3>

          {isSiteCard ? (
            <div className="flex items-start gap-1.5 mt-1.5">
              <svg className="w-3 h-3 text-gray shrink-0 relative top-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-[11px] text-secondary font-medium leading-tight line-clamp-2">
                {org.address}
              </p>
            </div>
          ) : (
            <p className="text-[9px] text-gray font-bold tracking-widest uppercase opacity-80">
              {org.industry} • {org.region}
            </p>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <div className="flex flex-col">
            <p className="text-[7.5px] text-gray uppercase font-bold tracking-wider mb-1 opacity-70">
              {isSiteCard ? 'FLOORS' : 'COORDS'}
            </p>
            <p className="text-[15px] font-bold text-title leading-none">
              {isSiteCard ? org.stats?.floors || 0 : orgCoordinators.length}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-[7.5px] text-gray uppercase font-bold tracking-wider mb-1 opacity-70">
              {isSiteCard ? 'ZONES' : 'SITES'}
            </p>
            <p className="text-[15px] font-bold text-title leading-none">
              {isSiteCard ? org.stats?.zones || 0 : totalComputedSites}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-[7.5px] text-gray uppercase font-bold tracking-wider mb-1 opacity-70">
              {isSiteCard ? 'ASSETS' : 'FLOORS'}
            </p>
            <p className="text-[15px] font-bold text-title leading-none">
              {isSiteCard ? (org.stats?.assets || 0).toLocaleString() : totalComputedFloors}
            </p>
          </div>
        </div>

        {/* Bottom Button */}
        <button
          onClick={handleAction}
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
