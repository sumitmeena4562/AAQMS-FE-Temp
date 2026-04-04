import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" }),
    rememberMe: z.boolean().optional()
});

export const registerSchema = z.object({
    fullName: z.string()
        .min(2, { message: "Name must be at least 2 characters" }),
    email: z.string()
        .email({ message: "Invalid email format" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
        .regex(/\d/, { message: "Must contain at least one digit" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Must contain at least one special character" }),
    confirmPassword: z.string(),
    role: z.enum(['ADMIN', 'COORDINATOR', 'FIELD_OFFICER'], {
        errorMap: () => ({ message: "Please select a valid role" })
    })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email format" }),
});

export const otpSchema = z.object({
    otp: z.string()
        .length(6, { message: "OTP must be exactly 6 digits" })
        .regex(/^\d+$/, { message: "OTP must be numeric" }),
});

export const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
        .regex(/\d/, { message: "Must contain at least one digit" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Must contain at least one special character" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});