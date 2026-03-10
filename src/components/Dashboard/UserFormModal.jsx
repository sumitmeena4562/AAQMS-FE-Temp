import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiBriefcase, FiShield, FiMapPin } from 'react-icons/fi';

const ROLE_OPTIONS = ['Admin', 'Coordinator', 'Field Officer'];
const STATUS_OPTIONS = ['active', 'inactive'];
const ASSIGNMENT_OPTIONS = ['assigned', 'unassigned'];

/**
 * Add / Edit User Modal (slide-in drawer)
 *
 * @param {boolean}  isOpen    - show/hide
 * @param {Function} onClose   - close handler
 * @param {Function} onSubmit  - (formData) => Promise<{success, error}>
 * @param {Object}   user      - null = Add mode, object = Edit mode
 * @param {boolean}  loading   - processing state
 */
const UserFormModal = ({ isOpen, onClose, onSubmit, user = null, loading = false }) => {
    const isEdit = !!user;
    const [form, setForm] = useState({ name: '', email: '', organization: '', role: 'Field Officer', assignment: 'unassigned', status: 'active' });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                organization: user.organization || '',
                role: user.role || 'Field Officer',
                assignment: user.assignment || 'unassigned',
                status: user.status || 'active',
            });
        } else {
            setForm({ name: '', email: '', organization: '', role: 'Field Officer', assignment: 'unassigned', status: 'active' });
        }
        setErrors({});
        setSubmitError('');
    }, [user, isOpen]);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
        if (!form.role) e.role = 'Role is required';
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

    if (!isOpen) return null;

    const fieldStyle = (hasError) => ({
        width: '100%', padding: '9px 12px', fontSize: 13,
        border: `1px solid ${hasError ? '#FCA5A5' : '#E5E7EB'}`,
        borderRadius: 7, outline: 'none', color: '#111827',
        background: hasError ? '#FEF2F2' : '#fff',
        boxSizing: 'border-box',
    });

    const labelStyle = { fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'block' };
    const errorStyle = { fontSize: 11, color: '#EF4444', marginTop: 3 };

    return (
        <>
            {/* Backdrop */}
            <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)', zIndex: 9998 }} />

            {/* Drawer */}
            <div style={{
                position: 'fixed', right: 0, top: 0, height: '100vh', width: 440, maxWidth: '95vw',
                background: '#fff', boxShadow: '-8px 0 30px rgba(0,0,0,0.1)',
                zIndex: 9999, display: 'flex', flexDirection: 'column',
                animation: 'slideIn 0.2s ease',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
                        {isEdit ? 'Edit User' : 'Add New User'}
                    </span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', padding: 4 }}>
                        <FiX size={18} />
                    </button>
                </div>

                {/* Form */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
                    {submitError && (
                        <div style={{ padding: '10px 12px', marginBottom: 16, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, fontSize: 12, color: '#DC2626', fontWeight: 500 }}>
                            {submitError}
                        </div>
                    )}

                    {/* Name */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Full Name *</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', display: 'flex' }}><FiUser size={14} /></span>
                            <input
                                style={{ ...fieldStyle(errors.name), paddingLeft: 32 }}
                                placeholder="Enter full name"
                                value={form.name}
                                onChange={e => handleChange('name', e.target.value)}
                            />
                        </div>
                        {errors.name && <div style={errorStyle}>{errors.name}</div>}
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Email Address *</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', display: 'flex' }}><FiMail size={14} /></span>
                            <input
                                style={{ ...fieldStyle(errors.email), paddingLeft: 32 }}
                                placeholder="Enter email address"
                                type="email"
                                value={form.email}
                                onChange={e => handleChange('email', e.target.value)}
                            />
                        </div>
                        {errors.email && <div style={errorStyle}>{errors.email}</div>}
                    </div>

                    {/* Organization */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Organization</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', display: 'flex' }}><FiBriefcase size={14} /></span>
                            <input
                                style={{ ...fieldStyle(false), paddingLeft: 32 }}
                                placeholder="Enter organization name"
                                value={form.organization}
                                onChange={e => handleChange('organization', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Role *</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', display: 'flex' }}><FiShield size={14} /></span>
                            <select
                                style={{ ...fieldStyle(errors.role), paddingLeft: 32, appearance: 'none', cursor: 'pointer' }}
                                value={form.role}
                                onChange={e => handleChange('role', e.target.value)}
                            >
                                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        {errors.role && <div style={errorStyle}>{errors.role}</div>}
                    </div>

                    {/* Assignment */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Assignment</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', display: 'flex' }}><FiMapPin size={14} /></span>
                            <select
                                style={{ ...fieldStyle(false), paddingLeft: 32, appearance: 'none', cursor: 'pointer' }}
                                value={form.assignment}
                                onChange={e => handleChange('assignment', e.target.value)}
                            >
                                {ASSIGNMENT_OPTIONS.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Status */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Status</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {STATUS_OPTIONS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => handleChange('status', s)}
                                    style={{
                                        flex: 1, padding: '9px 0', fontSize: 13, fontWeight: 600,
                                        borderRadius: 7, cursor: 'pointer', textTransform: 'capitalize',
                                        border: `1px solid ${form.status === s ? (s === 'active' ? '#A7F3D0' : '#FECACA') : '#E5E7EB'}`,
                                        background: form.status === s ? (s === 'active' ? '#ECFDF5' : '#FEF2F2') : '#fff',
                                        color: form.status === s ? (s === 'active' ? '#065F46' : '#991B1B') : '#6B7280',
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '14px 20px',
                    background: '#fff',
                    borderTop: '1px solid #F3F4F6',
                    display: 'flex', justifyContent: 'flex-end', gap: 8,
                }}>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{ padding: '9px 18px', fontSize: 13, fontWeight: 500, color: '#374151', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 7, cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            padding: '9px 20px', fontSize: 13, fontWeight: 600,
                            color: '#fff', background: '#4F46E5', border: '1px solid #4338CA',
                            borderRadius: 7, cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create User')}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
            `}</style>
        </>
    );
};

export default UserFormModal;
