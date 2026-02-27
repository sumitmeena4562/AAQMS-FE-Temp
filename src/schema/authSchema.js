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

export const registerSchema = z.object({
    fullName: z.string()
        .min(2, { message: "Full name must be at least 2 characters" })
        .max(50, { message: "Full name must be less than 50 characters" }),
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[a-z]/, { message: "Must contain lowercase letter" })
        .regex(/[A-Z]/, { message: "Must contain uppercase letter" })
        .regex(/[0-9]/, { message: "Must contain a number" }),
    confirmPassword: z.string()
        .min(1, { message: "Confirm Password is required" }),
    role: z.enum(['farmer', 'vendor', 'buyer'], {
        errorMap: () => ({ message: "Please select a valid role" })
    }),
    termsAccepted: z.boolean().refine(val => val === true, {
        message: "You must accept the terms and conditions",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});