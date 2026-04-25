import { z } from 'zod';

export const userSchema = z.object({
    name: z.string().min(1, 'Name is required')
        .max(100, { message: "Full name must be less than 100 characters" }),
    email: z.string().email('Invalid email').or(z.literal('')).optional().nullable(),
    organisation_id: z.string().optional().nullable(),
    organisation: z.string().optional().nullable(),
    role: z.string().min(1, { message: "Role is required" }),
    status: z.enum(['active', 'deactive', 'ACTIVE', 'INACTIVE']),
    region: z.string().optional().nullable(),
    zone: z.string().optional().nullable(),
    mobile_number: z.string().optional().nullable(),
    coordinator_id: z.string().optional().nullable(),
    assignment: z.string().default('standby'),
    avatar: z.string().optional().nullable(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .or(z.literal(''))
        .optional(),
}).refine((data) => {
    // If role is coordinator or field officer, organisation_id MUST be present
    const role = (data.role || '').toLowerCase();
    if (['coordinator', 'field_officer'].includes(role)) {
        return !!data.organisation_id;
    }
    return true;
}, {
    message: "Organization assignment is mandatory for this role",
    path: ["organisation_id"]
});
