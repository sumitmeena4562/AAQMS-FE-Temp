export const organizations = [
    { id: 'org1', name: 'Acme Corp' },
    { id: 'org2', name: 'SSISM' },
    { id: 'org3', name: 'Globex' }
];

export const coordinators = [
    { id: 'c1', orgId: 'org1', name: 'Sarah Jenkins' },
    { id: 'c2', orgId: 'org2', name: 'David Kim' },
    { id: 'c3', orgId: 'org3', name: 'Elena Rodriguez' },
    { id: 'c4', orgId: 'org1', name: 'Marcus Thorne' }
];

export const sites = [
    { id: 's1', coordId: 'c1', name: 'Acme North Hub', industry: 'technology', region: 'North Zone', status: 'ACTIVE', stats: { floors: 3, zones: 12, assets: 45 }, logo: 'https://ui-avatars.com/api/?name=Acme+North+Hub&background=random' },
    { id: 's2', coordId: 'c1', name: 'Acme South Hub', industry: 'technology', region: 'North Zone', status: 'ACTIVE', stats: { floors: 2, zones: 5, assets: 10 }, logo: 'https://ui-avatars.com/api/?name=Acme+South+Hub&background=random' },
    { id: 's3', coordId: 'c2', name: 'SSISM Main Campus', industry: 'logistics', region: 'South Zone', status: 'ACTIVE', stats: { floors: 5, zones: 20, assets: 100 }, logo: 'https://ui-avatars.com/api/?name=SSISM+Main+Campus&background=random' },
    { id: 's4', coordId: 'c3', name: 'Globex Factory A', industry: 'manufacturing', region: 'East Zone', status: 'INACTIVE', stats: { floors: 1, zones: 3, assets: 20 }, logo: 'https://ui-avatars.com/api/?name=Globex+Factory+A&background=random' },
    { id: 's5', coordId: 'c3', name: 'Globex Factory B', industry: 'manufacturing', region: 'East Zone', status: 'ACTIVE', stats: { floors: 2, zones: 8, assets: 30 }, logo: 'https://ui-avatars.com/api/?name=Globex+Factory+B&background=random' },
    { id: 's6', coordId: 'c4', name: 'Acme Central R&D', industry: 'technology', region: 'Central Zone', status: 'ACTIVE', stats: { floors: 4, zones: 15, assets: 200 }, logo: 'https://ui-avatars.com/api/?name=Acme+Central+R&D&background=random' }
];

export const floors = [
    { id: 'f1', siteId: 's1', name: 'Ground Floor' },
    { id: 'f2', siteId: 's1', name: 'Floor 1' },
    { id: 'f3', siteId: 's2', name: 'Warehouse Level 1' },
    { id: 'f4', siteId: 's3', name: 'Admin Block Ground' },
    { id: 'f5', siteId: 's3', name: 'Admin Block Level 1' },
    { id: 'f6', siteId: 's4', name: 'Assembly Line A' },
    { id: 'f7', siteId: 's5', name: 'Assembly Line B' },
    { id: 'f8', siteId: 's6', name: 'Laboratory Floor' }
];
