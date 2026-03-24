import { create } from 'zustand';
import api from '../services/api';

// 🔹 DUMMY DATA FOR UI TESTING (Synced with UserStore Seed Data)
// 🔹 RULE: If coordinator is 'unassigned', sites are 0. Numbers match userStore exactly.
let MOCK_ORGS = [
    { id: '1', name: 'Acme Corp', industry: 'technology', region: 'North Zone', status: 'ACTIVE', stats: { sites: 0, floors: 0, coordinators: 1 }, logo: 'https://ui-avatars.com/api/?name=Acme+Corp&background=random' },
    { id: '2', name: 'SSISM', industry: 'logistics', region: 'South Zone', status: 'ACTIVE', stats: { sites: 5, floors: 20, coordinators: 1 }, logo: 'https://ui-avatars.com/api/?name=SSISM&background=random' },
    { id: '3', name: 'Globex', industry: 'manufacturing', region: 'East Zone', status: 'INACTIVE', stats: { sites: 12, floors: 48, coordinators: 1 }, logo: 'https://ui-avatars.com/api/?name=Globex&background=random' },
    { id: '4', name: 'Innovate Ltd', industry: 'finance', region: 'West Zone', status: 'ACTIVE', stats: { sites: 0, floors: 0, coordinators: 1 }, logo: 'https://ui-avatars.com/api/?name=Innovate+Ltd&background=random' },
    { id: '5', name: 'TechCore', industry: 'research', region: 'Central Zone', status: 'INACTIVE', stats: { sites: 8, floors: 32, coordinators: 1 }, logo: 'https://ui-avatars.com/api/?name=TechCore&background=random' },
];

export const useOrgStore = create((set, get) => ({
  orgs: [],
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1,
  totalCount: 0,
  searchTerm: '',

  // Fetch all organizations (MOCKED)
  fetchOrgs: async (page = 1, search = "") => {
    set({ isLoading: true, error: null, page, searchTerm: search });
    try {
      // ⚠️ REAL API CALL (COMMENTED OUT FOR NOW)
      // const response = await api.get(`/organizations/?page=${page}&search=${search}`);
      // const data = response.data;
      
      // 🔹 IMMEDIATE RETURN (No Artificial Lag)
      
      let results = [...MOCK_ORGS];
      if (search) {
          results = results.filter(org => org.name.toLowerCase().includes(search.toLowerCase()));
      }
      
      const totalCount = results.length;
      const totalPages = Math.ceil(totalCount / 10) || 1;

      set({ 
        orgs: results,
        totalCount,
        totalPages,
        isLoading: false 
      });
      return { success: true, data: results };
    } catch (err) {
      set({ error: 'Failed to fetch organizations', isLoading: false });
      return { success: false, error: 'Failed' };
    }
  },

  // Add a new organization (MOCKED)
  addOrg: async (newOrg) => {
    set({ isLoading: true, error: null });
    try {
      // ⚠️ REAL API CALL (COMMENTED OUT)
      // const response = await api.post('/organizations/', newOrg);
      
      // 🔹 IMMEDIATE RETURN (No Artificial Lag)
      
      const createdOrg = {
          ...newOrg,
          id: Math.random().toString(36).substr(2, 9),
          stats: { sites: 0, coordinators: 0 },
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(newOrg.name)}&background=random`
      };
      
      MOCK_ORGS.push(createdOrg); // Predictable Push

      set((state) => ({
        orgs: [...state.orgs, createdOrg],
        isLoading: false
      }));
      return { success: true, data: createdOrg };
    } catch (err) {
      set({ error: 'Failed to create organization', isLoading: false });
      return { success: false, error: 'Failed' };
    }
  },

  // Update an existing organization (MOCKED)
  updateOrg: async (id, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      // ⚠️ REAL API CALL (COMMENTED OUT)
      // const response = await api.patch(`/organizations/${id}/`, updatedData);
      
      // 🔹 IMMEDIATE RETURN (No Artificial Lag)
      
      const updatedOrgIndex = MOCK_ORGS.findIndex(org => org.id === id);
      if (updatedOrgIndex > -1) {
          MOCK_ORGS[updatedOrgIndex] = { ...MOCK_ORGS[updatedOrgIndex], ...updatedData };
      }

      set((state) => ({
        orgs: state.orgs.map((org) => (org.id === id ? { ...org, ...updatedData } : org)),
        isLoading: false
      }));
      return { success: true, data: updatedData };
    } catch (err) {
      set({ error: 'Failed to update organization', isLoading: false });
      return { success: false, error: 'Failed' };
    }
  },

  // Remove an organization (MOCKED)
  removeOrg: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // ⚠️ REAL API CALL (COMMENTED OUT)
      // await api.delete(`/organizations/${id}/`);
      
      // 🔹 IMMEDIATE RETURN (No Artificial Lag)
      MOCK_ORGS = MOCK_ORGS.filter(org => org.id !== id);

      set((state) => ({
        orgs: state.orgs.filter((org) => org.id !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      set({ error: 'Failed to delete organization', isLoading: false });
      return { success: false, error: 'Failed' };
    }
  }
}));
