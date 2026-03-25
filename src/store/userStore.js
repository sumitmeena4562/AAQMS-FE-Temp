import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userService } from '../services/userService';

/**
 * USER STORE
 * Manages all user-related data, stats, and filtering for the Admin panel.
 */
const useUserStore = create(
    persist(
        (set, get) => ({
            // --- DATA STATE ---
            users: [],
            stats: { total: 0, active: 0, inactive: 0, unassigned: 0 },
            filterOptions: { organizations: [], roles: [] },
            loading: false,
            error: null,

            // --- UI & FILTER STATE ---
            search: '',
            filters: { organization: '', role: '', status: '', assignment: '', timeRange: 'all', region: '', verified: '' },
            sortKey: 'name',
            sortDir: 'asc',
            selectedIds: [],

            // --- CORE ACTIONS (API) ---

            /**
             * Fetch users with current filters and search.
             */
            fetchUsers: async () => {
                set({ loading: true, error: null });
                try {
                    const { search, filters } = get();
                    
                    // Parallel Requests for performance
                    const [users, stats, filterOptions] = await Promise.all([
                        userService.getUsers(filters, search),
                        userService.getUserStats(),
                        userService.getFilterOptions(filters)
                    ]);

                    set({ users, stats, filterOptions, loading: false });
                } catch (err) {
                    set({ error: err.message, loading: false });
                }
            },

            /**
             * CRUD Operations
             */
            createUser: async (userData) => {
                set({ loading: true, error: null });
                try {
                    await userService.createUser(userData);
                    await get().fetchUsers(); // Refresh list
                    return { success: true };
                } catch (err) {
                    set({ loading: false, error: err.message });
                    return { success: false, error: err.message };
                }
            },

            updateUser: async (id, updates) => {
                set({ loading: true, error: null });
                try {
                    await userService.updateUser(id, updates);
                    await get().fetchUsers();
                    return { success: true };
                } catch (err) {
                    set({ loading: false, error: err.message });
                    return { success: false, error: err.message };
                }
            },

            deleteUser: async (id) => {
                set({ loading: true, error: null });
                try {
                    await userService.deleteUser(id);
                    // Remove from selection if deleted
                    set(s => ({ selectedIds: s.selectedIds.filter(i => i !== id) }));
                    await get().fetchUsers();
                    return { success: true };
                } catch (err) {
                    set({ loading: false, error: err.message });
                    return { success: false, error: err.message };
                }
            },

            /**
             * Bulk Operations
             */
            bulkAction: async (action, targetIds = null) => {
                const ids = targetIds || get().selectedIds;
                if (ids.length === 0) return;

                set({ loading: true, error: null });
                try {
                    await userService.bulkAction(ids, action);
                    if (!targetIds) set({ selectedIds: [] }); // Clear selection if it was a global action
                    await get().fetchUsers();
                    return { success: true };
                } catch (err) {
                    set({ loading: false, error: err.message });
                    return { success: false, error: err.message };
                }
            },

            /**
             * Export to CSV
             */
            exportCSV: async () => {
                try {
                    const csvData = await userService.exportCSV();
                    const blob = new Blob([csvData], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                    URL.revokeObjectURL(url);
                } catch (err) {
                    set({ error: err.message });
                }
            },

            // --- UI HELPERS (Filters, Sorting, Selection) ---

            setSearch: (search) => set({ search }),
            setFilters: (filters) => set({ filters }),
            setSortKey: (sortKey) => set({ sortKey }),
            setSortDir: (sortDir) => set({ sortDir }),

            handleSort: (key) => {
                const { sortKey, sortDir } = get();
                const newDir = (sortKey === key && sortDir === 'asc') ? 'desc' : 'asc';
                set({ sortKey: key, sortDir: newDir });
            },

            toggleSelectAll: (userIds) => {
                const { selectedIds } = get();
                set({ selectedIds: selectedIds.length === userIds.length ? [] : [...userIds] });
            },

            toggleSelectRow: (id) => {
                const { selectedIds } = get();
                const newSelection = selectedIds.includes(id)
                    ? selectedIds.filter(i => i !== id)
                    : [...selectedIds, id];
                set({ selectedIds: newSelection });
            },

            clearSelection: () => set({ selectedIds: [] }),
            setSelectedIds: (selectedIds) => set({ selectedIds }),

            resetFilters: () => set({
                search: '',
                filters: { 
                    organization: '', role: '', status: '', assignment: '', 
                    timeRange: 'all', region: '', verified: '' 
                },
            }),

            clearError: () => set({ error: null }),
        }), 
        {
            name: 'aaqms-user-filters',
            version: 1, 
            migrate: (persistedState, version) => {
                if (version === 0) {
                    const state = { ...persistedState };
                    if (state.filters) {
                        if (state.filters.role === 'Coordinator') state.filters.role = 'coordinator';
                        if (state.filters.role === 'Field Officer') state.filters.role = 'field_officer';
                        if (state.filters.role === 'Admin') state.filters.role = 'admin';
                    }
                    return state;
                }
                return persistedState;
            },
            partialize: (state) => ({ 
                filters: state.filters, 
                sortKey: state.sortKey, 
                sortDir: state.sortDir 
            }),
        }
    )
);

export default useUserStore;
