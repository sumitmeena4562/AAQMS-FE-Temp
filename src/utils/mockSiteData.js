export const generateSitePlansForCoordinator = (userId) => {
  const seed = typeof userId === 'string' ? parseInt(userId.replace(/\D/g, '') || '1') : (userId || 1);
  const numSites = (seed % 3) + 2; // 2 to 4 sites

  const bases = [
    {
      name: "North HQ Complex",
      address: "123 Industrial Way, Sector 7, Tech District",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
      baseZones: 12,
      baseFloors: 4,
      baseAssets: 240
    },
    {
      name: "West Production Plant",
      address: "890 Logistics Blvd, Manufacturing Zone",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
      baseZones: 8,
      baseFloors: 2,
      baseAssets: 850
    },
    {
      name: "East Warehouse Depot",
      address: "770 Freight Road, Distribution Center",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop",
      baseZones: 20,
      baseFloors: 5,
      baseAssets: 4500
    },
    {
      name: "South Central Hub",
      address: "442 Innovation Drive, South Park",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop",
      baseZones: 15,
      baseFloors: 3,
      baseAssets: 1200
    }
  ];

  const plans = [];
  for (let i = 0; i < numSites; i++) {
    const base = bases[(seed + i) % bases.length];
    plans.push({
      id: `SITE-${seed}-${i+1}`,
      name: base.name,
      address: base.address,
      status: "ACTIVE",
      image: base.image,
      stats: {
        floors: base.baseFloors + (seed % 3),
        zones: base.baseZones + (seed % 5),
        assets: base.baseAssets + (seed * 10)
      }
    });
  }

  return plans;
}

export const generateGlobalInventory = (orgs) => {
  let globalInventory = [];
  const types = ['Furniture', 'Network', 'IT Asset', 'Stationery', 'Safety'];
  
  orgs.forEach((org, orgIdx) => {
     // Generate data for 4 floors per org
     const numFloors = 4; 
     for (let f = 1; f <= numFloors; f++) {
        const floorName = `Floor ${f}`;
        // Generate for 8 zones per floor
        const numZones = 8;
        for (let z = 1; z <= numZones; z++) {
            const zoneId = (orgIdx + 1) * 100 + (f * 10) + z;
            // Generate some assets for each zone manually instead of using generateInventoryForZone to have more random statuses
            const numAssets = Math.floor(Math.random() * 3) + 2; // 2 to 4 assets
            for (let i = 0; i < numAssets; i++) {
                const type = types[Math.floor(Math.random() * types.length)];
                const status = Math.random() > 0.8 ? 'Mismatch' : Math.random() > 0.6 ? 'Pending' : 'Verified';
                const id = `AST-${org.name.substring(0, 2).toUpperCase()}-${zoneId}-${Math.floor(1000 + Math.random() * 9000)}`;
                
                globalInventory.push({
                    id: id,
                    uniqueId: id,
                    name: `${type} ${i + 1}`,
                    model: `${type === 'IT Asset' ? 'Dell Latitude' : type === 'Furniture' ? 'Ergonomic Chair' : 'Standard ' + type}`,
                    type: type,
                    icon: type.toLowerCase() === 'it asset' ? 'monitor' : type.toLowerCase(),
                    org: org.name,
                    site: org.sites?.[0]?.name || 'Main Campus',
                    floor: floorName,
                    zoneId: zoneId.toString(),
                    status: status,
                    lastAudit: `2024-03-${Math.floor(Math.random() * 20) + 10}`,
                    auditor: ['Nilesh G.', 'Sumit S.', 'AI System'][Math.floor(Math.random() * 3)],
                    qr: "QR_DATA_MOCK"
                });
            }
        }
     }
  });
  return globalInventory;
};
