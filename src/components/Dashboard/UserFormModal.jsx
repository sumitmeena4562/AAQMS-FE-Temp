import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '../../schema/userSchema';
import { 
    FiX, FiChevronRight, FiChevronLeft, FiActivity, FiLayers, FiAlertCircle, FiMail,
    FiPlus, FiMapPin, FiCheckCircle, FiShield, FiBriefcase
} from 'react-icons/fi';
import Button from '../UI/Button';
import InputField from '../UI/InputField';
import SelectField from '../UI/SelectField';
import { organizationService } from '../../services/organizationService';
import { userService } from '../../services/userService';

const ROLE_DETAILS = [
    { 
        id: 'admin', 
        name: 'Admin', 
        desc: 'Full administrative control: Manage users, organizations, and global settings.', 
        icon: <FiShield size={18} />,
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
    const isEdit = !!(user && user.id);
    const [step, setStep] = useState(0);
    const [submitError, setSubmitError] = useState('');
    const [showWorkAssignment, setShowWorkAssignment] = useState(false);
        // Image selection state
    const [imagePreview, setImagePreview] = useState(user?.avatar || null);
    const fileInputRef = useRef(null); // Ye hidden file input ko trigger karne ke liye hai

    const lastProcessedRef = useRef('');

    // Dynamic Options State
    const [availableOrgs, setAvailableOrgs] = useState([]);
    const [assignmentData, setAssignmentData] = useState([]);
    const [availableCoordinators, setAvailableCoordinators] = useState([]);
    const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
    const [isLoadingSites, setIsLoadingSites] = useState(false);
    const [isLoadingCoordinators, setIsLoadingCoordinators] = useState(false);


    // Fetch initial organizations
    useEffect(() => {
        const fetchOrgs = async () => {
            setIsLoadingOrgs(true);
            try {
                const data = await organizationService.getOrganizations({ dropdown: 'true' });
                setAvailableOrgs(Array.isArray(data) ? data : (data.results || []));
            } catch (err) {
                console.error("Failed to load orgs for form:", err);
            } finally {
                setIsLoadingOrgs(false);
            }
        };
        if (isOpen) fetchOrgs();
    }, [isOpen]);

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
            name: '', email: '', organisation_id: '', role: '', 
            assignment: 'standby', status: 'active',
            region: '', zone: '', coordinator_id: '',
            mobile_number: ''
        }
    });

    // Helper to fetch data (Sites or Zones) based on role
    const fetchAssignmentDataForOrg = useCallback(async (orgId) => {
        setIsLoadingSites(true);
        setIsLoadingCoordinators(true);
        try {
            const role_name = watch('role')?.toUpperCase();
            let data = [];
            if (role_name === 'FIELD_OFFICER') {
                data = await organizationService.getZonesByOrg(orgId);
                // Also fetch coordinators for this org
                const coords = await userService.getCoordinators(orgId);
                setAvailableCoordinators(Array.isArray(coords) ? coords : []);
                setAssignmentData(Array.isArray(data) ? data : (data.results || []));
            } else {
                setAssignmentData([]);
            }
        } catch (err) {
            console.error("Failed to load assignment data:", err);
        } finally {
            setIsLoadingSites(false);
            setIsLoadingCoordinators(false);
        }
    }, [watch]);

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
            // Flatten nested profile data for the form
            const roleStr = typeof user.role === 'string' ? user.role : (user.role_name || user.role?.role_name || '');
            const role_name = roleStr.toUpperCase();
            const profile = user.field_officer_profile || user.coordinator_profile || user.admin_profile || {};
            
            // Extract IDs carefully (handle both object and ID string cases)
            const orgId = user.organisation_id || (typeof profile.organisation === 'object' ? profile.organisation?.id : profile.organisation) || '';
            const phone = user.mobile_number || profile.mobile_number || '';
            const avatarVal = user.avatar || profile.avatar || '';

            reset({
                name: user.name || '',
                email: user.email || '',
                organisation_id: orgId,
                role: role_name.toLowerCase(),
                assignment: (orgId || profile.assigned_region || profile.current_zone) ? 'assigned' : 'standby',
                status: user.is_active ? 'active' : 'deactive',
                region: profile.assigned_region || '',
                zone: (typeof profile.current_zone === 'object' ? profile.current_zone?.id : profile.current_zone) || profile.current_zone || '',
                coordinator_id: (typeof profile.coordinator === 'object' ? profile.coordinator?.id : profile.coordinator) || profile.coordinator || '',
                mobile_number: phone,
                avatar: avatarVal
            });
            
            setImagePreview(avatarVal || null);
            setShowWorkAssignment(!!orgId);
            if (orgId) fetchAssignmentDataForOrg(orgId);
            setStep(1);
        } else {
            reset({ 
                name: '', email: '', organisation_id: '', role: '', 
                assignment: 'standby', status: 'active',
                region: '', 
                mobile_number: '', avatar: '',
                coordinator_id: ''
            });
            setShowWorkAssignment(false);
            setImagePreview(null);
            setStep(0);
        }
        setSubmitError('');
    }, [user, isOpen, reset, fetchAssignmentDataForOrg]);

    // Re-fetch assignment data if role changes during edit mode
    useEffect(() => {
        const orgId = watch('organisation_id');
        if (isOpen && orgId && currentRole) {
            fetchAssignmentDataForOrg(orgId);
        }
    }, [currentRole, isOpen, watch, fetchAssignmentDataForOrg]);

    const onFormSubmit = async (data) => {
        setSubmitError('');
        
        // Prepare comprehensive payload for backend sync
        const payload = { 
            ...data,
            role: data.role.toUpperCase(),
            is_active: data.status === 'active',
            avatar: imagePreview, // Use current preview (Base64 or existing URL)
            mobile_number: data.mobile_number || null,
            organisation_id: data.organisation_id || null
        };

        // Automatic assignment state for UI/logic if needed
        payload.assignment = (payload.organisation_id || data.region || data.zone) ? 'assigned' : 'standby';

        // Role-specific field mapping for BE consistency
        if (payload.role === 'COORDINATOR') {
            payload.region = data.region || null;
            payload.zone = null;
            payload.coordinator_id = null;
        } else if (payload.role === 'FIELD_OFFICER') {
            payload.zone = data.zone || null;
            payload.region = null;
            payload.coordinator_id = data.coordinator_id || null;
        } else {
            payload.region = null;
            payload.zone = null;
            payload.coordinator_id = null;
        }

        const result = await onSubmit(payload);
        if (result?.success) {
            onClose();
        } else {
            setSubmitError(result?.error || 'Failed to process request');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setValue('avatar', reader.result); 

            };
            reader.readAsDataURL(file);
        }
    };

    const handleRoleSelect = (roleId) => {
        setValue('role', roleId);
        setStep(1);
    };



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

                                            <div className="col-span-2">
                                                <InputField
                                                    label="Full Name"
                                                    placeholder="e.g. John Doe"
                                                    {...register('name')}
                                                    error={errors.name?.message}
                                                    required
                                                />
                                            </div>

                                            <div className="col-span-2 sm:col-span-1">
                                                <InputField
                                                    label="Email Address"
                                                    placeholder="e.g. john@example.com"
                                                    {...register('email')}
                                                    error={errors.email?.message}
                                                    required
                                                />
                                            </div>

                                            <div className="col-span-2 sm:col-span-1">
                                                <InputField
                                                    label="Contact Number"
                                                    placeholder="e.g. +91 9876543210"
                                                    {...register('mobile_number')}
                                                    error={errors.mobile_number?.message}
                                                />
                                            </div>

                                            {!isEdit && (
                                                <div className="col-span-2">
                                                    <InputField
                                                        label="Account Password"
                                                        type="password"
                                                        placeholder="Minimum 8 characters"
                                                        {...register('password')}
                                                        error={errors.password?.message}
                                                    />
                                                    <p className="text-[10px] text-gray/60 mt-1.5 ml-1 italic font-medium">Default: AAQMS@admin123 (if left blank)</p>
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
                                                        <span className="text-[13px] font-bold">
                                                            {currentRole === 'coordinator' ? 'Link to Organization' : 'Assign Operational Units'}
                                                        </span>
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
                                                                {currentRole === 'coordinator' ? <FiBriefcase size={16} /> : <FiMapPin size={16} />}
                                                            </div>
                                                            <div>
                                                                <div className="text-[12px] font-bold text-title leading-none">
                                                                    {currentRole === 'coordinator' ? 'Corporate Assignment' : 'Sector Assignment'}
                                                                </div>
                                                                <div className="text-[10px] font-medium text-gray leading-none mt-1">
                                                                    {currentRole === 'coordinator' ? 'Linking to parent organization' : 'Deploying to specific zones'}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <SelectField
                                                                label="Organization / Company"
                                                                {...register('organisation_id')}
                                                                error={errors.organisation_id?.message}
                                                                options={(availableOrgs || []).map(o => ({ value: o.id, label: o.organisation_name || o.name || 'Unnamed' }))}
                                                                loading={isLoadingOrgs}
                                                                required={['coordinator', 'field_officer'].includes(currentRole)}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setValue('organisation_id', val);
                                                                    fetchAssignmentDataForOrg(val); // Fetch assignment data when org changes
                                                                }}
                                                            />

                                                            {currentRole === 'field_officer' && (
                                                                <>
                                                                    <SelectField
                                                                        label="Operational Zone"
                                                                        placeholder="Select zone..."
                                                                        {...register('zone')}
                                                                        error={errors.zone?.message}
                                                                        options={(assignmentData || []).map(item => ({ 
                                                                            value: item?.id, 
                                                                            label: item?.zone_name || item?.name || 'Unnamed Zone'
                                                                        })).filter(opt => opt.value)}
                                                                        disabled={!watch('organisation_id')}
                                                                        loading={isLoadingSites}
                                                                    />

                                                                    <SelectField
                                                                            label="Reporting Coordinator"
                                                                            placeholder="Select supervisor..."
                                                                            {...register('coordinator_id')}
                                                                            error={errors.coordinator_id?.message}
                                                                            options={(availableCoordinators || []).map(c => ({ 
                                                                                value: c.id, 
                                                                                label: c.name 
                                                                            }))}
                                                                            disabled={!watch('organisation_id')}
                                                                            loading={isLoadingCoordinators}
                                                                            required
                                                                        />
                                                                </>
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
                                                <label className="block text-[10px] font-black text-gray/60 mb-2 ml-1 uppercase tracking-[0.25em]">Operational Status Control</label>
                                                <div className="flex p-1.5 bg-gray-100/80 border border-gray-200 rounded-2xl max-w-[320px] shadow-inner">
                                                    {STATUS_OPTIONS.map(s => {
                                                        const isActive = currentStatus === s;
                                                        const isGreen = s === 'active';
                                                        return (
                                                            <button 
                                                                type="button"
                                                                key={s} 
                                                                onClick={() => setValue('status', s)} 
                                                                className={`flex-1 flex items-center justify-center gap-2.5 py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.08em] transition-all duration-300 transform active:scale-95
                                                                    ${isActive 
                                                                        ? (isGreen 
                                                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 ring-1 ring-emerald-500' 
                                                                            : 'bg-rose-600 text-white shadow-lg shadow-rose-200 ring-1 ring-rose-500')
                                                                        : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'}`}
                                                            >
                                                                <span className={`w-2 h-2 rounded-full border border-white/20 ${isActive ? 'bg-white animate-pulse' : (isGreen ? 'bg-emerald-400/50' : 'bg-rose-400/50')}`} />
                                                                {s}
                                                            </button>
                                                        );
                                                    })}
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
