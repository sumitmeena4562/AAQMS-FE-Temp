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

export const generateFloorsForSite = (site) => {
  // Defensive check for missing stats (prevents crash on page refresh/direct nav)
  const { floors = 1, zones = 1, assets = 10 } = site?.stats || { 
    floors: 1, 
    zones: 1, 
    assets: 10 
  };
  
  const generatedFloors = [];
  let remainingZones = zones;
  let remainingAssets = assets;
  
  for (let i = 0; i < floors; i++) {
    const isGround = i === 0;
    const isLast = i === floors - 1;
    
    // Distribute remaining roughly equally
    let fZones = isLast ? remainingZones : Math.max(1, Math.floor(zones / floors));
    let fAssets = isLast ? remainingAssets : Math.max(1, Math.floor(assets / floors));

    // Slight variance
    if (!isLast && floors > 1) {
      const vZ = Math.floor(Math.random() * 2) - 1; // -1 to 0 variance
      const vA = Math.floor(Math.random() * 20) - 10;
      fZones = Math.max(1, fZones + vZ);
      fAssets = Math.max(1, fAssets + vA);
    }
    
    remainingZones -= fZones;
    remainingAssets -= fAssets;
    
    generatedFloors.push({
      id: `${site.id}-FL${i}`,
      level: isGround ? 'G' : `L${i}`,
      name: isGround ? 'Ground Floor' : `Level ${i}`,
      description: isGround ? 'Reception, Lobby & Core Systems' : `Executive Suites, Offices & Workspaces`,
      status: 'ACTIVE',
      stats: {
        zones: fZones,
        assets: fAssets
      }
    });
  }
  
  return generatedFloors;
};

export const generateGlobalInventory = (orgs) => {
    const assets = [];
    const count = 30; // Clean, manageable count
    const ASSET_TYPES = ['Furniture', 'Electronics', 'Network', 'Safety'];
    
    for (let i = 0; i < count; i++) {
        const org = orgs[i % orgs.length]?.name || 'Unknown Org';
        const type = ASSET_TYPES[i % ASSET_TYPES.length];
        const status = i % 10 === 0 ? 'Mismatch' : i % 7 === 0 ? 'Pending' : 'Verified';
        
        // Define meaningful name and icon based on type
        let name = "";
        let icon = "box";

        if (type === 'Furniture') {
            name = `${['Ergonomic', 'Mesh', 'Office'][i % 3]} Chair`;
            icon = 'chair';
        } else if (type === 'Electronics') {
            const device = i % 4 === 0 ? 'Printer' : i % 2 === 0 ? 'Monitor' : 'UPS';
            name = `${['Dell', 'HP', 'Samsung'][i % 3]} ${device}`;
            icon = device.toLowerCase();
        } else if (type === 'Network') {
            const device = i % 2 === 0 ? 'Router' : 'Switch';
            name = `Cisco ${device} Pro`;
            icon = 'network';
        } else {
            name = `Fire Extinguisher S${i + 1}`;
            icon = 'safety';
        }

        assets.push({
            id: i + 1,
            uniqueId: `ASSET-${2000 + i}`,
            name: name,
            type: type,
            model: `V${i + 1} Edition`,
            status: status,
            org: org,
            floor: `Floor ${Math.floor(i / 10) + 1}`,
            zone: `Zone ${(i % 3) + 1}`,
            lastAudit: `2024-03-${10 + (i % 10)}`,
            icon: icon
        });
    }
    return assets;
};
