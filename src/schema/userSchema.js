import { z } from 'zod';

export const userSchema = z.object({
    first_name: z.string()
        .min(2, { message: "First name must be at least 2 characters" })
        .max(50, { message: "First name must be less than 50 characters" }),
    last_name: z.string()
        .min(2, { message: "Last name must be at least 2 characters" })
        .max(50, { message: "Last name must be less than 50 characters" }),
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),
    organization: z.string().optional().nullable(),
    role: z.string().min(1, { message: "Role is required" }),
    status: z.enum(['active', 'deactive']),
    region: z.string().optional().nullable(),
    zone: z.string().optional().nullable(),
    phone_number: z.string().optional().nullable(),
    assignment: z.string().default('standby'),
    avatar: z.string().optional().nullable(),
    employee_id: z.string().optional().nullable(),
    designation: z.string().optional().nullable(),
    equipment_id: z.string().optional().nullable(),
    password: z.string().min(8, "Password must be at least 8 characters").optional(),
});
