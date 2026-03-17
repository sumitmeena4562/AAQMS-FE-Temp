import { useNavigate } from 'react-router-dom';

const OrganizationCard = ({ org }) => {
  const navigate = useNavigate();

  // Logic to determine active/deactive status based on last inventory audit
  const getStatus = () => {
    if (org.lastInventoryAudit) {
      const auditDate = new Date(org.lastInventoryAudit);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      // If audit is older than 1 month, it's DEACTIVE
      if (auditDate < oneMonthAgo) {
        return 'DEACTIVE';
      }
      return 'ACTIVE';
    }
    return org.status || 'ACTIVE'; // Fallback
  };

  const currentStatus = getStatus();

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
          <span className={`px-1.5 py-1.5 rounded-[6px] text-[10px] font-bold tracking-widest bg-white shadow-sm uppercase
            ${currentStatus === 'ACTIVE' ? 'text-[#0f9d58]' : currentStatus === 'MAINTENANCE' ? 'text-[#d48806]' : 'text-[#dc2626]'}
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
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
            {org.industry} • {org.region}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-2 mt-8">
          <div className="flex flex-col">
            <p className="text-[9px] text-gray-400 uppercase tracking-wider truncate mb-1">
              COORDINATORS
            </p>
            <p className="text-[18px] font-bold text-gray-900 leading-none">
              {org.coordinators ?? (org.stats?.sites ? Math.max(1, Math.floor(org.stats.sites / 2)) : 0)}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-[9px] text-gray-400 uppercase tracking-wider truncate mb-1">
              TOTAL SITES
            </p>
            <p className="text-[18px] font-bold text-gray-900 leading-none">
              {org.stats?.sites ?? 0}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-[9px] text-gray-400 uppercase tracking-wider truncate mb-1">
              FLOORS
            </p>
            <p className="text-[18px] font-bold text-gray-900 leading-none">
              {org.stats?.floors ?? 0}
            </p>
          </div>
        </div>

        {/* Bottom Button */}
        <button
          onClick={() => navigate('/admin/coordinators')}
          className="mt-auto w-full py-3.5 px-5 border border-gray-200 rounded-[14px] text-[13px] font-semibold text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-between group">
          <span>
            Select Organization
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
