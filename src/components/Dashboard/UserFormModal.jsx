import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
    FiX, FiUser, FiMail, FiBriefcase, FiShield, FiMapPin, 
    FiChevronRight, FiChevronLeft, FiCpu, FiGrid, FiCheckCircle, FiActivity
} from 'react-icons/fi';
import { t } from '../../theme/theme';

const ROLE_DETAILS = [
    { 
        id: 'Coordinator', 
        name: 'Coordinator', 
        desc: 'Oversee regional operations and manage field teams.', 
        icon: <FiGrid size={24} />,
        color: '#3B82F6'
    },
    { 
        id: 'Field Officer', 
        name: 'Field Officer', 
        desc: 'Conduct on-site inspections and manage assets.', 
        icon: <FiMapPin size={24} />,
        color: '#10B981'
    }
];

const STATUS_OPTIONS = ['active', 'inactive'];
const ASSET_CLASSES = ['Air Quality Sensors', 'Drones', 'Water Meters', 'Noise Monitors', 'Weather Stations'];
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
        width: '100%', padding: '12px 16px', fontSize: 13,
        border: `1.5px solid ${hasError ? '#FCA5A5' : t.color.borderLight}`,
        borderRadius: 12, outline: 'none', color: t.color.text,
        background: hasError ? t.color.dangerBg : '#FFFFFF',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        fontWeight: 600
    });

    const focusStyle = (e) => {
        e.target.style.borderColor = t.color.primary;
        e.target.style.boxShadow = `0 0 0 3px ${t.color.primary}10`;
    };

    const blurStyle = (e, hasError) => {
        e.target.style.borderColor = hasError ? '#FCA5A5' : t.color.borderLight;
        e.target.style.boxShadow = 'none';
    };

    const labelStyle = { 
        fontSize: 10, fontWeight: 900, color: t.color.textPlaceholder, 
        marginBottom: 8, display: 'block', textTransform: 'uppercase', 
        letterSpacing: '0.08em' 
    };

    const sectionTitleStyle = {
        fontSize: 14, fontWeight: 800, color: t.color.primary,
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24,
        paddingBottom: 0
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
                        style={{ position:'fixed', inset:0, background: 'rgba(0,0,0,0.1)', backdropFilter:'blur(4px)', zIndex: t.zIndex.overlay }}
                    />
                    
                    <Motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 250 }}
                        style={{
                            position: 'fixed', right: 0, top: 0, height: '100%', width: 500, maxWidth: '95vw',
                            background: '#fff', boxShadow: '-12px 0 50px rgba(0,0,0,0.06)',
                            zIndex: t.zIndex.modal, display: 'flex', flexDirection: 'column'
                        }}
                    >
                        {/* Header */}
                        <div style={{ 
                            padding: '24px 32px', borderBottom: '1px solid #F1F5F9',
                            display:'flex', alignItems:'center', justifyContent:'space-between',
                            background: '#fff'
                        }}>
                            <div>
                                <h2 style={{ fontSize: 14, fontWeight: 900, color: t.color.text, margin: 0, letterSpacing: '-0.01em' }}>
                                    {isEdit ? 'Update Member' : 'Onboard New User'}
                                </h2>
                                <p style={{ fontSize: 12, color: t.color.textPlaceholder, margin: '2px 0 0', fontWeight: 600 }}>
                                    {step === 0 ? 'Define access level' : `Configuring ${form.role}`}
                                </p>
                            </div>
                            <Motion.button 
                                whileHover={{ scale: 1.1, background: '#F8FAFC' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose} 
                                style={{ background: '#fff', border: '1px solid #E2E8F0', cursor: 'pointer', color: t.color.textPlaceholder, padding: 8, borderRadius: 12, display: 'flex' }}
                            >
                                <FiX size={18} />
                            </Motion.button>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                            <AnimatePresence mode="wait">
                                {step === 0 ? (
                                    <Motion.div key="step0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        {ROLE_DETAILS.map(role => (
                                            <Motion.div
                                                key={role.id}
                                                onClick={() => handleRoleSelect(role.id)}
                                                whileHover={{ y: -4, borderColor: role.color, background: `${role.color}05` }}
                                                whileTap={{ scale: 0.98 }}
                                                style={{
                                                    padding: '28px', borderRadius: 24, border: '1.5px solid #f1f5f9',
                                                    background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 24,
                                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${role.color}15`, color: role.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {role.icon}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 800, color: t.color.text }}>{role.name}</div>
                                                    <div style={{ fontSize: 13, color: t.color.textSecondary, marginTop: 4, fontWeight: 500 }}>{role.desc}</div>
                                                </div>
                                                <FiChevronRight size={18} color={t.color.textPlaceholder} />
                                            </Motion.div>
                                        ))}
                                    </Motion.div>
                                ) : (
                                    <Motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        {submitError && (
                                            <div style={{ padding: '12px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 12, color: '#DC2626', fontSize: 13, marginBottom: 24, fontWeight: 600 }}>
                                                {submitError}
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                                            <div>
                                                <div style={sectionTitleStyle}><FiUser size={16} /> Identity Parameters</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                                    <div>
                                                        <label style={labelStyle}>Full Name</label>
                                                        <input style={fieldStyle(errors.name)} placeholder="Rahul Sharma" value={form.name} onChange={e => handleChange('name', e.target.value)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, errors.name)} />
                                                    </div>
                                                    <div>
                                                        <label style={labelStyle}>Email Address</label>
                                                        <input style={fieldStyle(errors.email)} placeholder="rahul@org.com" value={form.email} onChange={e => handleChange('email', e.target.value)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, errors.email)} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div style={sectionTitleStyle}><FiShield size={16} /> Operational Profile</div>
                                                {form.role === 'Coordinator' && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
                                                            <label style={labelStyle}>Organization</label>
                                                            <select style={fieldStyle(false)} value={form.organization} onChange={e => handleChange('organization', e.target.value)} onFocus={focusStyle} onBlur={blurStyle}>
                                                                <option value="">Choose Unit</option>
                                                                {ORGANIZATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label style={labelStyle}>Assignment Sector</label>
                                                            <input style={fieldStyle(errors.region)} placeholder="North Zone" value={form.region} onChange={e => handleChange('region', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
                                                        </div>
                                                    </div>
                                                )}
                                                {form.role === 'Field Officer' && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                                            <div>
                                                                <label style={labelStyle}>Employee ID</label>
                                                                <input style={fieldStyle(errors.employeeId)} placeholder="FO-7721" value={form.employeeId} onChange={e => handleChange('employeeId', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
                                                            </div>
                                                            <div>
                                                                <label style={labelStyle}>Communication Node</label>
                                                                <input style={fieldStyle(errors.phoneNumber)} placeholder="+91..." value={form.phoneNumber} onChange={e => handleChange('phoneNumber', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label style={labelStyle}>Infrastructure ID</label>
                                                            <input style={fieldStyle(errors.equipmentId)} placeholder="DRONE-882" value={form.equipmentId} onChange={e => handleChange('equipmentId', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <div style={sectionTitleStyle}><FiActivity size={16} /> Registry Status</div>
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    {STATUS_OPTIONS.map(s => (
                                                        <Motion.button key={s} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => handleChange('status', s)} style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 12, fontWeight: 900, border: `2px solid ${form.status === s ? (s === 'active' ? '#10B981' : '#EF4444') : '#f1f5f9'}`, background: form.status === s ? (s === 'active' ? '#ECFDF5' : '#FFF1F2') : '#fff', color: form.status === s ? (s === 'active' ? '#059669' : '#E11D48') : t.color.textPlaceholder, cursor: 'pointer', textTransform: 'uppercase', letterSpacing:'0.05em' }}>{s}</Motion.button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '24px 32px', borderTop: '1px solid #F1F5F9', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {step === 1 && !isEdit ? (
                                <Motion.button onClick={() => setStep(0)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 800, color: t.color.textPlaceholder }}>
                                    <FiChevronLeft size={16} /> BACK
                                </Motion.button>
                            ) : <div />}
                            
                            <div style={{ display: 'flex', gap: 10 }}>
                                <Motion.button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', color: t.color.textSecondary, fontWeight: 800, cursor: 'pointer', fontSize: 12 }}>CANCEL</Motion.button>
                                {step === 1 && (
                                    <Motion.button whileHover={{ scale: 1.02, background: t.color.primaryDark }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={loading} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: t.color.primary, color: '#fff', fontWeight: 900, cursor: 'pointer', fontSize: 12, boxShadow: `0 6px 12px ${t.color.primary}15` }}>
                                        {loading ? 'PROCESSING...' : (isEdit ? 'UPDATE' : 'COMPLETE')}
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
