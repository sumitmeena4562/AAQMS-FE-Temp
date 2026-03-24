export const generateSitePlansForCoordinator = (userId, userOrg = "") => {
  const seed = typeof userId === 'string' ? parseInt(userId.replace(/\D/g, '') || '1') : (userId || 1);
  
  // 🔹 FIX: Hardcoded Data Alignment
  // Ensure we output precisely what the Organization Stats say. Unassigned users get 0.
  let numSites = 0;
  let orgName = userOrg;

  if (seed === 2) { numSites = 5; orgName = "SSISM"; } // David Kim
  else if (seed === 3) { numSites = 12; orgName = "Globex"; } // Elena 
  else if (seed === 5) { numSites = 8; orgName = "TechCore"; } // Aisha
  // All others (Sarah, Marcus, etc) are unassigned or have 0 sites.

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
  if (numSites === 0) return plans;

  for (let i = 0; i < numSites; i++) {
    const base = bases[i % bases.length];
    
    // Completely mathematical and deterministic based on index, zero randomness
    const dFloors = base.baseFloors + (i % 2);
    const dZones = base.baseZones + (i % 3);
    
    plans.push({
      id: `SITE-${seed}-${i+1}`,
      name: `${base.name} ${i+1}`,
      address: base.address,
      status: "ACTIVE",
      image: base.image,
      stats: {
        floors: dFloors,
        zones: dZones,
        assets: dZones * 25
      }
    });
  }

  return plans;
}

export const generateFloorsForSite = (site) => {
  // 🔹 FIX: Reverse-Engineering Deterministic Fallback 
  // If a user clicks Breadcrumbs or Refreshes the page, location.state drops the 'site.stats' memory.
  // We reconstruct it EXACTLY by analyzing the numbering suffix in the site.name!
  let floors = 1;
  let zones = 1;
  let assets = 10;

  if (site?.stats && site.stats.floors) {
      floors = site.stats.floors;
      zones = site.stats.zones;
      assets = site.stats.assets;
  } else if (site?.name) {
      const match = site.name.match(/(\d+)$/);
      if (match) {
          const num = parseInt(match[1]);
          const i = num - 1;
          const bases = [
            { baseFloors: 4, baseZones: 12 },
            { baseFloors: 2, baseZones: 8 },
            { baseFloors: 5, baseZones: 20 },
            { baseFloors: 3, baseZones: 15 }
          ];
          const base = bases[i % bases.length];
          floors = base.baseFloors + (i % 2);
          zones = base.baseZones + (i % 3);
          assets = zones * 25;
      }
  }
  
  const generatedFloors = [];
  let remainingZones = zones;
  let remainingAssets = assets;
  
  for (let i = 0; i < floors; i++) {
    const isGround = i === 0;
    const isLast = i === floors - 1;
    
    // Distribute remaining equally (NO MATH.RANDOM ALLOWED)
    let fZones = isLast ? remainingZones : Math.max(1, Math.floor(zones / floors));
    let fAssets = isLast ? remainingAssets : Math.max(1, Math.floor(assets / floors));

    // Stable variance using strict math logic based on index
    if (!isLast && floors > 1) {
      const vZ = (i % 2 === 0) ? 1 : 0; 
      const vA = (i % 2 === 0) ? -10 : 15;
      fZones = Math.max(1, fZones + vZ);
      fAssets = Math.max(1, fAssets + vA);
    }
    
    remainingZones -= fZones;
    remainingAssets -= fAssets;
    
    generatedFloors.push({
      id: `${site.id || 'SITE'}-FL${i}`,
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
