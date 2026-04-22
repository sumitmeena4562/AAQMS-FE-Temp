import { create } from 'zustand';
import { userService } from "../services/userService";
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { queryClient } from '../lib/queryClient';

/**
 * USER STORE
 * Manages all user-related data, stats, and filtering for the Admin panel.
 */
const useUserStore = create((set, get) => ({
    // --- UI, FILTER & PAGINATION STATE ---
    search: '',
    filters: {
        role: [],
        organization: [],
        region: [],
        status: []
    },
    sortKey: 'created_at',
    sortDir: 'desc',
    selectedIds: [],
    limit: 12,  // page_size
    page: 1,    // current page
    loading: false, // kept for mutation-specific loading if needed
    error: null,

    // Mutation helpers (Internal loading states)
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    setPage: (pageNumber) => set({ page: pageNumber }),
    setLimit: (newLimit) => set({ limit: newLimit, page: 1 }),

    /**
     * CRUD Operations
     */
    createUser: async (userData) => {
        set({ loading: true, error: null });
        try {
            const data = await userService.createUser(userData);
            
            // SINGLE-CALL OPTIMIZATION: Update stats without re-fetching
            if (data.updated_stats) {
                queryClient.setQueryData(['dashboard', 'summary'], old => ({
                    ...old,
                    stats: { ...old?.stats, ...data.updated_stats }
                }));
                queryClient.setQueryData(['user-stats'], data.updated_stats);
            }

            // Invalidate users list to show new user (since order might change)
            // but we skip the heavy dashboard/stats invalidation
            await queryClient.invalidateQueries(['users']);
            
            set({ loading: false });
            return { success: true, data };
        } catch (err) {
            set({ loading: false, error: err.message });
            return { success: false, error: err.message };
        }
    },

    updateUser: async (id, updates) => {
        set({ loading: true, error: null });
        try {
            const data = await userService.updateUser(id, updates);
            
            // SINGLE-CALL OPTIMIZATION: Manually update the specific user in all cached pages
            queryClient.setQueriesData({ queryKey: ['users'] }, (oldData) => {
                if (!oldData?.results) return oldData;
                return {
                    ...oldData,
                    results: oldData.results.map(u => String(u.id) === String(id) ? { ...u, ...data } : u)
                };
            });

            // Update stats if returned
            if (data.updated_stats) {
                queryClient.setQueryData(['user-stats'], data.updated_stats);
            }

            set({ loading: false });
            return { success: true, data };
        } catch (err) {
            set({ loading: false, error: err.message });
            return { success: false, error: err.message };
        }
    },

    deleteUser: async (id) => {
        set({ loading: true, error: null });
        try {
            // SINGLE-CALL OPTIMIZATION: Manually remove user from all cached lists
            queryClient.setQueriesData({ queryKey: ['users'] }, (oldData) => {
                if (!oldData?.results) return oldData;
                return {
                    ...oldData,
                    count: oldData.count - 1,
                    results: oldData.results.filter(u => String(u.id) !== String(id))
                };
            });

            set(s => ({ selectedIds: s.selectedIds.filter(i => i !== id), loading: false })); 
            
            // Still invalidate stats as they are harder to update manually perfectly
            await queryClient.invalidateQueries(['user-stats']);
            await queryClient.invalidateQueries(['dashboard', 'summary']);
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
            const data = await userService.bulkAction(ids, action);
            
            // SINGLE-CALL OPTIMIZATION: Update all targeted users in cache
            if (data?.results || Array.isArray(data)) {
                const updatedUsers = data.results || data;
                queryClient.setQueriesData({ queryKey: ['users'] }, (oldData) => {
                    if (!oldData?.results) return oldData;
                    return {
                        ...oldData,
                        results: oldData.results.map(u => {
                            const updated = updatedUsers.find(uu => String(uu.id) === String(u.id));
                            return updated ? { ...u, ...updated } : u;
                        })
                    };
                });
            }

            set({ selectedIds: [], loading: false });
            
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
    exportPDF: async (users = []) => {
        try {
            if (!users || users.length === 0) {
                toast.error("No data available to export.");
                return;
            }
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
            
            const tableRows = users.map(u => {
                // Format Role: e.g., 'FIELD_OFFICER' -> 'Field Officer'
                const formattedRole = (u.role || 'N/A')
                    .replace(/_/g, ' ')
                    .toLowerCase()
                    .replace(/\b\w/g, l => l.toUpperCase());

                // Format Status: e.g., 'ACTIVE' -> 'Active'
                const formattedStatus = (u.status || 'N/A')
                    .toLowerCase()
                    .replace(/\b\w/g, l => l.toUpperCase());

                return [
                    u.name || 'N/A',
                    u.email || 'N/A',
                    u.mobile_number || 'N/A',
                    formattedRole,
                    u.org_name || 'Unassigned',
                    formattedStatus
                ];
            });

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
        } catch {
            toast.error("Oops! Something went wrong while making the CSV.");
        }
    },

    // --- UI HELPERS ---
    setSearch: (newSearch) => {
        if (get().search === newSearch) return;
        set({ search: newSearch, page: 1 });
    },
    setFilters: (newFilters) => {
        const current = get().filters;
        const merged = typeof newFilters === 'object' ? { ...current, ...newFilters } : newFilters;
        
        // Use JSON check for deep equality since filters are small objects
        if (JSON.stringify(current) === JSON.stringify(merged)) return;
        
        set({ filters: merged, page: 1 });
    },
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
        page: 1,
        filters: { organization: [], role: [], status: [], region: [] },
    }),
}));


export default useUserStore;
