import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { registerSchema } from '../../schema/authSchema';
import AuthForm from '../../components/Auth/AuthForm';
import InputField from "../../components/UI/InputField";
import SelectField from "../../components/UI/SelectField";
import Checkbox from "../../components/UI/Checkbox";
import { MailIcon, LockIcon, UserIcon } from "../../assets/icon";
import { FiAlertCircle } from 'react-icons/fi';

import useAuthStore from '../../store/authStore';

function RegistrationPage() {
    const { register: registerUser, isLoading, error: authError } = useAuthStore();
    const navigate = useNavigate();
    const [localError, setLocalError] = useState(null);
    const [shakeTrigger, setShakeTrigger] = useState(0);

    const onSubmit = async (data) => {
        setLocalError(null);
        const result = await registerUser(data);
        if (result.success) {
            toast.success("Registration successful! You can now sign in.");
            navigate('/login');
        } else {
            setLocalError(result.error);
            setShakeTrigger(prev => prev + 1);
            toast.error(result.error || "An error occurred during registration.");
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
                    <Link 
                        to="/login" 
                        className="text-primary font-black ml-1.5 border-b-2 border-transparent hover:border-primary transition-all duration-300"
                    >
                        Sign in here
                    </Link>
                </span>
            }
        >
            {({ register, errors, itemVariants }) => (
                <motion.div 
                    key={shakeTrigger}
                    animate={shakeTrigger > 0 ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 10 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4"
                >
                    {localError && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="sm:col-span-2 bg-rose-50 border border-rose-200 rounded-xl p-3 mb-2 flex items-center gap-2.5 shadow-sm"
                        >
                            <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                                <FiAlertCircle className="text-rose-600" size={14} />
                            </div>
                            <p className="text-rose-700 text-[11px] font-black uppercase tracking-widest leading-none">
                                {localError}
                            </p>
                        </motion.div>
                    )}

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
                                { label: 'Field Officer', value: 'field_officer' }
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
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                className="flex items-center gap-1.5 text-rose-500 text-[11px] font-bold mt-[-8px] mb-4 sm:col-span-2 ml-1"
                            >
                                <FiAlertCircle size={13} strokeWidth={2.5} />
                                <span>{errors.termsAccepted.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AuthForm>
    );
}

export default RegistrationPage;
