export const organizations = [
  { id: "1", name: "Acme Corp" },
  { id: "2", name: "Global Logistics" },
  { id: "3", name: "SSISM" },
  { id: "4", name: "Apex Manufacturing" },
  { id: "5", name: "St. Mary's Healthcare" },
  { id: "6", name: "Vision Education" },
  { id: "7", name: "Skyway Retail" },
  { id: "8", name: "Quantum Tech" },
  { id: "9", name: "Blue Ocean Energy" },
  { id: "10", name: "Horizon Banking" },
  { id: "11", name: "Everest Construction" },
  { id: "12", name: "Gourmet Foods" },
  { id: "13", name: "Nova Aerospace" }
];

export const coordinators = [
    { id: '1', orgId: '1', name: 'Sarah Jenkins' },
    { id: '3', orgId: '2', name: 'David Kim' },
    { id: '4', orgId: '3', name: 'Elena Rodriguez' },
    { id: '5', orgId: '4', name: 'Aisha Khan' },
    { id: '6', orgId: '5', name: 'Liam O\'Connor' }
];

export const sites = [
    // Acme Corp (coord: 1)
    { id: 's1', coordId: '1', name: 'Acme HQ', industry: 'Technology', region: 'North America', status: 'ACTIVE', stats: { floors: 3, zones: 12, assets: 45 }, logo: 'https://ui-avatars.com/api/?name=Acme+HQ&background=random' },
    { id: 's2', coordId: '1', name: 'Acme Data Center', industry: 'Technology', region: 'North America', status: 'ACTIVE', stats: { floors: 2, zones: 5, assets: 10 }, logo: 'https://ui-avatars.com/api/?name=Acme+Data+Center&background=random' },
    // Global Logistics (coord: 3)
    { id: 's3', coordId: '3', name: 'Berlin Distribution', industry: 'Logistics', region: 'Europe', status: 'ACTIVE', stats: { floors: 5, zones: 20, assets: 100 }, logo: 'https://ui-avatars.com/api/?name=Berlin+Distribution&background=random' },
    { id: 's4', coordId: '3', name: 'Paris Hub', industry: 'Logistics', region: 'Europe', status: 'INACTIVE', stats: { floors: 1, zones: 3, assets: 20 }, logo: 'https://ui-avatars.com/api/?name=Paris+Hub&background=random' },
    // SSISM (coord: 4)
    { id: 's5', coordId: '4', name: 'SSISM Main Campus', industry: 'Security', region: 'Asia Pacific', status: 'ACTIVE', stats: { floors: 4, zones: 15, assets: 200 }, logo: 'https://ui-avatars.com/api/?name=SSISM+Main+Campus&background=random' },
    // Apex Manufacturing (coord: 5)
    { id: 's6', coordId: '5', name: 'Apex Factory 1', industry: 'Manufacturing', region: 'East Coast', status: 'ACTIVE', stats: { floors: 2, zones: 8, assets: 30 }, logo: 'https://ui-avatars.com/api/?name=Apex+Factory+1&background=random' },
    // St. Mary's Healthcare (coord: 6)
    { id: 's7', coordId: '6', name: 'St. Mary\'s Hospital', industry: 'Healthcare', region: 'West Coast', status: 'ACTIVE', stats: { floors: 8, zones: 30, assets: 500 }, logo: 'https://ui-avatars.com/api/?name=St.+Marys+Hospital&background=random' }
];

export const floors = [
    // Acme HQ (s1)
    { id: 'f1', siteId: 's1', name: 'Ground Floor' },
    { id: 'f2', siteId: 's1', name: 'Level 1' },
    { id: 'f3', siteId: 's1', name: 'Level 2' },
    // Acme Data Center (s2)
    { id: 'f4', siteId: 's2', name: 'Server Floor A' },
    { id: 'f5', siteId: 's2', name: 'Server Floor B' },
    // Berlin Distribution (s3)
    { id: 'f6', siteId: 's3', name: 'Warehouse Ground' },
    { id: 'f7', siteId: 's3', name: 'Mezzanine' },
    // SSISM Main Campus (s5)
    { id: 'f8', siteId: 's5', name: 'Admin Block' },
    { id: 'f9', siteId: 's5', name: 'Security Center' },
    // Apex Factory (s6)
    { id: 'f10', siteId: 's6', name: 'Assembly Line' },
    // St. Mary's Healthcare (s7)
    { id: 'f11', siteId: 's7', name: 'ER & Reception' },
    { id: 'f12', siteId: 's7', name: 'ICU Ward' }
];

export const zones = [
    // Acme HQ Ground Floor (f1)
    { id: 'z1', floorId: 'f1', name: 'Server Rack A', type: 'Data Room' },
    { id: 'z2', floorId: 'f1', name: 'Server Rack B', type: 'Data Room' },
    // Acme HQ Level 1 (f2)
    { id: 'z3', floorId: 'f2', name: 'Network Hub', type: 'Infrastructure' },
    // Acme Data Center Server Floor A (f4)
    { id: 'z4', floorId: 'f4', name: 'Cooling Unit Array', type: 'HVAC' },
    // Berlin Distribution Warehouse Ground (f6)
    { id: 'z5', floorId: 'f6', name: 'Loading Bay Alpha', type: 'Logistics' },
    { id: 'z6', floorId: 'f6', name: 'Storage Sector C', type: 'Storage' },
    // SSISM Main Admin Block (f8)
    { id: 'z7', floorId: 'f8', name: 'Command Center', type: 'Security' }
];

export const assets = [
    // z1
    { id: 'a1', zoneId: 'z1', name: 'Dell PowerEdge R740', status: 'ACTIVE' },
    { id: 'a2', zoneId: 'z1', name: 'Cisco Nexus 9000', status: 'ACTIVE' },
    // z2
    { id: 'a3', zoneId: 'z2', name: 'Lenovo ThinkSystem', status: 'MAINTENANCE' },
    // z5
    { id: 'a4', zoneId: 'z5', name: 'Forklift T-800', status: 'ACTIVE' },
    { id: 'a5', zoneId: 'z5', name: 'Conveyor Belt System', status: 'ACTIVE' },
    // z7
    { id: 'a6', zoneId: 'z7', name: 'Surveillance Hub Server', status: 'ACTIVE' }
];
