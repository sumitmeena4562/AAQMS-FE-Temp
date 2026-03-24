import { z } from 'zod';

export const userSchema = z.object({
    name: z.string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50, { message: "Name must be less than 50 characters" }),
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),
    organization: z.string()
        .min(1, { message: "Organization is required" }),
    role: z.string()
        .min(1, { message: "Role is required" }),
    employeeId: z.string()
        .min(1, { message: "Employee ID is required" }),
    designation: z.string()
        .min(1, { message: "Designation is required" }),
    status: z.enum(['active', 'deactive']),
    region: z.string().optional(),
    phoneNumber: z.string().optional(),
    equipmentId: z.string().optional(),
    assignment: z.string().default('unassigned'),
    avatar: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.role === 'Coordinator' && (!data.region || data.region.trim() === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Region is required for Coordinators",
            path: ["region"],
        });
    }
    if (data.role === 'Field Officer') {
        if (!data.phoneNumber || data.phoneNumber.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Phone number is required for Field Officers",
                path: ["phoneNumber"],
            });
        }
        if (!data.equipmentId || data.equipmentId.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Equipment ID is required for Field Officers",
                path: ["equipmentId"],
            });
        }
    }
});
