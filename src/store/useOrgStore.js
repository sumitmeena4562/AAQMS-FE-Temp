import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * INITIAL DEMO DATA
 * Case 1: First time load -> User sees 13 premium demo organizations.
 */
const initialOrgs = [
  {
    id: "1",
    name: "Acme Corp", industry: "Technology", region: "North America", 
    status: "ACTIVE",
    lastInventoryAudit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    stats: { sites: 4, floors: 5, zones: 12 },
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    name: "Global Logistics", industry: "Logistics", region: "Europe", 
    status: "ACTIVE",
    lastInventoryAudit: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    stats: { sites: 12, floors: 8, zones: 24 },
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    name: "SSISM", industry: "Security", region: "Asia Pacific", 
    status: "MAINTENANCE",
    lastInventoryAudit: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    stats: { sites: 2, floors: 4, zones: 8 },
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "4",
    name: "Apex Manufacturing", industry: "Manufacturing", region: "East Coast",
    status: "ACTIVE",
    lastInventoryAudit: new Date().toISOString(),
    stats: { sites: 6, floors: 3, zones: 18 },
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "5",
    name: "St. Mary's Healthcare", industry: "Healthcare", region: "West Coast",
    status: "ACTIVE",
    lastInventoryAudit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    stats: { sites: 3, floors: 12, zones: 45 },
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "6",
    name: "Vision Education", industry: "Education", region: "UK & Ireland",
    status: "ACTIVE",
    lastInventoryAudit: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    stats: { sites: 8, floors: 4, zones: 32 },
    image: "https://www.visionmanagement.org/wp-content/uploads/2023/08/Vision-scaled-600x400.jpg"
  },
  {
    id: "7",
    name: "Skyway Retail", industry: "Retail", region: "Middle East",
    status: "MAINTENANCE",
    lastInventoryAudit: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    stats: { sites: 15, floors: 2, zones: 60 },
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "8",
    name: "Quantum Tech", industry: "Technology", region: "Germany",
    status: "ACTIVE",
    lastInventoryAudit: new Date().toISOString(),
    stats: { sites: 2, floors: 1, zones: 5 },
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "9",
    name: "Blue Ocean Energy", industry: "Energy", region: "Nordics",
    status: "ACTIVE",
    lastInventoryAudit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    stats: { sites: 4, floors: 10, zones: 20 },
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "10",
    name: "Horizon Banking", industry: "Finance", region: "Singapore",
    status: "ACTIVE",
    lastInventoryAudit: new Date().toISOString(),
    stats: { sites: 5, floors: 15, zones: 30 },
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "11",
    name: "Everest Construction", industry: "Construction", region: "India",
    status: "MAINTENANCE",
    lastInventoryAudit: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    stats: { sites: 9, floors: 6, zones: 54 },
    image: "https://is1-2.housingcdn.com/4f2250e8/be11ddbc6e3f8c667d628fbd9ecf6124/v0/fs/everest_axora-bhayli-vadodara-everest_construction_company.jpeg"
  },
  {
    id: "12",
    name: "Gourmet Foods", industry: "Food & Beverage", region: "France",
    status: "ACTIVE",
    lastInventoryAudit: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    stats: { sites: 20, floors: 1, zones: 40 },
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "13",
    name: "Nova Aerospace", industry: "Aerospace", region: "Texas, USA",
    status: "ACTIVE",
    lastInventoryAudit: new Date().toISOString(),
    stats: { sites: 3, floors: 4, zones: 12 },
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop"
  }
];

/**
 * ORGANIZATION STORE
 * Handles listing, adding, and updating organizations with automatic persistence.
 */
export const useOrgStore = create(
  persist(
    (set) => ({
      // --- STATE ---
      orgs: initialOrgs,

      // --- CORE ACTIONS ---
      addOrg: (newOrg) => set((state) => ({ 
        orgs: [...state.orgs, newOrg] 
      })),

      updateOrg: (id, updatedOrg) => set((state) => ({
        orgs: state.orgs.map(org => org.id === id ? { ...org, ...updatedOrg } : org)
      })),

      removeOrg: (id) => set((state) => ({
        orgs: state.orgs.filter(org => org.id !== id)
      })),

      resetToDefault: () => set({ orgs: initialOrgs })
    }),
    {
      name: 'aaqms_organizations_v2', // New version for clean slate if needed
    }
  )
);
