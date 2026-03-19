import { create } from 'zustand';

const initialOrgs = [
  {
    id: "1",
    name: "Acme Corp", industry: "Technology", region: "North America", 
    status: "ACTIVE",
    lastInventoryAudit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago (ACTIVE)
    stats: {
      sites: 4,
      floors: 5,
      zones: 12
    },
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    name: "Global Logistics", industry: "Logistics", region: "Europe", 
    status: "ACTIVE",
    lastInventoryAudit: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago (DEACTIVE)
    stats: {
      sites: 12,
      floors: 8,
      zones: 24
    },
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    name: "SSISM", industry: "Security", region: "Asia Pacific", 
    status: "MAINTENANCE",
    lastInventoryAudit: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago (ACTIVE but currently MAINTENANCE so it will override if you fall back, wait, the logic overrides to ACTIVE/DEACTIVE based on date alone. That is fine.)
    stats: {
      sites: 2,
      floors: 4,
      zones: 8
    },
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop"
  }
];

export const useOrgStore = create((set) => ({
  orgs: JSON.parse(localStorage.getItem('aaqms_organizations')) || initialOrgs,
  addOrg: (newOrg) => set((state) => {
    const updated = [...state.orgs, newOrg];
    localStorage.setItem('aaqms_organizations', JSON.stringify(updated));
    return { orgs: updated };
  })
}));
