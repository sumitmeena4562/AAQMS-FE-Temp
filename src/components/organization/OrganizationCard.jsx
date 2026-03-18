import { useNavigate, useLocation } from 'react-router-dom';
import useUserStore from '../../store/userStore';
import { generateSitePlansForCoordinator } from '../../utils/mockSiteData';

const OrganizationCard = ({ org, isSiteCard = false, coordinatorContext = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const users = useUserStore(state => state.users);

  // Derive coordinators exactly as stored in User Management: 
  // users mapping to this organization
  const orgCoordinators = users.filter(u => u.organization === org.name && u.role === 'Coordinator');

  let totalComputedSites = 0;
  let totalComputedFloors = 0;

  if (!isSiteCard) {
    orgCoordinators.forEach(coord => {
      const plans = generateSitePlansForCoordinator(coord.id);
      totalComputedSites += plans.length;
      totalComputedFloors += plans.reduce((acc, p) => acc + p.stats.floors, 0);
    });
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

  const handleAction = () => {
    if (isSiteCard) {
      navigate('/admin/floor-plan', { state: { site: org, orgName: location.state?.orgName, coordinator: coordinatorContext } });
    } else {
      navigate('/admin/coordinators', { state: { org } });
    }
  };

  return (
    <div className="h-[460px] bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col border border-gray-100 overflow-hidden">

      {/* Top Image Section */}
      <div className="relative h-[220px] w-full shrink-0 bg-gray-100">
        <img
          src={org.imagery?.profile || org.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'}
          alt={org.name}
          className="w-full h-full object-cover"
        />
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-2.5 py-1.5 rounded-[6px] text-[10px] font-bold tracking-widest shadow-sm uppercase
            ${currentStatus === 'ACTIVE'
              ? 'bg-[#e6f4ea] text-[#137333] border border-[#137333]/20'
              : currentStatus === 'MAINTENANCE'
                ? 'bg-[#fef7e0] text-[#b06000] border border-[#b06000]/20'
                : 'bg-[#fce8e6] text-[#c5221f] border border-[#c5221f]/20'}
          `}>
            {currentStatus}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col">

        {/* Header Section */}
        <div>
          <h3 className="text-[20px] font-bold text-gray-900 tracking-tight leading-none mb-2">
            {org.name}
          </h3>

          {isSiteCard ? (
            <div className="flex items-start gap-1.5 mt-2">
              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0 relative top-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-[12px] text-gray-400 font-medium leading-tight">
                {org.address}
              </p>
            </div>
          ) : (
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
              {org.industry} • {org.region}
            </p>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-2 mt-8">
          <div className="flex flex-col">
            <p className="text-[9px] text-gray-400 uppercase tracking-wider truncate mb-1">
              {isSiteCard ? 'FLOOR PLANS' : 'COORDINATORS'}
            </p>
            <p className="text-[18px] font-bold text-gray-900 leading-none">
              {isSiteCard ? org.stats?.floors || 0 : orgCoordinators.length}
              {isSiteCard && <span className="text-[14px] ml-1 font-semibold text-gray-900">Floors</span>}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-[9px] text-gray-400 uppercase tracking-wider truncate mb-1">
              {isSiteCard ? 'ZONE PLANS' : 'TOTAL SITES'}
            </p>
            <p className="text-[18px] font-bold text-gray-900 leading-none">
              {isSiteCard ? org.stats?.zones || 0 : totalComputedSites}
              {isSiteCard && <span className="text-[14px] ml-1 font-semibold text-gray-900">Zone</span>}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-[9px] text-gray-400 uppercase tracking-wider truncate mb-1">
              {isSiteCard ? 'TOTAL ASSETS' : 'FLOORS'}
            </p>
            <p className="text-[18px] font-bold text-gray-900 leading-none">
              {isSiteCard ? (org.stats?.assets || 0).toLocaleString() : totalComputedFloors}
              {isSiteCard && <span className="text-[14px] ml-1 font-semibold text-gray-900">Items</span>}
            </p>
          </div>
        </div>

        {/* Bottom Button */}
        <button
          onClick={handleAction}
          className="mt-auto w-full py-4.5 px-5 border border-gray-200 rounded-[14px] text-[13px] font-semibold text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2 group">
          <span>
            {isSiteCard ? 'View Floor Plans' : 'Select Organization'}
          </span>
          <svg
            className="w-4 h-4 text-gray-800 group-hover:translate-x-1 transition-transform"
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
