import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { registerSchema } from '../../schema/authSchema';
import AuthForm from '../../components/Auth/AuthForm';
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import Checkbox from "../../components/ui/Checkbox";
import { MailIcon, LockIcon, UserIcon } from "../../assets/icon";

function RegistrationPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
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
        <AuthForm
            title="Create your account"
            subtitle="Join the next generation of risk management"
            schema={registerSchema}
            onSubmit={onSubmit}
            isLoading={isLoading}
            submitText="Sign Up"
            loadingText="Creating account..."
            grid={true}
            footer={
                <>
                    Already have an account? <a href="/login" style={{ color: 'var(--color-text-primary)', fontWeight: 700, textDecoration: 'none', borderBottom: '1.5px solid var(--color-text-primary)' }}>Sign in here</a>
                </>
            }
        >
            {({ register, errors, itemVariants }) => (
                <>
                    <motion.div variants={itemVariants}>
                        <InputField
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            icon={<UserIcon />}
                            {...register('fullName')}
                            error={errors.fullName?.message}
                            containerStyle={{ marginBottom: 0 }}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <InputField
                            label="Email address"
                            type="email"
                            placeholder="name@company.com"
                            icon={<MailIcon />}
                            {...register('email')}
                            error={errors.email?.message}
                            containerStyle={{ marginBottom: 0 }}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
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
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <InputField
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            icon={<LockIcon />}
                            {...register('password')}
                            error={errors.password?.message}
                            containerStyle={{ marginBottom: 0 }}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} style={{ gridColumn: '1 / -1' }}>
                        <InputField
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            icon={<LockIcon />}
                            {...register('confirmPassword')}
                            error={errors.confirmPassword?.message}
                            containerStyle={{ marginBottom: 0 }}
                        />
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '12px', gridColumn: '1 / -1' }}
                    >
                        <Checkbox
                            label={
                                <span style={{ fontSize: 'var(--font-size-sm)' }}>
                                    I accept the{' '}
                                    <a href="#" style={{ color: 'var(--color-primary, var(--color-text-primary))', fontWeight: 600, textDecoration: 'none' }}>
                                        Terms and Conditions
                                    </a>
                                </span>
                            }
                            {...register('termsAccepted')}
                        />
                    </motion.div>
                    {errors.termsAccepted && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '-4px', marginBottom: '16px', gridColumn: '1 / -1' }}
                        >
                            {errors.termsAccepted.message}
                        </motion.p>
                    )}
                </>
            )}
        </AuthForm>
    );
}

export default RegistrationPage;
