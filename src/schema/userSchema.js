import { z } from 'zod';

export const userSchema = z.object({
    firstName: z.string()
        .min(2, { message: "First name must be at least 2 characters" })
        .max(50, { message: "First name must be less than 50 characters" }),
    lastName: z.string()
        .min(2, { message: "Last name must be at least 2 characters" })
        .max(50, { message: "Last name must be less than 50 characters" }),
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),
    organization: z.string().optional(),
    role: z.string()
        .min(1, { message: "Role is required" }),
    employeeId: z.string().optional(),
    status: z.enum(['active', 'deactive']),
    region: z.string().optional(),
    zone: z.string().optional(),
    phoneNumber: z.string().optional(),
    assignment: z.string().default('standby'),
    avatar: z.string().optional(),
    // No password field — backend generates setup link and emails user
});
