import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
    FiX, FiUser, FiMail, FiBriefcase, FiShield, FiMapPin, 
    FiChevronRight, FiChevronLeft, FiCpu, FiGrid, FiActivity, FiLayers
} from 'react-icons/fi';
import { t } from '../../theme/theme';
import useUserStore from '../../store/userStore';

const ROLE_DETAILS = [
// ... (existing role detail constants)
    { 
        id: 'Coordinator', 
        name: 'Coordinator', 
        desc: 'Strategic oversight: Manage regional assets, field units, and operational workflows.', 
        icon: <FiLayers size={22} />,
        color: t.color.primary
    },
    { 
        id: 'Field Officer', 
        name: 'Field Officer', 
        desc: 'Tactical execution: On-site inspections, direct asset management, and data logging.', 
        icon: <FiActivity size={22} />,
        color: t.color.fieldOfficerText
    },
    { 
        id: 'Admin', 
        name: 'Administrator', 
        desc: 'Global control: Full system access, security protocols, and user authorization management.', 
        icon: <FiShield size={22} />,
        color: t.color.adminText
    }
];

const STATUS_OPTIONS = ['active', 'inactive'];
const DESIGNATIONS = ['Regional Manager', 'Senior Coordinator', 'Operations Lead', 'Compliance Officer'];

const UserFormModal = ({ isOpen, onClose, onSubmit, user = null, loading = false }) => {
    const store = useUserStore();
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

    const fieldStyle = (hasError) => ({
        width: '100%', padding: '12px 16px', fontSize: 13,
        border: `1.5px solid ${hasError ? t.color.danger : t.color.borderLight}`,
        borderRadius: 12, outline: 'none', color: t.color.text,
        background: hasError ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.5)',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        fontWeight: 600,
        backdropFilter: 'blur(4px)'
    });

    const focusStyle = (e) => {
        e.target.style.borderColor = t.color.primary;
        e.target.style.background = '#fff';
        e.target.style.boxShadow = `0 0 0 4px ${t.color.primary}10`;
    };

    const blurStyle = (e, hasError) => {
        e.target.style.borderColor = hasError ? t.color.danger : t.color.borderLight;
        e.target.style.background = hasError ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.5)';
        e.target.style.boxShadow = 'none';
    };

    const labelStyle = { 
        fontSize: 9, fontWeight: 900, color: t.color.textPlaceholder, 
        marginBottom: 8, display: 'block', textTransform: 'uppercase', 
        letterSpacing: '0.1em' 
    };

    const sectionTitleStyle = {
        fontSize: 13, fontWeight: 900, color: t.color.primary,
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24,
        letterSpacing: '0.04em', textTransform: 'uppercase'
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <Motion.div
                        initial={{ opacity:0 }}
                        animate={{ opacity:1 }}
                        exit={{ opacity:0 }}
                        onClick={onClose}
                        style={{ position:'fixed', inset:0, background: 'rgba(7, 34, 103, 0.1)', backdropFilter:'blur(8px)', zIndex: t.zIndex.overlay }}
                    />
                    
                    <Motion.div 
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.5 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        style={{
                            position: 'fixed', right: 0, top: 0, height: '100%', width: 500, maxWidth: '95vw',
                            background: 'rgba(255, 255, 255, 0.85)', 
                            backdropFilter: 'blur(20px) saturate(180%)',
                            borderLeft: `1px solid rgba(255, 255, 255, 0.5)`,
                            boxShadow: t.shadow.xl,
                            zIndex: t.zIndex.modal, display: 'flex', flexDirection: 'column'
                        }}
                    >
                        {/* Header */}
                        <div style={{ 
                            padding: '24px 32px', borderBottom: `1px solid ${t.color.borderLight}`,
                            display:'flex', alignItems:'center', justifyContent:'space-between',
                            background: 'rgba(255, 255, 255, 0.4)'
                        }}>
                            <div>
                                <h2 style={{ fontSize: 13, fontWeight: 900, color: t.color.text, margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    {isEdit ? 'System Access Update' : 'Personnel Onboarding'}
                                </h2>
                                <p style={{ fontSize: 11, color: t.color.textPlaceholder, margin: '4px 0 0', fontWeight: 600 }}>
                                    {step === 0 ? 'Protocol A-1: Define Clearance Level' : `Protocol A-2: Configuring ${form.role} Profile`}
                                </p>
                            </div>
                            <Motion.button 
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose} 
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: t.color.textPlaceholder, padding: 8, borderRadius: 12, display: 'flex' }}
                            >
                                <FiX size={20} />
                            </Motion.button>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 32px' }}>
                            <AnimatePresence mode="wait">
                                {step === 0 ? (
                                    <Motion.div key="step0" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        {ROLE_DETAILS.map(role => (
                                            <Motion.div
                                                key={role.id}
                                                onClick={() => handleRoleSelect(role.id)}
                                                whileHover={{ y: -4, borderColor: role.color, background: `${role.color}08`, boxShadow: `0 12px 24px ${role.color}15` }}
                                                whileTap={{ scale: 0.98 }}
                                                style={{
                                                    padding: '24px', borderRadius: 20, border: `1px solid ${t.color.borderLight}`,
                                                    background: 'rgba(255, 255, 255, 0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 20,
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${role.color}15`, color: role.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${role.color}25` }}>
                                                    {role.icon}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 15, fontWeight: 900, color: t.color.text, letterSpacing: '-0.01em' }}>{role.name}</div>
                                                    <div style={{ fontSize: 12, color: t.color.textSecondary, marginTop: 4, fontWeight: 600, lineHeight: 1.4 }}>{role.desc}</div>
                                                </div>
                                                <FiChevronRight size={18} color={t.color.textPlaceholder} />
                                            </Motion.div>
                                        ))}
                                    </Motion.div>
                                ) : (
                                    <Motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: 'spring', damping: 25 }}>
                                        {submitError && (
                                            <div style={{ padding: '12px 16px', background: t.color.dangerBg, border: `1px solid ${t.color.dangerBorder}`, borderRadius: 12, color: t.color.danger, fontSize: 12, marginBottom: 32, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <FiActivity size={14} /> {submitError}
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                                            <div>
                                                <div style={sectionTitleStyle}><FiUser size={16} /> Identity Parameters</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                                    <div>
                                                        <label style={labelStyle}>Full Legal Name</label>
                                                        <input style={fieldStyle(errors.name)} placeholder="Rahul Sharma" value={form.name} onChange={e => handleChange('name', e.target.value)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, errors.name)} />
                                                    </div>
                                                    <div>
                                                        <label style={labelStyle}>Secure Email Address</label>
                                                        <input style={fieldStyle(errors.email)} placeholder="rahul@org.com" value={form.email} onChange={e => handleChange('email', e.target.value)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, errors.email)} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div style={sectionTitleStyle}><FiShield size={16} /> Operational Profile</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                                        <div>
                                                            <label style={labelStyle}>Employee ID</label>
                                                            <input style={fieldStyle(errors.employeeId)} placeholder="EMP-9901" value={form.employeeId} onChange={e => handleChange('employeeId', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
                                                        </div>
                                                        <div>
                                                            <label style={labelStyle}>Designation</label>
                                                            <select style={fieldStyle(false)} value={form.designation} onChange={e => handleChange('designation', e.target.value)} onFocus={focusStyle} onBlur={blurStyle}>
                                                                <option value="">Select Level</option>
                                                                {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label style={labelStyle}>Affiliated Organization</label>
                                                        <select style={fieldStyle(false)} value={form.organization} onChange={e => handleChange('organization', e.target.value)} onFocus={focusStyle} onBlur={blurStyle}>
                                                            <option value="">Choose Unit</option>
                                                            {store.filterOptions.organizations.map(o => <option key={o} value={o}>{o}</option>)}
                                                        </select>
                                                    </div>
                                                    
                                                    {form.role === 'Coordinator' && (
                                                        <div>
                                                            <label style={labelStyle}>Assignment Sector</label>
                                                            <input style={fieldStyle(errors.region)} placeholder="North Zone" value={form.region} onChange={e => handleChange('region', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
                                                        </div>
                                                    )}
                                                    
                                                    {form.role === 'Field Officer' && (
                                                        <>
                                                            <div>
                                                                <label style={labelStyle}>Communication Node</label>
                                                                <input style={fieldStyle(errors.phoneNumber)} placeholder="+91..." value={form.phoneNumber} onChange={e => handleChange('phoneNumber', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
                                                            </div>
                                                            <div>
                                                                <label style={labelStyle}>Infrastructure ID</label>
                                                                <input style={fieldStyle(errors.equipmentId)} placeholder="DRONE-882" value={form.equipmentId} onChange={e => handleChange('equipmentId', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <div style={sectionTitleStyle}><FiActivity size={16} /> Clearance Status</div>
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    {STATUS_OPTIONS.map(s => (
                                                        <Motion.button 
                                                            key={s} 
                                                            whileHover={{ y: -2 }} 
                                                            whileTap={{ scale: 0.98 }} 
                                                            onClick={() => handleChange('status', s)} 
                                                            style={{ 
                                                                flex: 1, padding: '14px', borderRadius: 16, fontSize: 11, fontWeight: 900, 
                                                                border: `1.5px solid ${form.status === s ? (s === 'active' ? t.color.success : t.color.danger) : t.color.borderLight}`, 
                                                                background: form.status === s ? (s === 'active' ? t.color.successBg : t.color.dangerBg) : 'rgba(255, 255, 255, 0.4)', 
                                                                color: form.status === s ? (s === 'active' ? t.color.successDark : t.color.dangerDark) : t.color.textPlaceholder, 
                                                                cursor: 'pointer', textTransform: 'uppercase', letterSpacing:'0.08em' 
                                                            }}
                                                        >
                                                            {s}
                                                        </Motion.button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '24px 32px', borderTop: `1px solid ${t.color.borderLight}`, background: 'rgba(255, 255, 255, 0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {step === 1 && !isEdit ? (
                                <Motion.button whileHover={{ x: -2 }} onClick={() => setStep(0)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 900, color: t.color.textPlaceholder, letterSpacing: '0.05em' }}>
                                    <FiChevronLeft size={16} /> PREV STEP
                                </Motion.button>
                            ) : <div />}
                            
                            <div style={{ display: 'flex', gap: 12 }}>
                                <Motion.button whileHover={{ background: 'rgba(0,0,0,0.02)' }} onClick={onClose} style={{ padding: '12px 24px', borderRadius: 14, border: `1px solid ${t.color.border}`, background: 'transparent', color: t.color.textSecondary, fontWeight: 900, cursor: 'pointer', fontSize: 11, letterSpacing: '0.05em' }}>CANCEL</Motion.button>
                                {step === 1 && (
                                    <Motion.button whileHover={{ y: -2, boxShadow: `0 8px 16px ${t.color.primary}25` }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={loading} style={{ padding: '12px 28px', borderRadius: 14, border: 'none', background: t.color.primary, color: '#fff', fontWeight: 900, cursor: 'pointer', fontSize: 11, letterSpacing: '0.05em', boxShadow: `0 6px 12px ${t.color.primary}15` }}>
                                        {loading ? 'PROCESSING...' : (isEdit ? 'CONFIRM CHANGES' : 'FINALIZE ENTRY')}
                                    </Motion.button>
                                )}
                            </div>
                        </div>
                    </Motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UserFormModal;

