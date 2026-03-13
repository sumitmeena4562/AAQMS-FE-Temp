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
        icon: <FiLayers size={22} />,
        color: 'text-sky-600',
        bg: 'bg-sky-50',
        border: 'border-sky-100',
        glow: 'shadow-sky-500/10'
    },
    { 
        id: 'Field Officer', 
        name: 'Field Officer', 
        desc: 'Tactical execution: On-site inspections, direct asset management, and data logging.', 
        icon: <FiActivity size={22} />,
        color: 'text-teal-600',
        bg: 'bg-teal-50',
        border: 'border-teal-100',
        glow: 'shadow-teal-500/10'
    },
    { 
        id: 'Admin', 
        name: 'Administrator', 
        desc: 'Global control: Full system access, security protocols, and user authorization management.', 
        icon: <FiShield size={22} />,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        border: 'border-indigo-100',
        glow: 'shadow-indigo-500/10'
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
        w-full px-5 py-3.5 text-sm font-bold rounded-2xl border outline-none transition-all duration-300 backdrop-blur-sm
        ${hasError 
            ? 'bg-rose-50/50 border-rose-200 text-rose-900 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/5' 
            : 'bg-white/50 border-slate-200 text-slate-700 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:-translate-y-0.5'}
    `;

    const labelClasses = "block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";

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
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-[640px] max-h-[90vh] bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[40px] shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/5"
                    >
                        {/* Grain overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grain-y.vercel.app/noise.svg')]" />

                        {/* Modal Header */}
                        <div className="relative z-10 p-8 pb-4 flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">
                                    {isEdit ? 'Update Personnel Profile' : 'Register New Member'}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                        {step === 0 ? 'Step 1: Authorization Level' : `Step 2: Configuration (${form.role})`}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="p-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all duration-300 active:scale-95"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="relative z-10 flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {step === 0 ? (
                                    <Motion.div 
                                        key="step0" 
                                        initial={{ opacity: 0, scale: 0.98 }} 
                                        animate={{ opacity: 1, scale: 1 }} 
                                        exit={{ opacity: 0, x: -20 }} 
                                        className="space-y-4 pt-4"
                                    >
                                        <div className="text-[13px] font-bold text-slate-500 mb-6">Select appropriate access level to proceed</div>
                                        {ROLE_DETAILS.map(role => (
                                            <Motion.div
                                                key={role.id}
                                                onClick={() => handleRoleSelect(role.id)}
                                                whileHover={{ y: -4, scale: 1.01 }}
                                                className={`group relative p-6 bg-white border border-slate-100 rounded-[30px] cursor-pointer flex items-center gap-6 transition-all duration-500 hover:shadow-2xl ${role.glow}`}
                                            >
                                                <div className={`w-16 h-16 rounded-[22px] ${role.bg} ${role.color} flex items-center justify-center border border-current/10 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                                    {role.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-lg font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{role.name}</div>
                                                    <div className="text-[13px] font-bold text-slate-400 leading-relaxed mt-1">{role.desc}</div>
                                                </div>
                                                <div className="p-2 bg-slate-50 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 opacity-50 group-hover:opacity-100">
                                                    <FiChevronRight size={20} />
                                                </div>
                                            </Motion.div>
                                        ))}
                                    </Motion.div>
                                ) : (
                                    <Motion.div 
                                        key="step1" 
                                        initial={{ opacity: 0, x: 20 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        exit={{ opacity: 0, x: -20 }} 
                                        className="pt-4 space-y-8"
                                    >
                                        {submitError && (
                                            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-black shadow-sm">
                                                <FiAlertCircle size={18} /> {submitError}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                                            {/* Section Header */}
                                            <div className="col-span-2 flex items-center gap-3 pb-2 border-b border-slate-100">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                                                    <FiUser size={16} />
                                                </div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Base Identity Profile</h3>
                                            </div>

                                            <div className="col-span-2">
                                                <label className={labelClasses}>Full Personnel Name</label>
                                                <input className={inputClasses(errors.name)} placeholder="e.g. Commander Alexander" value={form.name} onChange={e => handleChange('name', e.target.value)} />
                                                {errors.name && <span className="text-[10px] font-black text-rose-500 mt-1 block ml-1">{errors.name}</span>}
                                            </div>

                                            <div className="col-span-2">
                                                <label className={labelClasses}>Encrypted Work Email</label>
                                                <input className={inputClasses(errors.email)} placeholder="id@enterprise.gov" value={form.email} onChange={e => handleChange('email', e.target.value)} />
                                                {errors.email && <span className="text-[10px] font-black text-rose-500 mt-1 block ml-1">{errors.email}</span>}
                                            </div>

                                            {/* Deployment Section */}
                                            <div className="col-span-2 flex items-center gap-3 pb-2 border-b border-slate-100 mt-4">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                                                    <FiLayers size={16} />
                                                </div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Deployment Parameters</h3>
                                            </div>

                                            <div className="col-span-1">
                                                <label className={labelClasses}>System ID (EMP)</label>
                                                <input className={inputClasses(errors.employeeId)} placeholder="ID-4029" value={form.employeeId} onChange={e => handleChange('employeeId', e.target.value)} />
                                            </div>

                                            <div className="col-span-1">
                                                <label className={labelClasses}>Designation Tier</label>
                                                <select className={inputClasses(false)} value={form.designation} onChange={e => handleChange('designation', e.target.value)}>
                                                    <option value="">Choose Rank</option>
                                                    {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                            </div>

                                            <div className="col-span-2">
                                                <label className={labelClasses}>Assigned Strategic Unit</label>
                                                <select className={inputClasses(false)} value={form.organization} onChange={e => handleChange('organization', e.target.value)}>
                                                    <option value="">Select Organization</option>
                                                    {ORGANIZATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            </div>
                                            
                                            {form.role === 'Coordinator' && (
                                                <div className="col-span-2">
                                                    <label className={labelClasses}>Assigned Operational Sector</label>
                                                    <input className={inputClasses(errors.region)} placeholder="Strategic Region Alpha" value={form.region} onChange={e => handleChange('region', e.target.value)} />
                                                </div>
                                            )}
                                            
                                            {form.role === 'Field Officer' && (
                                                <>
                                                    <div className="col-span-1">
                                                        <label className={labelClasses}>Comms Node</label>
                                                        <input className={inputClasses(errors.phoneNumber)} placeholder="+1 (555) 000-0000" value={form.phoneNumber} onChange={e => handleChange('phoneNumber', e.target.value)} />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <label className={labelClasses}>Hardware Class ID</label>
                                                        <input className={inputClasses(errors.equipmentId)} placeholder="TX-802" value={form.equipmentId} onChange={e => handleChange('equipmentId', e.target.value)} />
                                                    </div>
                                                </>
                                            )}

                                            <div className="col-span-2 space-y-3 mt-4">
                                                <label className={labelClasses}>Operational Readiness</label>
                                                <div className="flex gap-4">
                                                    {STATUS_OPTIONS.map(s => (
                                                        <button 
                                                            key={s} 
                                                            onClick={() => handleChange('status', s)} 
                                                            className={`flex-1 py-4 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all duration-300 group
                                                                ${form.status === s 
                                                                    ? (s === 'active' ? 'bg-emerald-500 text-white border-emerald-400 shadow-xl shadow-emerald-500/20 scale-[1.02]' : 'bg-slate-900 text-white border-slate-800 shadow-xl shadow-slate-900/20 scale-[1.02]')
                                                                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50'}`}
                                                        >
                                                            {s === 'active' ? 'Deploy (Active)' : 'Standby (Inactive)'}
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
                        <div className="relative z-10 p-8 pt-4 bg-slate-50/50 backdrop-blur-md border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center">
                                {step === 1 && !isEdit && (
                                    <button 
                                        onClick={() => setStep(0)} 
                                        className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors pr-6 group"
                                    >
                                        <FiChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> 
                                        Back to Tier
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={onClose} 
                                    className="px-6 py-3 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                {step === 1 && (
                                    <button 
                                        onClick={handleSubmit} 
                                        disabled={loading} 
                                        className="px-8 py-3 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 active:scale-95"
                                    >
                                        {loading ? 'Transmitting Data...' : (isEdit ? 'Update Dataset' : 'Finalize Registration')}
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

