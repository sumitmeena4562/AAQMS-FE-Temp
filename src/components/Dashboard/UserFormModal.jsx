import React, { useState, useEffect, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '../../schema/userSchema';
import { 
    FiX, FiChevronRight, FiChevronLeft, FiActivity, FiLayers, FiAlertCircle, FiMail,
    FiPlus, FiMapPin, FiCheckCircle
} from 'react-icons/fi';
import Button from '../UI/Button';
import InputField from '../UI/InputField';
import SelectField from '../UI/SelectField';
import { useOrgStore } from '../../store/useOrgStore';

const ROLE_DETAILS = [
    { 
        id: 'admin', 
        name: 'Admin', 
        desc: 'Full administrative control: Manage users, organizations, and global settings.', 
        icon: <FiLayers size={18} />,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-100',
    },
    { 
        id: 'coordinator', 
        name: 'Coordinator', 
        desc: 'Strategic oversight: Manage regional assets, field units, and operational workflows.', 
        icon: <FiLayers size={18} />,
        color: 'text-sky-600',
        bg: 'bg-sky-50',
        border: 'border-sky-100',
    },
    { 
        id: 'field_officer', 
        name: 'Field Officer', 
        desc: 'Tactical execution: On-site inspections, direct asset management, and data logging.', 
        icon: <FiActivity size={18} />,
        color: 'text-teal-600',
        bg: 'bg-teal-50',
        border: 'border-teal-100',
    }
];

const STATUS_OPTIONS = ['active', 'deactive'];

const UserFormModal = ({ isOpen, onClose, onSubmit, user = null, loading = false }) => {
    const isEdit = !!user;
    const [step, setStep] = useState(0);
    const [submitError, setSubmitError] = useState('');
    const [showWorkAssignment, setShowWorkAssignment] = useState(false);
        // Image selection state
    const [imagePreview, setImagePreview] = useState(user?.avatar || null);
    const fileInputRef = useRef(null); // Ye hidden file input ko trigger karne ke liye hai

    const lastProcessedRef = useRef('');

    const orgs = useOrgStore(state => state.orgs);
    const dynamicOrganizations = orgs.map(org => org.name);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            first_name: '', last_name: '', email: '', organization: '', role: '', 
            assignment: 'standby', status: 'active',
            region: '', zone: '', employee_id: '', 
            phone_number: '', designation: ''
        }
    });

    const currentRole = watch('role');
    const currentStatus = watch('status');

    useEffect(() => {
        if (!isOpen) {
            lastProcessedRef.current = '';
            return;
        }
        
        const currentKey = `${user?.id || 'new'}-${isOpen}`;
        if (lastProcessedRef.current === currentKey) return;
        lastProcessedRef.current = currentKey;

        if (user) {
            reset({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                organization: user.organization || '',
                role: user.role || '',
                assignment: user.assignment || 'standby',
                status: user.status || 'active',
                region: user.region || '',
                zone: user.zone || '',
                employee_id: user.employee_id || '',
                phone_number: user.phone_number || '',
                designation: user.designation || '',
                avatar: user.avatar || ''
            });
            setImagePreview(user.avatar || null);
            setShowWorkAssignment(!!user.organization);
            setStep(1);
        } else {
            reset({ 
                first_name: '', last_name: '', email: '', organization: '', role: '', 
                assignment: 'standby', status: 'active',
                region: '', employee_id: '',
                phone_number: '', designation: '', avatar: ''
            });
            setShowWorkAssignment(false);
            setImagePreview(null);
            setStep(0);
        }
        setSubmitError('');
    }, [user, isOpen, reset]);

    const onFormSubmit = async (data) => {
        setSubmitError('');
        
        // Manual password entry as per user request
        const payload = { ...data };

        // Automatically determine assignment status
        if (payload.organization || payload.region || payload.zone) {
            payload.assignment = 'assigned';
        } else {
            payload.assignment = 'standby';
        }

        const result = await onSubmit(payload);
        if (result?.success) {
            onClose();
        } else {
            setSubmitError(result.error || 'Failed to process request');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // URL.createObjectURL temporarily browser mein image ka address banata hai
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            
            // React Hook Form ko batao ki 'avatar' value change ho gayi hai
            setValue('avatar', previewUrl); 
        }
    };

    const handleRoleSelect = (roleId) => {
        setValue('role', roleId);
        setStep(1);
    };

    const inputClasses = (hasError) => `
        w-full px-4 py-2.5 text-[13px] font-medium rounded-[var(--radius-input)] border outline-none transition-all duration-200
        ${hasError 
            ? 'bg-rose-50/50 border-rose-200 text-rose-900 focus:border-rose-400' 
            : 'bg-card border-border-main text-body focus:border-primary/50 focus:ring-2 focus:ring-primary/5'}
    `;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-title/40 backdrop-blur-md"
                    />
                    
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="relative w-full max-w-[520px] max-h-[90vh] sm:max-h-[85vh] bg-card border border-border-main rounded-[var(--radius-card)] shadow-xl flex flex-col overflow-hidden"
                    >

                        {/* Modal Header */}
                        <div className="relative z-10 p-6 pb-2 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-title tracking-tight leading-none mb-1.5">
                                    {isEdit ? 'Edit User' : 'Add New User'}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    <span className="text-[10px] font-bold text-gray uppercase tracking-wider">
                                        {step === 0 ? 'Select Role' : `Details: ${currentRole}`}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="p-2 text-gray hover:bg-base hover:text-body rounded-lg transition-colors"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {step === 0 ? (
                                    <Motion.div 
                                        key="step0" 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        exit={{ opacity: 0, y: -10 }} 
                                        className="space-y-3 pt-3"
                                    >
                                        <div className="text-[12px] font-medium text-body mb-4 px-1">Select user role type</div>
                                        {ROLE_DETAILS.filter(r => r.id !== 'admin').map(role => (
                                            <div
                                                key={role.id}
                                                onClick={() => handleRoleSelect(role.id)}
                                                className={`group relative p-4 bg-card border border-border-main/50 rounded-[var(--radius-card)] cursor-pointer flex items-center gap-4 transition-all hover:border-border-main hover:bg-base`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl ${role.bg} ${role.color} flex items-center justify-center border border-current/10 shrink-0`}>
                                                    {role.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[15px] font-bold text-title">{role.name}</div>
                                                    <div className="text-[12px] font-medium text-gray truncate mt-0.5">{role.desc}</div>
                                                </div>
                                                <FiChevronRight size={18} className="text-border-main group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                            </div>
                                        ))}
                                    </Motion.div>
                                ) : (
                                    <Motion.div 
                                        key="step1" 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        className="pt-3 space-y-6"
                                    >
                                        {submitError && (
                                            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[12px] font-bold">
                                                <FiAlertCircle size={14} /> {submitError}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit(onFormSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 sm:gap-y-5">
                                            
                                            {/* Avatar Section at the top of Form */}
                                            <div className="col-span-2 flex flex-col items-center justify-center mb-6 pt-2">
                                                <div 
                                                    onClick={() => fileInputRef.current?.click()} 
                                                    className="group relative w-24 h-24 rounded-full border-2 border-dashed border-slate-200 cursor-pointer overflow-hidden hover:border-primary transition-all shadow-sm"
                                                >
                                                    {imagePreview ? (
                                                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                                    ) : (
                                                        <div className="w-full h-full bg-base flex flex-col items-center justify-center text-gray">
                                                            <span className="text-2xl mb-1">📷</span>
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray">Upload</span>
                                                        </div>
                                                    )}
                                                    {/* Overlay on hover */}
                                                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                                        <span className="text-[10px] font-black uppercase">Change</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Hidden Input File */}
                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef} 
                                                    className="hidden" 
                                                    accept="image/*" 
                                                    onChange={handleImageChange} 
                                                />
                                                
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">Profile Picture</p>
                                            </div>

                                            {/* Section Header */}
                                            <div className="col-span-2 flex items-center gap-2 pb-1 border-b border-border-main/50">
                                                <h3 className="text-[11px] font-bold text-gray uppercase tracking-wider">Basic Information</h3>
                                            </div>

                                            <div className="col-span-1">
                                                <InputField
                                                    label="First Name"
                                                    placeholder="e.g. John"
                                                    {...register('first_name')}
                                                    error={errors.first_name?.message}
                                                    required
                                                />
                                            </div>

                                            <div className="col-span-1">
                                                <InputField
                                                    label="Last Name"
                                                    placeholder="e.g. Doe"
                                                    {...register('last_name')}
                                                    error={errors.last_name?.message}
                                                    required
                                                />
                                            </div>

                                            <div className="col-span-1">
                                                <InputField
                                                    label="Email Address"
                                                    type="email"
                                                    placeholder="user@example.com"
                                                    {...register('email')}
                                                    error={errors.email?.message}
                                                    required
                                                />
                                            </div>

                                            <div className="col-span-1">
                                                <InputField
                                                    label="Phone Number"
                                                    placeholder="+91-0000000000"
                                                    {...register('phone_number')}
                                                    error={errors.phone_number?.message}
                                                />
                                            </div>


                                            <div className="col-span-1">
                                                <InputField
                                                    label={isEdit ? "New Password (Optional)" : "Set Password"}
                                                    type="password"
                                                    placeholder={isEdit ? "Leave blank to keep current" : "Min 8 characters"}
                                                    {...register('password')}
                                                    error={errors.password?.message}
                                                    required={!isEdit}
                                                />
                                            </div>

                                            {!isEdit && (
                                                <div className="col-span-2">
                                                    <div className="flex items-center gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-700 text-[11px] font-bold">
                                                        <FiMail size={14} className="shrink-0" />
                                                        <span>Login credentials will be automatically emailed to the user.</span>
                                                    </div>
                                                </div>
                                            )}



                                            {isEdit && (
                                                <div className="col-span-1">
                                                    <InputField
                                                        label="System ID"
                                                        {...register('employeeId')}
                                                        readOnly
                                                        className="bg-gray/5"
                                                    />
                                                </div>
                                            )}

                                            {/* Designation field removed as per user request */}

                                            <div className="col-span-2 mt-2">
                                                {!showWorkAssignment ? (
                                                    <button 
                                                        type="button"
                                                        onClick={() => setShowWorkAssignment(true)}
                                                        className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/30 transition-all flex items-center justify-center gap-2 group"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                            <FiPlus size={16} />
                                                        </div>
                                                        <span className="text-[13px] font-bold">Assign Work Area</span>
                                                    </button>
                                                ) : (
                                                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 relative">
                                                        <button 
                                                            type="button"
                                                            onClick={() => setShowWorkAssignment(false)}
                                                            className="absolute top-3 right-3 text-gray hover:text-primary transition-colors"
                                                            title="Remove assignment"
                                                        >
                                                            <FiX size={14} />
                                                        </button>
                                                        
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                                                                <FiMapPin size={16} />
                                                            </div>
                                                            <div>
                                                                <div className="text-[12px] font-bold text-title leading-none">Assignment Details</div>
                                                                <div className="text-[10px] font-medium text-gray leading-none mt-1">Linking user to operational units</div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <SelectField
                                                                label="Organization / Company"
                                                                {...register('organization')}
                                                                error={errors.organization?.message}
                                                                options={dynamicOrganizations}
                                                            />

                                                            {currentRole === 'coordinator' && (
                                                                <InputField
                                                                    label="Work Region / Area"
                                                                    placeholder="e.g. North Zone"
                                                                    {...register('region')}
                                                                    error={errors.region?.message}
                                                                />
                                                            )}

                                                            {currentRole === 'field_officer' && (
                                                                <InputField
                                                                    label="Operational Zone"
                                                                    placeholder="e.g. Zone A-101"
                                                                    {...register('zone')}
                                                                    error={errors.zone?.message}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {currentRole === 'field_officer' && (
                                                <div className="col-span-2 mt-2">
                                                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-[11px] font-bold">
                                                        <FiCheckCircle size={14} /> Field Officer access level granted
                                                    </div>
                                                </div>
                                            )}

                                            <div className="col-span-2">
                                                <label className="block text-[11px] font-bold text-gray mb-1.5 ml-1 uppercase tracking-wider">Operational Status</label>
                                                <div className="flex gap-2">
                                                    {STATUS_OPTIONS.map(s => (
                                                        <button 
                                                            type="button"
                                                            key={s} 
                                                            onClick={() => setValue('status', s)} 
                                                            className={`flex-1 py-2.5 px-4 rounded-[var(--radius-button)] text-[12px] font-bold uppercase transition-all
                                                                ${currentStatus === s 
                                                                    ? 'bg-title text-white shadow-md'
                                                                    : 'bg-white border border-border-main text-gray hover:border-border-hover'}`}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </form>
                                    </Motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Modal Footer */}
                        <div className="relative z-10 p-5 bg-base border-t border-border-main flex items-center justify-between">
                            <div className="flex items-center">
                                {step === 1 && !isEdit && (
                                    <button 
                                        type="button"
                                        onClick={() => setStep(0)} 
                                        className="text-[11px] font-bold text-gray uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        <FiChevronLeft size={14} /> Back
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="ghost"
                                    onClick={onClose} 
                                    className="!text-[11px] !font-bold !uppercase !tracking-wider !text-gray hover:!text-title"
                                >
                                    Cancel
                                </Button>
                                {step === 1 && (
                                    <Button 
                                        onClick={handleSubmit(onFormSubmit)} 
                                        loading={loading} 
                                        className="!px-6 !rounded-[var(--radius-button)] !text-[11px] !font-bold !uppercase !tracking-wider"
                                    >
                                        {isEdit ? 'Save Changes' : 'Create User'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default UserFormModal;
