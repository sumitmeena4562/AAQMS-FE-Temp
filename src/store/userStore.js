import { create } from 'zustand';
import { userService } from '../services/userService';

const useUserStore = create((set, get) => ({
    // ── Data State ──
    users: [],
    stats: { total: 0, active: 0, inactive: 0, unassigned: 0 },
    filterOptions: { organizations: [], roles: [] },
    loading: false,
    error: null,

    // ── UI State ──
    search: '',
    filters: { organization: '', role: '', status: '', assignment: '' },
    sortKey: 'name',
    sortDir: 'asc',
    selectedIds: [],

    // ── Actions ──

    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const { search, filters } = get();
            const users = await userService.getUsers(filters, search);
            const stats = await userService.getUserStats();
            const filterOptions = await userService.getFilterOptions();
            set({ users, stats, filterOptions, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    createUser: async (userData) => {
        set({ loading: true, error: null });
        try {
            await userService.createUser(userData);
            await get().fetchUsers();
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
            set(s => ({ selectedIds: s.selectedIds.filter(i => i !== id) }));
            await get().fetchUsers();
            return { success: true };
        } catch (err) {
            set({ loading: false, error: err.message });
            return { success: false, error: err.message };
        }
    },

    bulkAction: async (action) => {
        const { selectedIds } = get();
        if (selectedIds.length === 0) return;
        set({ loading: true, error: null });
        try {
            await userService.bulkAction(selectedIds, action);
            set({ selectedIds: [] });
            await get().fetchUsers();
            return { success: true };
        } catch (err) {
            set({ loading: false, error: err.message });
            return { success: false, error: err.message };
        }
    },

    exportCSV: async () => {
        try {
            const csv = await userService.exportCSV();
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            set({ error: err.message });
        }
    },

    // ── UI Actions ──

    setSearch: (search) => set({ search }),
    setFilters: (filters) => set({ filters }),
    setSortKey: (sortKey) => set({ sortKey }),
    setSortDir: (sortDir) => set({ sortDir }),

    handleSort: (key) => {
        const { sortKey, sortDir } = get();
        if (sortKey === key) {
            set({ sortDir: sortDir === 'asc' ? 'desc' : 'asc' });
        } else {
            set({ sortKey: key, sortDir: 'asc' });
        }
    },

    toggleSelectAll: (userIds) => {
        const { selectedIds } = get();
        if (selectedIds.length === userIds.length) {
            set({ selectedIds: [] });
        } else {
            set({ selectedIds: [...userIds] });
        }
    },

    toggleSelectRow: (id) => {
        const { selectedIds } = get();
        if (selectedIds.includes(id)) {
            set({ selectedIds: selectedIds.filter(i => i !== id) });
        } else {
            set({ selectedIds: [...selectedIds, id] });
        }
    },

    clearSelection: () => set({ selectedIds: [] }),

    resetFilters: () => set({
        search: '',
        filters: { organization: '', role: '', status: '', assignment: '' },
    }),

    clearError: () => set({ error: null }),
}));

export default useUserStore;
