/**
 * USER SERVICE
 * Mock API for User Management. Handles CRUD with localStorage persistence.
 * Replace these functions with real axios calls when the backend is ready.
 */

const STORAGE_KEY = 'aaqms_users';

// --- SEED DATA ---
const SEED_USERS = [
    { id: 1,  name: "Sarah Jenkins",    email: "sarah.j@acmecorp.com",   organization: "Acme Corp",     role: "coordinator",   assignment: "unassigned", status: "active",   verified: true,  lastActive: "2 hours ago",  createdAt: "2024-11-15", region: "North Zone" },
    { id: 2,  name: "David Kim",        email: "david.kim@ssism.com",    organization: "SSISM",         role: "field_officer", assignment: "assigned",   status: "active",   verified: true,  lastActive: "Now",          createdAt: "2024-10-20", region: "South Zone" },
    { id: 3,  name: "Elena Rodriguez",  email: "elena.r@globex.org",     organization: "Globex",        role: "coordinator",   assignment: "assigned",   status: "active",   verified: true,  lastActive: "5 mins ago",   createdAt: "2024-09-12", region: "East Zone" },
    { id: 4,  name: "Marcus Thorne",    email: "m.thorne@innovate.io",   organization: "Innovate Ltd",  role: "field_officer", assignment: "unassigned", status: "deactive", verified: false, lastActive: "3 days ago",   createdAt: "2025-01-05", region: "West Zone" },
    { id: 5,  name: "Aisha Khan",       email: "aisha.k@techcore.com",   organization: "TechCore",      role: "coordinator",   assignment: "assigned",   status: "active",   verified: true,  lastActive: "1 hour ago",   createdAt: "2024-08-01", region: "Central Zone" },
    { id: 6,  name: "John Smith",       email: "j.smith@builders.inc",   organization: "Builders Inc",  role: "field_officer", assignment: "assigned",   status: "active",   verified: true,  lastActive: "10 mins ago",  createdAt: "2024-12-18", region: "North Zone" },
    { id: 7,  name: "Yuki Tanaka",      email: "yuki.t@zensoft.jp",      organization: "ZenSoft",       role: "field_officer", assignment: "assigned",   status: "active",   verified: true,  lastActive: "Now",          createdAt: "2024-07-22", region: "South Zone" },
    { id: 8,  name: "Liam O'Connor",    email: "liam.oc@emerald.ie",     organization: "Emerald Eco",   role: "coordinator",   assignment: "unassigned", status: "active",   verified: false, lastActive: "1 day ago",    createdAt: "2025-02-01", region: "East Zone" },
    { id: 9,  name: "Sofia Rossi",      email: "s.rossi@lume.it",        organization: "Lume SpA",      role: "field_officer", assignment: "assigned",   status: "active",   verified: true,  lastActive: "4 hours ago",  createdAt: "2024-06-10", region: "West Zone" },
    { id: 10, name: "Chen Wei",         email: "c.wei@easternstar.cn",   organization: "Eastern Star",  role: "coordinator",   assignment: "assigned",   status: "deactive", verified: true,  lastActive: "2 days ago",   createdAt: "2024-05-30", region: "Central Zone" },
    { id: 11, name: "Maria Garcia",     email: "m.garcia@techcorp. Spanish",   organization: "TechCorp",      role: "admin",         assignment: "assigned",   status: "active",   verified: true,  lastActive: "30 mins ago",  createdAt: "2024-04-14", region: "North Zone" },
    { id: 12, name: "Ahmed Hassan",     email: "a.hassan@innovate.ae",   organization: "Innovate Labs", role: "field_officer", assignment: "assigned",   status: "active",   verified: true,  lastActive: "15 mins ago",  createdAt: "2024-03-20", region: "South Zone" },
];

// --- STORAGE HELPERS ---
const storage = {
    load: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                let users = JSON.parse(stored);
                if (!Array.isArray(users) || users.length === 0) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
                    return [...SEED_USERS];
                }
                
                // MIGRATION: Purane data ko naye format mein convert karna
                let hasChanges = false;
                users = users.map(u => {
                    let newRole = u.role;
                    if (u.role === 'Coordinator') { newRole = 'coordinator'; hasChanges = true; }
                    if (u.role === 'Field Officer') { newRole = 'field_officer'; hasChanges = true; }
                    if (u.role === 'Admin') { newRole = 'admin'; hasChanges = true; }
                    return { ...u, role: newRole };
                });
                if (hasChanges) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
                }
                return users;
            } catch (e) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
                return [...SEED_USERS];
            }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
        return [...SEED_USERS];
    },
    save: (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users)),
    delay: (ms = 200) => new Promise(r => setTimeout(r, ms))
};

// --- SERVICE IMPLEMENTATION ---
export const userService = {
    /**
     * GET USERS: Fetch with search & filters
     */
    getUsers: async (filters = {}, searchQuery = '') => {
        await storage.delay();
        let users = storage.load();

        // 1. Search Logic
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            users = users.filter(u => 
                [u.name, u.email, u.organization].some(val => (val || '').toLowerCase().includes(q))
            );
        }

        // 2. Filter Logic
        const { organization, role, status, assignment, region, verified, timeRange } = filters;
        
        if (organization) users = users.filter(u => (u.organization || '').toLowerCase() === organization.toLowerCase());
        if (role)         users = users.filter(u => (u.role || '').toLowerCase() === role.toLowerCase());
        if (status)       users = users.filter(u => (u.status || '').toLowerCase() === status.toLowerCase());
        if (assignment)   users = users.filter(u => (u.assignment || '').toLowerCase() === assignment.toLowerCase());
        if (region)       users = users.filter(u => (u.region || '').toLowerCase() === region.toLowerCase());
        
        if (verified !== undefined && verified !== '') {
            users = users.filter(u => u.verified === (verified === 'true' || verified === true));
        }

        // 3. Time Range Logic
        if (timeRange && timeRange !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            users = users.filter(u => {
                const date = new Date(u.createdAt);
                const diffDays = (today - date) / (1000 * 60 * 60 * 24);
                
                if (timeRange === 'today') return date >= today;
                if (timeRange === '7d') return diffDays <= 7;
                if (timeRange === '30d') return diffDays <= 30;
                return true;
            });
        }

        return users;
    },

    /**
     * CRUD ACTIONS
     */
    createUser: async (userData) => {
        await storage.delay(300);
        const users = storage.load();

        if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            throw new Error('Email already exists');
        }

        const newUser = {
            ...userData,
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            verified: false,
            lastActive: 'Never',
            createdAt: new Date().toISOString().split('T')[0]
        };

        users.push(newUser);
        storage.save(users);
        return newUser;
    },

    updateUser: async (id, updates) => {
        await storage.delay(300);
        const users = storage.load();
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) throw new Error('User not found');

        // Duplicate email check (exclude self)
        if (updates.email && users.some(u => u.id !== id && u.email.toLowerCase() === updates.email.toLowerCase())) {
            throw new Error('A user with this email already exists');
        }

        users[idx] = { ...users[idx], ...updates };
        storage.save(users);
        return users[idx];
    },

    deleteUser: async (id) => {
        await storage.delay(200);
        const users = storage.load().filter(u => u.id !== id);
        storage.save(users);
        return true;
    },

    /**
     * BULK ACTIONS
     */
    bulkAction: async (ids, action) => {
        await storage.delay(300);
        const users = storage.load().map(u => {
            if (!ids.includes(u.id)) return u;
            if (action === 'activate') return { ...u, status: 'active' };
            if (action === 'deactivate') return { ...u, status: 'deactive' };
            return u;
        });
        storage.save(users);
        return users;
    },

    /**
     * ANALYTICS & OPTIONS
     */
    getUserStats: async () => {
        await storage.delay(100);
        const users = storage.load();
        return {
            total: users.length,
            active: users.filter(u => u.status === 'active').length,
            inactive: users.filter(u => u.status === 'deactive').length,
            unassigned: users.filter(u => u.assignment === 'unassigned').length,
        };
    },

    getFilterOptions: async (filters = {}) => {
        await storage.delay(50);
        const all = storage.load();
        
        let filtered = [...all];
        if (filters.role) filtered = filtered.filter(u => u.role === filters.role);
        
        const regionScoped = filters.organization 
            ? filtered.filter(u => u.organization === filters.organization)
            : filtered;

        const getUnique = (arr, key) => [...new Set(arr.map(u => u[key]).filter(Boolean))].sort();

        const rawRoles = getUnique(all, 'role');
        const roles = rawRoles.map(r => ({
            value: r,
            label: r === 'field_officer' ? 'Field Officer' : r.charAt(0).toUpperCase() + r.slice(1)
        }));

        return {
            organizations: getUnique(filtered, 'organization'),
            roles: roles,
            regions: getUnique(regionScoped, 'region'),
        };
    },

    /**
     * EXPORT
     */
    exportCSV: async () => {
        await storage.delay(100);
        const users = storage.load();
        const headers = ['Name', 'Email', 'Organization', 'Role', 'Status', 'Created'];
        const rows = users.map(u => [u.name, u.email, u.organization || '', u.role, u.status, u.createdAt]);
        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    },

    resetData: async () => {
        storage.save([...SEED_USERS]);
        return SEED_USERS;
    }
};
