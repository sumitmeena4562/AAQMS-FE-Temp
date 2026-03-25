import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string()
        .min(1, { message: "Email address is required" })
        .email({ message: "Invalid email format (e.g., user@company.com)" }),
    password: z.string()
        .min(1, { message: "Password is required" }),
    rememberMe: z.boolean().optional()
});

export const registerSchema = z.object({
    fullName: z.string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50, { message: "Name must be less than 50 characters" }),
    email: z.string()
        .min(1, { message: "Email address is required" })
        .email({ message: "Invalid email format (e.g., user@company.com)" }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Security rule: Minimum 8 characters" })
        .regex(/[a-z]/, { message: "Missing lowercase letter" })
        .regex(/[A-Z]/, { message: "Missing uppercase letter" })
        .regex(/[0-9]/, { message: "Missing numerical digit" }),
    confirmPassword: z.string()
        .min(1, { message: "Please confirm your password" }),
    role: z.enum(['admin', 'coordinator', 'field officer'], {
        errorMap: () => ({ message: "Stakeholder role is required" })
    }),
    termsAccepted: z.boolean().refine(val => val === true, {
        message: "Terms and conditions must be accepted",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password mismatch: Values do not match",
    path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
    email: z.string()
        .min(1, { message: "Account email is required" })
        .email({ message: "Invalid email format" }),
});

export const otpSchema = z.object({
    otp: z.string()
        .length(6, { message: "Verification code must be 6 digits" })
        .regex(/^\d+$/, { message: "Only numerical digits allowed" }),
});

export const resetPasswordSchema = z.object({
    password: z.string()
        .min(1, { message: "New password is required" })
        .min(8, { message: "Security rule: Minimum 8 characters" })
        .regex(/[a-z]/, { message: "Missing lowercase letter" })
        .regex(/[A-Z]/, { message: "Missing uppercase letter" })
        .regex(/[0-9]/, { message: "Missing numerical digit" }),
    confirmPassword: z.string()
        .min(1, { message: "Please confirm your new password" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password mismatch: Values do not match",
    path: ["confirmPassword"],
});