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

export const generateInventoryForZone = (zoneId = '104', floorRef = 'Floor 1', siteRef = 'North HQ', orgRef = 'Acme Corp') => {
  const seed = parseInt(zoneId.toString().replace(/\D/g, '') || '104');
  const items = [
    { name: "Ergonomic Chair", model: "Herman Miller", type: "Furniture", icon: "chair" },
    { name: "LG Monitor 27\"", model: "Asset Tag: #8892", type: "Peripheral", icon: "monitor" },
    { name: "Cisco Router", model: "Network Infra", type: "Network", icon: "network" },
    { name: "HP LaserJet Pro", model: "Shared Resource", type: "Peripheral", icon: "printer" },
    { name: "Fire Extinguisher A", model: "Type: CO2 Class B", type: "Safety", icon: "safety" },
  ];

  const inventory = [];
  // Use 24 as total to match screenshot
  for (let i = 0; i < 24; i++) {
    const base = items[i % items.length];
    const status = (i + seed) % 7 === 0 || (i + seed) % 8 === 0 ? 'Mismatch' : (i + seed) % 15 === 0 ? 'Pending' : 'Verified';
    
    inventory.push({
      id: `ASSET-${seed}-${(i + 1).toString().padStart(3, '0')}`,
      name: base.name,
      model: base.model,
      type: base.type,
      uniqueId: `${base.name.substring(0, 2).toUpperCase()}-ZN${seed}-${(i + 1).toString().padStart(3, '0')}`,
      status: status,
      lastAudit: i % 3 === 0 ? "Today, 08:20 AM" : "Yesterday, 04:15 PM",
      auditor: i % 3 === 0 ? "AI Bot #4" : "Sarah J.",
      icon: base.icon,
      zoneId: zoneId,
      floor: floorRef,
      site: siteRef,
      org: orgRef
    });
  }
  return inventory;
};

export const generateGlobalInventory = (orgs) => {
  let globalInventory = [];
  orgs.forEach(org => {
     // Generate some sample data for each org to simulate global view
     const orgInventory = generateInventoryForZone(org.id, "Floor 1", "Main Site", org.name);
     globalInventory = [...globalInventory, ...orgInventory];
  });
  return globalInventory;
};
