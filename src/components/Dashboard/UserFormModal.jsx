import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
    FiX, FiUser, FiMail, FiShield, FiChevronRight, FiChevronLeft, FiActivity, FiLayers, FiAlertCircle
} from 'react-icons/fi';

const ROLE_DETAILS = [
    { 
        id: 'Coordinator', 
        name: 'Coordinator', 
        desc: 'Strategic oversight: Manage regional assets, field units, and operational workflows.', 
        icon: <FiLayers size={18} />,
        color: 'text-sky-600',
        bg: 'bg-sky-50',
        border: 'border-sky-100',
    },
    { 
        id: 'Field Officer', 
        name: 'Field Officer', 
        desc: 'Tactical execution: On-site inspections, direct asset management, and data logging.', 
        icon: <FiActivity size={18} />,
        color: 'text-teal-600',
        bg: 'bg-teal-50',
        border: 'border-teal-100',
    }
];

const STATUS_OPTIONS = ['active', 'inactive'];
const DESIGNATIONS = ['Regional Manager', 'Senior Coordinator', 'Operations Lead', 'Compliance Officer'];
const ORGANIZATIONS = ['EcoTest Solutions', 'Urban Green Tech', 'PureAir Monitoring', 'Global Eco Labs'];

const UserFormModal = ({ isOpen, onClose, onSubmit, user = null, loading = false }) => {
    const isEdit = !!user;
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ 
        name: '', email: '', organization: '', role: '', 
        assignment: 'unassigned', status: 'active',
        region: '', employeeId: '', equipmentId: '', 
        phoneNumber: '', managedTeams: '',
        managedAssetClasses: [], designation: '',
        workPhone: '', workArea: ''
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                organization: user.organization || '',
                role: user.role || '',
                assignment: user.assignment || 'unassigned',
                status: user.status || 'active',
                region: user.region || '',
                employeeId: user.employeeId || '',
                equipmentId: user.equipmentId || '',
                phoneNumber: user.phoneNumber || '',
                managedTeams: user.managedTeams || '',
                managedAssetClasses: user.managedAssetClasses || [],
                designation: user.designation || '',
                workPhone: user.workPhone || '',
                workArea: user.workArea || ''
            });
            setStep(1);
        } else {
            setForm({ 
                name: '', email: '', organization: '', role: '', 
                assignment: 'unassigned', status: 'active',
                region: '', employeeId: '', equipmentId: '',
                phoneNumber: '', managedTeams: '',
                managedAssetClasses: [], designation: '',
                workPhone: '', workArea: ''
            });
            setStep(0);
        }
        setErrors({});
        setSubmitError('');
    }, [user, isOpen]);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
        
        if (form.role === 'Coordinator' && !form.region) e.region = 'Region is required';
        if (form.role === 'Field Officer') {
            if (!form.equipmentId) e.equipmentId = 'Equipment ID is required';
            if (!form.phoneNumber) e.phoneNumber = 'Phone number is required';
        }
        if (!form.employeeId) e.employeeId = 'Employee ID is required';
        
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitError('');
        const result = await onSubmit(form);
        if (result?.success) {
            onClose();
        } else {
            setSubmitError(result?.error || 'Something went wrong');
        }
    };

    const handleChange = (key, value) => {
        setForm(f => ({ ...f, [key]: value }));
        if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
    };

    const handleRoleSelect = (roleId) => {
        setForm(f => ({ ...f, role: roleId }));
        setStep(1);
    };

    const inputClasses = (hasError) => `
        w-full px-4 py-2.5 text-[13px] font-medium rounded-xl border outline-none transition-all duration-200
        ${hasError 
            ? 'bg-rose-50/50 border-rose-200 text-rose-900 focus:border-rose-400' 
            : 'bg-white border-slate-200 text-slate-700 focus:border-primary/50 focus:ring-2 focus:ring-primary/5'}
    `;

    const labelClasses = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-0.5";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                    />
                    
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="relative w-full max-w-[520px] max-h-[85vh] bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col overflow-hidden"
                    >

                        {/* Modal Header */}
                        <div className="relative z-10 p-6 pb-2 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1.5">
                                    {isEdit ? 'Edit User' : 'Add New User'}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        {step === 0 ? 'Select Role' : `Details: ${form.role}`}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-colors"
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
                                        <div className="text-[12px] font-medium text-slate-500 mb-4 px-1">Select user role type</div>
                                        {ROLE_DETAILS.map(role => (
                                            <div
                                                key={role.id}
                                                onClick={() => handleRoleSelect(role.id)}
                                                className={`group relative p-4 bg-white border border-slate-100 rounded-2xl cursor-pointer flex items-center gap-4 transition-all hover:border-slate-200 hover:bg-slate-50/50`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl ${role.bg} ${role.color} flex items-center justify-center border border-current/10 shrink-0`}>
                                                    {role.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[15px] font-bold text-slate-900">{role.name}</div>
                                                    <div className="text-[12px] font-medium text-slate-400 truncate mt-0.5">{role.desc}</div>
                                                </div>
                                                <FiChevronRight size={18} className="text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
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

                                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                                            {/* Section Header */}
                                            <div className="col-span-2 flex items-center gap-2 pb-1 border-b border-slate-100">
                                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Basic Information</h3>
                                            </div>

                                            <div className="col-span-2">
                                                <label className={labelClasses}>Full Name</label>
                                                <input className={inputClasses(errors.name)} placeholder="Enter full name" value={form.name} onChange={e => handleChange('name', e.target.value)} />
                                            </div>

                                            <div className="col-span-2">
                                                <label className={labelClasses}>Email Address</label>
                                                <input className={inputClasses(errors.email)} placeholder="user@example.com" value={form.email} onChange={e => handleChange('email', e.target.value)} />
                                            </div>

                                            {/* Deployment Section */}
                                            <div className="col-span-2 flex items-center gap-2 pb-1 border-b border-slate-100 mt-2">
                                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Work Details</h3>
                                            </div>

                                            <div className="col-span-1">
                                                <label className={labelClasses}>Employee ID</label>
                                                <input className={inputClasses(errors.employeeId)} placeholder="EMP-001" value={form.employeeId} onChange={e => handleChange('employeeId', e.target.value)} />
                                            </div>

                                            <div className="col-span-1">
                                                <label className={labelClasses}>Designation</label>
                                                <select className={inputClasses(false)} value={form.designation} onChange={e => handleChange('designation', e.target.value)}>
                                                    <option value="">Select...</option>
                                                    {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                            </div>

                                            <div className="col-span-2">
                                                <label className={labelClasses}>Organization / Company</label>
                                                <select className={inputClasses(false)} value={form.organization} onChange={e => handleChange('organization', e.target.value)}>
                                                    <option value="">Select Organization</option>
                                                    {ORGANIZATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            </div>
                                            
                                            {form.role === 'Coordinator' && (
                                                <div className="col-span-2">
                                                    <label className={labelClasses}>Work Region / Area</label>
                                                    <input className={inputClasses(errors.region)} placeholder="e.g. North Zone" value={form.region} onChange={e => handleChange('region', e.target.value)} />
                                                </div>
                                            )}
                                            
                                            {form.role === 'Field Officer' && (
                                                <>
                                                    <div className="col-span-1">
                                                        <label className={labelClasses}>Phone Number</label>
                                                        <input className={inputClasses(errors.phoneNumber)} placeholder="+1 (555) 000-0000" value={form.phoneNumber} onChange={e => handleChange('phoneNumber', e.target.value)} />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <label className={labelClasses}>Equipment ID</label>
                                                        <input className={inputClasses(errors.equipmentId)} placeholder="e.g. EQ-101" value={form.equipmentId} onChange={e => handleChange('equipmentId', e.target.value)} />
                                                    </div>
                                                </>
                                            )}

                                            <div className="col-span-2">
                                                <label className={labelClasses}>Operational Status</label>
                                                <div className="flex gap-2">
                                                    {STATUS_OPTIONS.map(s => (
                                                        <button 
                                                            key={s} 
                                                            onClick={() => handleChange('status', s)} 
                                                            className={`flex-1 py-2.5 px-4 rounded-xl text-[12px] font-bold uppercase transition-all
                                                                ${form.status === s 
                                                                    ? 'bg-slate-900 text-white shadow-md'
                                                                    : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Modal Footer */}
                        <div className="relative z-10 p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center">
                                {step === 1 && !isEdit && (
                                    <button 
                                        onClick={() => setStep(0)} 
                                        className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        <FiChevronLeft size={14} /> Back
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={onClose} 
                                    className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                {step === 1 && (
                                    <button 
                                        onClick={handleSubmit} 
                                        disabled={loading} 
                                        className="px-6 py-2.5 bg-primary text-white rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-primary/10 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create User')}
                                    </button>
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

