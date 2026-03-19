import React from 'react';

const OrganizationCard = ({ org }) => {
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
    <div className="h-[470px] bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100 overflow-hidden">
      
      {/* Top Image Section */}
      <div className="relative h-[200px] w-full shrink-0 bg-gray-100">
        <img
          src={org.imagery?.profile || org.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'}
          alt={org.name}
          className="w-full h-full object-cover"
        />
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-5 py-5 rounded-[2px] text-[11px] font-bold tracking-wider bg-white shadow-sm
            ${currentStatus === 'ACTIVE' ? 'text-[#2e7d32]' : currentStatus === 'MAINTENANCE' ? 'text-yellow-600' : 'text-red-600'}
          `}>
            {currentStatus}
          </span>
        </div>
      </div>

      {/* Card Body - Added p-6 for uniform padding including the bottom */}
      <div className="p-6 flex-1 flex flex-col !px-5 !py-5 !pb-5">
        
        {/* Header Section */}
        <div>
          <h3 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight !mb-1">
            {org.name}
          </h3>
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1.5 !mb-4">
            {org.industry} • {org.region}
          </p>
        </div>

        {/* Stats Section - Line added here using border-t */}
        <div className="grid grid-cols-3 gap-1 mt-6 border-t border-gray-100 !pt-4 !px-12 !py-14">
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest truncate">
              Sites
            </p>
            <p className="text-[18px] font-bold text-gray-900 mt-0.5">{org.stats?.sites ?? 0}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest truncate">
              Floors
            </p>
            <p className="text-[18px] font-bold text-gray-900 mt-0.5">{org.stats?.floors ?? 0}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest truncate">
              Zones
            </p>
            <p className="text-[18px] font-bold text-gray-900 mt-0.5">{org.stats?.zones ?? 0}</p>
          </div>
        </div>

        {/* Bottom Button matched to Figma (70px height, 16px radius) */}
    <button className=" !mt-auto   w-full py-3 px-4 !pb-2 !pt-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-4 group">

  <span className="text-center leading-tight">
    Select <br /> Organization
  </span>

  <svg
    className="w-5 h-5 text-gray-800 group-hover:translate-x-1 transition-transform"
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
