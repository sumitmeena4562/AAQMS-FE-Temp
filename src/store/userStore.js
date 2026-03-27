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
const useUserStore = create((set, get) => ({
    // --- DATA STATE ---
    users: [],
    stats: { total: 0, active: 0, inactive: 0, unassigned: 0 },
    filterOptions: { organizations: [], roles: [], regions: [] },
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
            
            // Fetch users and stats in parallel
            const [users, stats] = await Promise.all([
                userService.getUsers(filters, search),
                userService.getUserStats(),
            ]);

            // Derive filter options from already-fetched users (avoid duplicate API call)
            const filterOptions = await userService.getFilterOptions(filters, users);

            set({ users, stats, filterOptions, loading: false });
        } catch (err) {
            const msg = err.message || 'Failed to load users';
            set({ error: msg, loading: false });
            toast.error(msg);
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
            const msg = err.message || 'Failed to create user';
            set({ loading: false, error: msg });
            // toast.error is already handled by extractError and userService
            return { success: false, error: msg };
        }
    },

    updateUser: async (id, updates) => {
        set({ loading: true, error: null });
        try {
            await userService.updateUser(id, updates);
            await get().fetchUsers();
            return { success: true };
        } catch (err) {
            const msg = err.message || 'Failed to update user profile';
            set({ loading: false, error: msg });
            return { success: false, error: msg };
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
            const msg = err.message || 'Failed to delete user';
            set({ loading: false, error: msg });
            return { success: false, error: msg };
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
            if (!targetIds) set({ selectedIds: [] }); // Clear selection if it was a global action
            await get().fetchUsers();
            return { success: true };
        } catch (err) {
            const msg = err.message || 'Bulk action failed';
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
            const primaryColor = [40, 51, 107]; // AAQMS Dark Blue
            const accentColor = [67, 97, 238];  // AAQMS Primary Blue
            
            // Title & Subtitle
            doc.setFontSize(22);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setFont("helvetica", "bold");
            doc.text("AAQMS", 14, 20);
            
            doc.setFontSize(14);
            doc.setTextColor(100);
            doc.setFont("helvetica", "normal");
            doc.text("Personnel Records - All Users Report", 14, 28);
            
            // Branding Line
            doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
            doc.setLineWidth(1);
            doc.line(14, 32, 283, 32);

            // Metadata info
            doc.setFontSize(9);
            doc.setTextColor(120);
            doc.text(`Report date: ${new Date().toLocaleString()}`, 14, 38);
            doc.text(`Total Personnel Count: ${users.length}`, 14, 43);

            // --- TABLE CONFIG ---
            const tableColumn = [
                "Emp ID", "Full Name", "Designation", "Email", 
                "Phone", "Role", "Organization", "Zone/Region", "Equip ID", "Status"
            ];
            
            const tableRows = users.map(u => [
                u.employee_id || '---',
                u.name,
                u.designation || '---',
                u.email,
                u.phone_number || '---',
                u.role?.toUpperCase(),
                u.organization || 'Unassigned',
                u.region || u.zone || 'Global',
                u.equipment_id || '---',
                u.is_active ? 'ACTIVE' : 'DEACTIVE'
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 50,
                theme: 'grid',
                styles: { 
                    fontSize: 7.5, 
                    cellPadding: 3, 
                    valign: 'middle',
                    overflow: 'linebreak'
                },
                headStyles: { 
                    fillColor: primaryColor, 
                    textColor: 255, 
                    fontStyle: 'bold',
                    halign: 'center'
                },
                columnStyles: {
                    0: { halign: 'center', fontStyle: 'bold' }, // Emp ID
                    3: { textColor: accentColor }, // Email
                    9: { halign: 'center' } // Status
                },
                alternateRowStyles: { fillColor: [250, 251, 255] },
                margin: { left: 14, right: 14 },
                didDrawPage: (data) => {
                    // --- FOOTER ---
                    const str = "Page " + doc.internal.getNumberOfPages();
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
                    doc.text("Confidential - AAQMS Internal Document", 230, doc.internal.pageSize.height - 10);
                }
            });

            const fileName = `AAQMS_Personnel_Report_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            toast.success("Comprehensive PDF Report Exported");
        } catch (err) {
            console.error("PDF Export failed:", err);
            toast.error("Failed to generate comprehensive PDF report");
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
            const msg = err.message || 'CSV export failed';
            set({ error: msg });
            toast.error(msg);
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
}));

export default useUserStore;
