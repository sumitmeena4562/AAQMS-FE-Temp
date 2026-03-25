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
    organization: z.string().optional(),
    role: z.string()
        .min(1, { message: "Role is required" }),
    employee_id: z.string()
        .min(1, { message: "Employee ID is required" }),
    designation: z.string()
        .min(1, { message: "Designation is required" }),
    status: z.enum(['active', 'deactive']),
    region: z.string().optional(),
    phone_number: z.string().optional(),
    equipment_id: z.string().optional(),
    assignment: z.string().default('standby'),
    avatar: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters").optional(),
}).superRefine((data, ctx) => {
    if (data.role === 'coordinator' && (!data.region || data.region.trim() === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Region is required for Coordinators",
            path: ["region"],
        });
    }
    if (data.role === 'field_officer') {
        if (!data.phone_number || data.phone_number.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Phone number is required for Field Officers",
                path: ["phone_number"],
            });
        }
        if (!data.equipment_id || data.equipment_id.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Equipment ID is required for Field Officers",
                path: ["equipment_id"],
            });
        }
    }
});
