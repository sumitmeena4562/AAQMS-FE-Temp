import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
    FiX, FiUser, FiMail, FiBriefcase, FiShield, FiMapPin, 
    FiChevronRight, FiChevronLeft, FiCpu, FiGrid, FiActivity, FiLayers
} from 'react-icons/fi';
import { t } from '../../theme/theme';

const ROLE_DETAILS = [
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

    const fieldStyle = (hasError) => ({
        width: '100%', padding: '14px 18px', fontSize: 14,
        border: `1px solid ${hasError ? t.color.danger : 'rgba(0,0,0,0.1)'}`,
        borderRadius: 16, outline: 'none', color: t.color.text,
        background: hasError ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.5)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxSizing: 'border-box',
        fontWeight: 500,
        backdropFilter: 'blur(4px)',
        letterSpacing: '-0.01em'
    });

    const focusStyle = (e) => {
        e.target.style.borderColor = t.color.primary;
        e.target.style.background = '#fff';
        e.target.style.boxShadow = `0 4px 12px rgba(0, 0, 0, 0.03), 0 0 0 4px ${t.color.primary}10`;
        e.target.style.transform = 'translateY(-1px)';
    };

    const blurStyle = (e, hasError) => {
        e.target.style.borderColor = hasError ? t.color.danger : 'rgba(0,0,0,0.1)';
        e.target.style.background = hasError ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.5)';
        e.target.style.boxShadow = 'none';
        e.target.style.transform = 'translateY(0)';
    };

    const labelStyle = { 
        display: 'block', fontSize: 12, fontWeight: 800, color: t.color.textPlaceholder, 
        marginBottom: 8, letterSpacing: '-0.01em', marginLeft: 4
    };

    const sectionTitleStyle = {
        fontSize: 14, fontWeight: 900, color: t.color.text,
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
        letterSpacing: '-0.02em', opacity: 0.9
    };



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
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ 
                            type: 'spring', 
                            damping: 25, 
                            stiffness: 300,
                            mass: 0.8
                        }}
                        style={{
                            position: 'fixed',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 600,
                            maxWidth: '92vw',
                            maxHeight: '92vh',
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(32px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                            borderRadius: 32,
                            boxShadow: `
                                0 20px 50px rgba(0, 0, 0, 0.1),
                                0 10px 20px rgba(0, 0, 0, 0.05),
                                inset 0 0 0 1px rgba(255, 255, 255, 0.6)
                            `,
                            zIndex: t.zIndex.modal,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div style={{ 
                            padding: '32px 40px 24px',
                            display:'flex', alignItems:'flex-start', justifyContent:'space-between',
                            background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)'
                        }}>
                            <div>
                                <h1 style={{ fontSize: 22, fontWeight: 900, color: t.color.text, margin: 0, letterSpacing: '-0.03em' }}>
                                    {isEdit ? 'Update Personnel Profile' : 'Register New Member'}
                                </h1>
                                <p style={{ fontSize: 13, color: t.color.textPlaceholder, margin: '6px 0 0', fontWeight: 600, opacity: 0.8 }}>
                                    {step === 0 ? 'Step 1: Authorization Level' : `Step 2: Profile Configuration (${form.role})`}
                                </p>
                            </div>
                            <Motion.button 
                                whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.05)' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose} 
                                style={{ 
                                    background: 'rgba(0,0,0,0.03)', border: 'none', cursor: 'pointer', 
                                    color: t.color.text, padding: 10, borderRadius: 14, 
                                    display: 'flex', transition: 'all 0.2s' 
                                }}
                            >
                                <FiX size={18} />
                            </Motion.button>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '0 40px 40px' }}>
                            <AnimatePresence mode="wait">
                                {step === 0 ? (
                                    <Motion.div 
                                        key="step0" 
                                        initial={{ opacity: 0, y: 10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        exit={{ opacity: 0, y: -10 }} 
                                        transition={{ duration: 0.2 }} 
                                        style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 10 }}
                                    >
                                        <div style={{ fontSize: 13, fontWeight: 700, color: t.color.textPlaceholder, marginBottom: 4, letterSpacing: '-0.01em' }}>
                                            Select access level to continue
                                        </div>
                                        {ROLE_DETAILS.map(role => (
                                            <Motion.div
                                                key={role.id}
                                                onClick={() => handleRoleSelect(role.id)}
                                                whileHover={{ y: -2, borderColor: `${role.color}40`, background: `${role.color}05`, boxShadow: `0 8px 24px ${role.color}10` }}
                                                whileTap={{ scale: 0.99 }}
                                                style={{
                                                    padding: '24px 28px', borderRadius: 24, border: `1px solid rgba(0,0,0,0.06)`,
                                                    background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 20,
                                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                                }}
                                            >
                                                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${role.color}10`, color: role.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${role.color}15`, flexShrink: 0 }}>
                                                    {role.icon}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 800, color: t.color.text, letterSpacing: '-0.02em' }}>{role.name}</div>
                                                    <div style={{ fontSize: 13, color: t.color.textPlaceholder, marginTop: 4, fontWeight: 500, lineHeight: 1.5 }}>{role.desc}</div>
                                                </div>
                                                <FiChevronRight size={18} color={t.color.textPlaceholder} style={{ opacity: 0.5 }} />
                                            </Motion.div>
                                        ))}
                                    </Motion.div>
                                ) : (
                                    <Motion.div 
                                        key="step1" 
                                        initial={{ opacity: 0, x: 20 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        exit={{ opacity: 0, x: -20 }} 
                                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                        style={{ paddingTop: 10 }}
                                    >
                                        {submitError && (
                                            <div style={{ padding: '14px 18px', background: t.color.dangerBg, border: `1px solid ${t.color.dangerBorder}`, borderRadius: 16, color: t.color.danger, fontSize: 13, marginBottom: 32, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)' }}>
                                                <FiAlertCircle size={16} /> {submitError}
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
                                            {/* Section 1 */}
                                            <div>
                                                <div style={sectionTitleStyle}><FiUser size={16} /> Basic Identity</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                                    <div style={{ gridColumn: 'span 2' }}>
                                                        <label style={labelStyle}>Full Name</label>
                                                        <input style={fieldStyle(errors.name)} placeholder="e.g. Alexander Pierce" value={form.name} onChange={e => handleChange('name', e.target.value)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, errors.name)} />
                                                    </div>
                                                    <div style={{ gridColumn: 'span 2' }}>
                                                        <label style={labelStyle}>Work Email Address</label>
                                                        <input style={fieldStyle(errors.email)} placeholder="name@company.com" value={form.email} onChange={e => handleChange('email', e.target.value)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, errors.email)} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 2 */}
                                            <div>
                                                <div style={sectionTitleStyle}><FiShield size={16} /> Deployment Parameters</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                                    <div>
                                                        <label style={labelStyle}>Employee ID</label>
                                                        <input style={fieldStyle(errors.employeeId)} placeholder="EMP-402" value={form.employeeId} onChange={e => handleChange('employeeId', e.target.value)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, errors.employeeId)} />
                                                    </div>
                                                    <div>
                                                        <label style={labelStyle}>Designation</label>
                                                        <select style={fieldStyle(false)} value={form.designation} onChange={e => handleChange('designation', e.target.value)} onFocus={focusStyle} onBlur={blurStyle}>
                                                            <option value="">Select Level</option>
                                                            {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                                        </select>
                                                    </div>
                                                    <div style={{ gridColumn: 'span 2' }}>
                                                        <label style={labelStyle}>Assigned Organization</label>
                                                        <select style={fieldStyle(false)} value={form.organization} onChange={e => handleChange('organization', e.target.value)} onFocus={focusStyle} onBlur={blurStyle}>
                                                            <option value="">Choose Unit</option>
                                                            {ORGANIZATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                                        </select>
                                                    </div>
                                                    
                                                    {form.role === 'Coordinator' && (
                                                        <div style={{ gridColumn: 'span 2' }}>
                                                            <label style={labelStyle}>Operational Region</label>
                                                            <input style={fieldStyle(errors.region)} placeholder="e.g. Northern Sector" value={form.region} onChange={e => handleChange('region', e.target.value)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, errors.region)} />
                                                        </div>
                                                    )}
                                                    
                                                    {form.role === 'Field Officer' && (
                                                        <>
                                                            <div>
                                                                <label style={labelStyle}>Phone Node</label>
                                                                <input style={fieldStyle(errors.phoneNumber)} placeholder="+91..." value={form.phoneNumber} onChange={e => handleChange('phoneNumber', e.target.value)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, errors.phoneNumber)} />
                                                            </div>
                                                            <div>
                                                                <label style={labelStyle}>Equipment Class</label>
                                                                <input style={fieldStyle(errors.equipmentId)} placeholder="UI-900" value={form.equipmentId} onChange={e => handleChange('equipmentId', e.target.value)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, errors.equipmentId)} />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Section 3 */}
                                            <div>
                                                <div style={sectionTitleStyle}><FiActivity size={16} /> Operational Status</div>
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    {STATUS_OPTIONS.map(s => (
                                                        <Motion.button 
                                                            key={s} 
                                                            whileHover={{ y: -2 }} 
                                                            whileTap={{ scale: 0.98 }} 
                                                            onClick={() => handleChange('status', s)} 
                                                            style={{ 
                                                                flex: 1, padding: '14px', borderRadius: 16, fontSize: 11, fontWeight: 900, 
                                                                border: `1.5px solid ${form.status === s ? (s === 'active' ? t.color.success : t.color.border) : t.color.borderLight}`, 
                                                                background: form.status === s ? (s === 'active' ? t.color.successBg : t.color.bg) : 'rgba(255, 255, 255, 0.4)', 
                                                                color: form.status === s ? (s === 'active' ? t.color.successDark : t.color.text) : t.color.textPlaceholder, 
                                                                cursor: 'pointer', textTransform: 'uppercase', letterSpacing:'0.08em',
                                                                boxShadow: form.status === s ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                                                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
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
                        <div style={{ 
                            padding: '24px 40px 32px', 
                            background: 'rgba(255, 255, 255, 0.5)', 
                            borderTop: '1px solid rgba(0,0,0,0.05)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                        }}>
                            {step === 1 && !isEdit ? (
                                <Motion.button 
                                    whileHover={{ x: -2, color: t.color.primary }} 
                                    onClick={() => setStep(0)} 
                                    style={{ 
                                        display: 'flex', alignItems: 'center', gap: 8, background: 'none', 
                                        border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 800, 
                                        color: t.color.textPlaceholder, letterSpacing: '-0.01em', transition: 'color 0.2s'
                                    }}
                                >
                                    <FiChevronLeft size={16} /> Previous step
                                </Motion.button>
                            ) : <div />}
                            
                            <div style={{ display: 'flex', gap: 12 }}>
                                <Motion.button 
                                    whileHover={{ background: 'rgba(0,0,0,0.05)' }} 
                                    onClick={onClose} 
                                    style={{ 
                                        padding: '12px 24px', borderRadius: 16, border: `1px solid rgba(0,0,0,0.1)`, 
                                        background: 'transparent', color: t.color.text, fontWeight: 750, 
                                        cursor: 'pointer', fontSize: 13, letterSpacing: '-0.01em' 
                                    }}
                                >
                                    Cancel
                                </Motion.button>
                                {step === 1 && (
                                    <Motion.button 
                                        whileHover={{ y: -2, boxShadow: `0 12px 24px ${t.color.primary}25` }} 
                                        whileTap={{ scale: 0.98 }} 
                                        onClick={handleSubmit} 
                                        disabled={loading} 
                                        style={{ 
                                            padding: '12px 32px', borderRadius: 16, border: 'none', 
                                            background: t.color.primary, color: '#fff', fontWeight: 800, 
                                            cursor: 'pointer', fontSize: 13, letterSpacing: '-0.01em', 
                                            boxShadow: `0 8px 16px ${t.color.primary}15` 
                                        }}
                                    >
                                        {loading ? 'Processing...' : (isEdit ? 'Save Changes' : 'Confirm Registration')}
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

