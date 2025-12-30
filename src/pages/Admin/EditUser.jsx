import React, { useState, useEffect } from 'react';
import './Admin.css';
import { usersApi } from '../../services/oeeBeApi';

function EditUser({ user, onCancel }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        countryCode: '+91',
        role: 'Admin',
        status: 'Active',
        password: '',
        confirmPassword: ''
    });

    const [photoPreview, setPhotoPreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            const fullName = user.full_name || user.name || '';
            const [firstName, ...lastNameParts] = fullName.split(' ');
            setFormData({
                firstName: firstName || '',
                lastName: lastNameParts.join(' ') || '',
                email: user.email || '',
                phone: user.mobile_no || user.phone || '',
                countryCode: user.country_code || '+91',
                role: (user.role || 'USER').toUpperCase(),
                status: user.status || 'Active',
                password: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (!user || !user.id) throw new Error('User ID is missing');
            const payload = {
                full_name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                mobile_no: formData.phone,
                country_code: formData.countryCode,
                role: formData.role,
                status: formData.status.toUpperCase(),
                password: formData.password || undefined,
            };
            await usersApi.update(user.id, payload);
            alert('User updated successfully!');
            if (onCancel) onCancel();
        } catch (err) {
            setError(err.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Edit User</h2>
            </div>

            <div className="form-container">
                <form className="create-user-form" onSubmit={handleSubmit}>
                    <div className="photo-upload-section">
                        <div className="photo-preview-container">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="photo-preview" />
                            ) : (
                                <div className="photo-placeholder">
                                    <span>👤</span>
                                </div>
                            )}
                            <label htmlFor="photo-input" className="photo-upload-label">
                                <span className="upload-icon">📷</span>
                            </label>
                            <input
                                id="photo-input"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <p className="photo-hint">Edit Profile Photo</p>
                    </div>

                    <div className="form-grid">
                        <div className="form-column">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter first name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Role</label>
                                <select name="role" value={formData.role} onChange={handleChange} required>
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">User</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Password (Leave blank to keep current)</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter new password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-column">
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <select
                                        name="countryCode"
                                        value={formData.countryCode}
                                        onChange={handleChange}
                                        style={{ width: '16.1vh' }}
                                    >
                                        <option value="+91">+91 (IN)</option>
                                        <option value="+1">+1 (US)</option>
                                        <option value="+44">+44 (UK)</option>
                                        <option value="+61">+61 (AU)</option>
                                        <option value="+81">+81 (JP)</option>
                                        <option value="+49">+49 (DE)</option>
                                        <option value="+971">+971 (UAE)</option>
                                        <option value="+86">+86 (CN)</option>
                                        <option value="+33">+33 (FR)</option>
                                        <option value="+39">+39 (IT)</option>
                                    </select>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>
                              <div className="form-group">
                                <label>Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="Enter company name"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                        <button type="button" className="secondary-btn" onClick={onCancel} disabled={loading}>Cancel</button>
                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? 'Updating...' : 'Update User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default EditUser;
