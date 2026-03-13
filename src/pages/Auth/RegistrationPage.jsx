import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { registerSchema } from '../../schema/authSchema';
import AuthForm from '../../components/Auth/AuthForm';
import InputField from "../../components/UI/InputField";
import SelectField from "../../components/UI/SelectField";
import Checkbox from "../../components/UI/Checkbox";
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
                <span className="font-semibold text-slate-500">
                    Already have an account? 
                    <a 
                        href="/login" 
                        className="text-primary font-black ml-1.5 border-b-2 border-transparent hover:border-primary transition-all duration-300"
                    >
                        Sign in here
                    </a>
                </span>
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
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <SelectField
                            label="Role"
                            icon={<UserIcon />}
                            options={[
                                { label: 'Admin', value: 'admin' },
                                { label: 'Coordinator', value: 'coordinator' },
                                { label: 'Field Officer', value: 'field officer' }
                            ]}
                            {...register('role')}
                            error={errors.role?.message}
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
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} className="sm:col-span-2">
                        <InputField
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            icon={<LockIcon />}
                            {...register('confirmPassword')}
                            error={errors.confirmPassword?.message}
                        />
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="flex justify-start items-center mb-2 sm:col-span-2"
                    >
                        <Checkbox
                            label={
                                <span className="text-sm font-medium">
                                    I accept the{' '}
                                    <a 
                                        href="#" 
                                        className="text-primary font-black hover:underline underline-offset-4"
                                    >
                                        Terms and Conditions
                                    </a>
                                </span>
                            }
                            {...register('termsAccepted')}
                        />
                    </motion.div>
                    
                    <AnimatePresence>
                        {errors.termsAccepted && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-rose-500 text-[11px] font-bold mt-[-8px] mb-4 sm:col-span-2"
                            >
                                {errors.termsAccepted.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AuthForm>
    );
}

export default RegistrationPage;
