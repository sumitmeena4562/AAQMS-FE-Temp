import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[a-z]/, { message: "Must contain lowercase letter" })
        .regex(/[A-Z]/, { message: "Must contain uppercase letter" })
        .regex(/[0-9]/, { message: "Must contain a number" })
});