import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { registerSchema } from '../../schema/authSchema';
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import { MailIcon, LockIcon, UserIcon } from "../../assets/icon";
import Checkbox from "../../components/ui/Checkbox";
import Button from "../../components/ui/Button";

function Registrationpage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        console.log("Registration Data:", data);

        try {
            // Simulate API request delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success("Account created successfully!");
            navigate('/login');
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("An error occurred during registration.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div style={{
                backgroundColor: 'var(--color-bg-secondary)',
                padding: '28px 24px',
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-premium)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        Create your account
                    </h2>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Join us and start your journey
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        <InputField
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            icon={<UserIcon />}
                            {...register('fullName')}
                            error={errors.fullName?.message}
                            containerStyle={{ marginBottom: 0 }}
                        />

                        <InputField
                            label="Email address"
                            type="email"
                            placeholder="name@company.com"
                            icon={<MailIcon />}
                            {...register('email')}
                            error={errors.email?.message}
                            containerStyle={{ marginBottom: 0 }}
                        />

                        <SelectField
                            label="Role"
                            icon={<UserIcon />}
                            options={[
                                { label: 'Admin', value: 'admin' },
                                { label: 'Cordinator', value: 'cordinator' },
                                { label: 'Field Officer', value: 'field officer' }
                            ]}
                            {...register('role')}
                            error={errors.role?.message}
                            containerStyle={{ marginBottom: 0 }}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            icon={<LockIcon />}
                            {...register('password')}
                            error={errors.password?.message}
                            containerStyle={{ marginBottom: 0 }}
                        />

                        <InputField
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            icon={<LockIcon />}
                            {...register('confirmPassword')}
                            error={errors.confirmPassword?.message}
                            containerStyle={{ marginBottom: 0, gridColumn: '1 / -1' }} // span full width if odd number of elements
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '8px', marginTop: '-8px' }}>
                        <Checkbox
                            label={
                                <span style={{ fontSize: 'var(--font-size-sm)' }}>
                                    I accept the{' '}
                                    <a href="#" style={{ color: 'var(--color-text-primary)', fontWeight: 600, textDecoration: 'none' }}>
                                        Terms and Conditions
                                    </a>
                                </span>
                            }
                            {...register('termsAccepted')}
                        />
                    </div>
                    {errors.termsAccepted && (
                        <p style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '0px', marginBottom: '16px' }}>
                            {errors.termsAccepted.message}
                        </p>
                    )}

                    <div style={{ marginTop: '16px' }}>
                        <Button type="submit" variant="dark" fullWidth disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Sign Up"}
                        </Button>
                    </div>
                </form>

                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Protected by secure JWT authentication
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                Already have an account? <a href="/login" style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Sign in here</a>
            </div>
        </AuthLayout>
    )
}

export default Registrationpage;