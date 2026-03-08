// Mock User Service for AAQMS
const USERS_DATA = [
    {
        id: 1,
        name: "Sarah Jenkins",
        email: "sarah.j@acmecorp.com",
        organization: "Acme Corp",
        role: "Coordinator",
        assignment: "unassigned",
        status: "active",
        avatar: null,
        lastActive: "2 hours ago"
    },
    {
        id: 2,
        name: "David Kim",
        email: "david.kim@ssism.com",
        organization: "SSISM",
        role: "Field Officer",
        assignment: "assigned",
        status: "active",
        avatar: null,
        lastActive: "Now"
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        email: "elena.r@globex.org",
        organization: "Globex",
        role: "Coordinator",
        assignment: "assigned",
        status: "active",
        avatar: null,
        lastActive: "5 mins ago"
    },
    {
        id: 4,
        name: "Marcus Thorne",
        email: "m.thorne@innovate.io",
        organization: "Innovate Ltd",
        role: "Field Officer",
        assignment: "unassigned",
        status: "inactive",
        avatar: null,
        lastActive: "3 days ago"
    },
    {
        id: 5,
        name: "Aisha Khan",
        email: "aisha.k@techcore.com",
        organization: "TechCore",
        role: "Coordinator",
        assignment: "assigned",
        status: "active",
        avatar: null,
        lastActive: "1 hour ago"
    },
    {
        id: 6,
        name: "John Smith",
        email: "j.smith@builders.inc",
        organization: "Builders Inc",
        role: "Field Officer",
        assignment: "assigned",
        status: "active",
        avatar: null,
        lastActive: "10 mins ago"
    },
    {
        id: 7,
        name: "Yuki Tanaka",
        email: "yuki.t@zensoft.jp",
        organization: "ZenSoft",
        role: "Field Officer",
        assignment: "assigned",
        status: "active",
        avatar: null,
        lastActive: "Now"
    },
    {
        id: 8,
        name: "Liam O'Connor",
        email: "liam.oc@emerald.ie",
        organization: "Emerald Eco",
        role: "Coordinator",
        assignment: "unassigned",
        status: "active",
        avatar: null,
        lastActive: "1 day ago"
    },
    {
        id: 9,
        name: "Sofia Rossi",
        email: "s.rossi@lume.it",
        organization: "Lume SpA",
        role: "Field Officer",
        assignment: "assigned",
        status: "active",
        avatar: null,
        lastActive: "4 hours ago"
    },
    {
        id: 10,
        name: "Chen Wei",
        email: "c.wei@easternstar.cn",
        organization: "Eastern Star",
        role: "Coordinator",
        assignment: "assigned",
        status: "inactive",
        avatar: null,
        lastActive: "2 days ago"
    }
];

export const userService = {
    getUsers: async (filters = {}, searchQuery = "") => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        let filtered = [...USERS_DATA];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.organization.toLowerCase().includes(query)
            );
        }

        if (filters.organization) {
            filtered = filtered.filter(u => u.organization === filters.organization);
        }
        if (filters.role) {
            filtered = filtered.filter(u => u.role === filters.role);
        }
        if (filters.status) {
            filtered = filtered.filter(u => u.status === filters.status);
        }

        return filtered;
    },

    getUserStats: async () => {
        // In a real app, this would be computed on the backend
        return {
            total: USERS_DATA.length,
            active: USERS_DATA.filter(u => u.status === 'active').length,
            pending: 0, // Mocking pending
            coordinators: USERS_DATA.filter(u => u.role === 'Coordinator').length
        };
    },

    getFilterOptions: async () => {
        return {
            organizations: [...new Set(USERS_DATA.map(u => u.organization))],
            roles: [...new Set(USERS_DATA.map(u => u.role))],
        };
    }
};
