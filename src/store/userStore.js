import { create } from 'zustand';
import api from '../services/api';
import { userService } from "../services/userService";
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * USER STORE
 * Manages all user-related data, stats, and filtering for the Admin panel.
 */
/**
 * USER STORE
 * Manages all user-related data, stats, and filtering for the Admin panel.
 */
const useUserStore = create((set, get) => ({
    // --- DATA STATE ---
    users: [],
    totalCount: 0,
    stats: { total: 0, active: 0, inactive: 0, unassigned: 0 },
    filterOptions: { organizations: [], roles: [], regions: [] },
    loading: false,
    error: null,
    abortController: null,
    allCoordinators: [], // Lookup list for FilterBar

    // --- UI, FILTER & PAGINATION STATE ---
    search: '',
    filters: {
        role: '',
        organization: '',
        region: '',
        status: ''
    },
    sortKey: 'created_at',
    sortDir: 'desc',
    selectedIds: [],
    limit: 20,
    offset: 0,

    /**
     * INITIAL LOAD: Fetch everything needed for first mount
     */
    fetchInitialData: async () => {
        set({ loading: true, error: null });
        try {
            const { filters, search, limit, offset } = get();
            
            // Map FE 'organization' filter to BE 'organisation_id' for the initial API call
            const apiFilters = { ...filters };
            if (apiFilters.organization) {
                apiFilters.organisation_id = apiFilters.organization;
                delete apiFilters.organization;
            }

            // Fetch everything in parallel: Users, Stats, and Real Filter Options
            const [usersData, stats, filterOptions] = await Promise.all([
                userService.getUsers(apiFilters, search, limit, offset),
                userService.getUserStats(),
                userService.getFilterOptions()
            ]);

            set({ 
                users: usersData.users || [], 
                totalCount: usersData.totalCount || 0,
                stats: stats || { total: 0, active: 0, inactive: 0, unassigned: 0 }, 
                filterOptions: filterOptions || { organizations: [], roles: [], regions: [] }, 
                loading: false 
            });
        } catch (err) {
            set({ users: [], error: err.message, loading: false });
            toast.error("We couldn't connect to the dashboard. Please try again.");
        }
    },

    /**
     * COORDINATOR SPECIFIC LOAD: For the Admin/Coordinators page
     */
    fetchCoordinatorData: async () => { ... },
    
    fetchLookupCoordinators: async (orgId = null) => {
        try {
            const data = await userService.getCoordinators(orgId);
            set({ allCoordinators: data });
        } catch (err) {
            console.error("FilterBar Coordinator Fetch Failed", err);
        }
    },

    /**
     * FETCH LIST: Only refresh the user list (for search, filters, pagination)
     */
    fetchUsers: async () => {
        // Cancel previous fetch if still in flight
        const { abortController } = get();
        if (abortController) abortController.abort();
        
        const newController = new AbortController();
        set({ loading: true, error: null, abortController: newController });

        try {
            const { filters, search, limit, offset } = get();
            const { users, totalCount } = await userService.getUsers(filters, search, limit, offset);
            set({ 
                users: Array.isArray(users) ? users : [], 
                totalCount: totalCount || 0, 
                loading: false 
            });
        } catch (err) {
            set({ users: [], error: err.message, loading: false });
        }
    },

    setPage: async (pageNumber) => {
        const { limit } = get();
        const newOffset = (pageNumber - 1) * limit;
        set({ offset: newOffset });
        await get().fetchUsers();
    },

    /**
     * CRUD Operations
     */
    createUser: async (userData) => {
        set({ loading: true, error: null });
        try {
            await userService.createUser(userData);
            await get().fetchInitialData(); 
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
            await get().fetchInitialData();
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
            await get().fetchInitialData();
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
        if (ids.length === 0) return { success: false, error: "No users selected" };

        set({ loading: true, error: null });
        try {
            await userService.bulkAction(ids, action);
            set({ selectedIds: [] }); 
            await get().fetchInitialData();
            toast.success("Done! The changes have been applied.");
            return { success: true };
        } catch (err) {
            const msg = err.message || `Problem updating users. Please try again.`;
            toast.error(msg);
            set({ loading: false, error: msg });
            return { success: false, error: msg };
        }
    },

    /**
     * Export to PDF (Frontend)
     */
    exportPDF: async () => {
        try {
            const { users } = get();
            const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            
            // --- HEADER & BRANDING ---
            const primaryColor = [7, 34, 103]; // AAQMS Dark Blue
            const accentColor = [37, 99, 235];  // AAQMS Primary Blue
            
            doc.setFontSize(22);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setFont("helvetica", "bold");
            doc.text("AAQMS", 14, 20);
            
            doc.setFontSize(14);
            doc.setTextColor(100);
            doc.setFont("helvetica", "normal");
            doc.text("Personnel Records - Official Report", 14, 28);
            
            doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
            doc.setLineWidth(1);
            doc.line(14, 32, 283, 32);

            // Metadata info
            doc.setFontSize(9);
            doc.setTextColor(120);
            doc.text(`Report generated: ${new Date().toLocaleString()}`, 14, 38);
            doc.text(`Personnel Record Count: ${users.length}`, 14, 43);

            // --- TABLE CONFIG ---
            const tableColumn = [
                "Full Name", "Email", "Phone", "Role", "Organization", "Status"
            ];
            
            const tableRows = users.map(u => [
                u.name,
                u.email,
                u.mobile_number || 'N/A',
                u.role?.toUpperCase() || 'N/A',
                u.organization || 'Unassigned',
                u.status?.toUpperCase() || 'N/A'
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 50,
                theme: 'grid',
                styles: { fontSize: 8, cellPadding: 4 },
                headStyles: { fillColor: primaryColor, textColor: 255 },
                alternateRowStyles: { fillColor: [250, 251, 255] }
            });

            doc.save(`AAQMS_Personnel_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success("Success! Your PDF report is ready.");
        } catch (err) {
            console.error("PDF Export failed:", err);
            toast.error("Oops! Something went wrong while making the PDF.");
        }
    },

    /**
     * Export to CSV
     */
    exportCSV: async () => {
        try {
            const data = await userService.exportCSV();
            const blob = new Blob([data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `AAQMS_Personnel_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success("Success! Your CSV data is ready.");
        } catch (err) {
            toast.error("Oops! Something went wrong while making the CSV.");
        }
    },

    // --- UI HELPERS ---
    setSearch: (search) => set({ search, offset: 0 }),
    setFilters: (filters) => set({ filters, offset: 0 }),
    setSortKey: (sortKey) => set({ sortKey }),
    setSortDir: (sortDir) => set({ sortDir }),
    toggleSelectRow: (id) => {
        const { selectedIds } = get();
        set({ selectedIds: selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id] });
    },
    clearSelection: () => set({ selectedIds: [] }),
    setSelectedIds: (selectedIds) => set({ selectedIds }),
    resetFilters: () => set({
        search: '',
        offset: 0,
        filters: { organization: '', role: '', status: '', region: '' },
    }),
}));


export default useUserStore;
