// ─── User Service — Full CRUD with localStorage persistence ─────────────────
// When a real API is ready, replace these functions with actual fetch/axios calls.

const STORAGE_KEY = 'aaqms_users';

// ── Seed Data ──
const SEED_USERS = [
    { id: 1,  name: "Sarah Jenkins",    email: "sarah.j@acmecorp.com",   organization: "Acme Corp",     role: "Coordinator",   assignment: "unassigned", status: "active",   verified: true,  lastActive: "2 hours ago",  createdAt: "2024-11-15" },
    { id: 2,  name: "David Kim",        email: "david.kim@ssism.com",    organization: "SSISM",         role: "Field Officer", assignment: "assigned",   status: "active",   verified: true,  lastActive: "Now",          createdAt: "2024-10-20" },
    { id: 3,  name: "Elena Rodriguez",  email: "elena.r@globex.org",     organization: "Globex",        role: "Coordinator",   assignment: "assigned",   status: "active",   verified: true,  lastActive: "5 mins ago",   createdAt: "2024-09-12" },
    { id: 4,  name: "Marcus Thorne",    email: "m.thorne@innovate.io",   organization: "Innovate Ltd",  role: "Field Officer", assignment: "unassigned", status: "inactive", verified: false, lastActive: "3 days ago",   createdAt: "2025-01-05" },
    { id: 5,  name: "Aisha Khan",       email: "aisha.k@techcore.com",   organization: "TechCore",      role: "Coordinator",   assignment: "assigned",   status: "active",   verified: true,  lastActive: "1 hour ago",   createdAt: "2024-08-01" },
    { id: 6,  name: "John Smith",       email: "j.smith@builders.inc",   organization: "Builders Inc",  role: "Field Officer", assignment: "assigned",   status: "active",   verified: true,  lastActive: "10 mins ago",  createdAt: "2024-12-18" },
    { id: 7,  name: "Yuki Tanaka",      email: "yuki.t@zensoft.jp",      organization: "ZenSoft",       role: "Field Officer", assignment: "assigned",   status: "active",   verified: true,  lastActive: "Now",          createdAt: "2024-07-22" },
    { id: 8,  name: "Liam O'Connor",    email: "liam.oc@emerald.ie",     organization: "Emerald Eco",   role: "Coordinator",   assignment: "unassigned", status: "active",   verified: false, lastActive: "1 day ago",    createdAt: "2025-02-01" },
    { id: 9,  name: "Sofia Rossi",      email: "s.rossi@lume.it",        organization: "Lume SpA",      role: "Field Officer", assignment: "assigned",   status: "active",   verified: true,  lastActive: "4 hours ago",  createdAt: "2024-06-10" },
    { id: 10, name: "Chen Wei",         email: "c.wei@easternstar.cn",   organization: "Eastern Star",  role: "Coordinator",   assignment: "assigned",   status: "inactive", verified: true,  lastActive: "2 days ago",   createdAt: "2024-05-30" },
    { id: 11, name: "Maria Garcia",     email: "m.garcia@techcorp.es",   organization: "TechCorp",      role: "Admin",         assignment: "assigned",   status: "active",   verified: true,  lastActive: "30 mins ago",  createdAt: "2024-04-14" },
    { id: 12, name: "Ahmed Hassan",     email: "a.hassan@innovate.ae",   organization: "Innovate Labs", role: "Field Officer", assignment: "assigned",   status: "active",   verified: true,  lastActive: "15 mins ago",  createdAt: "2024-03-20" },
];

// ── Helpers ──
const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

function loadUsers() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) { /* fall through */ }
    // First load — seed
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
    return [...SEED_USERS];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getNextId(users) {
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
}

// ── Service API ──
export const userService = {
    /**
     * Fetch all users (with optional filters + search)
     */
    getUsers: async (filters = {}, searchQuery = '') => {
        await delay();
        let users = loadUsers();

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            users = users.filter(u =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                (u.organization || '').toLowerCase().includes(q)
            );
        }

        // Filters
        if (filters.organization) users = users.filter(u => u.organization === filters.organization);
        if (filters.role)         users = users.filter(u => u.role === filters.role);
        if (filters.status)       users = users.filter(u => u.status === filters.status);
        if (filters.assignment)   users = users.filter(u => u.assignment === filters.assignment);

        return users;
    },

    /**
     * Get a single user by ID
     */
    getUserById: async (id) => {
        await delay(100);
        const users = loadUsers();
        return users.find(u => u.id === id) || null;
    },

    /**
     * Create a new user
     */
    createUser: async (userData) => {
        await delay(300);
        const users = loadUsers();

        // Duplicate email check
        if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            throw new Error('A user with this email already exists');
        }

        const newUser = {
            id: getNextId(users),
            name: userData.name,
            email: userData.email,
            organization: userData.organization || null,
            role: userData.role || 'Field Officer',
            assignment: userData.assignment || 'unassigned',
            status: userData.status || 'active',
            verified: false,
            lastActive: 'Never',
            createdAt: new Date().toISOString().split('T')[0],
        };

        users.push(newUser);
        saveUsers(users);
        return newUser;
    },

    /**
     * Update an existing user
     */
    updateUser: async (id, updates) => {
        await delay(300);
        const users = loadUsers();
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) throw new Error('User not found');

        // Duplicate email check (exclude self)
        if (updates.email && users.some(u => u.id !== id && u.email.toLowerCase() === updates.email.toLowerCase())) {
            throw new Error('A user with this email already exists');
        }

        users[idx] = { ...users[idx], ...updates };
        saveUsers(users);
        return users[idx];
    },

    /**
     * Delete a user
     */
    deleteUser: async (id) => {
        await delay(200);
        let users = loadUsers();
        users = users.filter(u => u.id !== id);
        saveUsers(users);
        return true;
    },

    /**
     * Bulk action — activate, deactivate, or delete multiple users
     */
    bulkAction: async (ids, action) => {
        await delay(300);
        let users = loadUsers();

        if (action === 'delete') {
            users = users.filter(u => !ids.includes(u.id));
        } else if (action === 'activate') {
            users = users.map(u => ids.includes(u.id) ? { ...u, status: 'active' } : u);
        } else if (action === 'deactivate') {
            users = users.map(u => ids.includes(u.id) ? { ...u, status: 'inactive' } : u);
        }

        saveUsers(users);
        return users;
    },

    /**
     * Get stats (computed from current data)
     */
    getUserStats: async () => {
        await delay(100);
        const users = loadUsers();
        return {
            total: users.length,
            active: users.filter(u => u.status === 'active').length,
            inactive: users.filter(u => u.status === 'inactive').length,
            unassigned: users.filter(u => u.assignment === 'unassigned').length,
        };
    },

    /**
     * Get filter option lists
     */
    getFilterOptions: async () => {
        await delay(50);
        const users = loadUsers();
        return {
            organizations: [...new Set(users.map(u => u.organization).filter(Boolean))].sort(),
            roles: [...new Set(users.map(u => u.role).filter(Boolean))].sort(),
        };
    },

    /**
     * Export users as CSV string
     */
    exportCSV: async () => {
        await delay(100);
        const users = loadUsers();
        const headers = ['Name', 'Email', 'Organization', 'Role', 'Assignment', 'Status', 'Created'];
        const rows = users.map(u => [u.name, u.email, u.organization || '', u.role, u.assignment, u.status, u.createdAt]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        return csv;
    },

    /**
     * Reset to seed data
     */
    resetData: async () => {
        await delay(100);
        saveUsers([...SEED_USERS]);
        return SEED_USERS;
    },
};
