import React, { useState } from 'react';
import './Admin.css';
import { usersApi } from '../../services/oeeBeApi';
import { toast } from '../../components/Toast';

function CreateUser({ onCancel }) {
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

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                user_name: formData.firstName.toLowerCase() + (Math.floor(Math.random() * 1000)),
                email: formData.email,
                password: formData.password,
                role: formData.role === 'Manager' ? 'USER' : formData.role.toUpperCase(),
                status: formData.status.toUpperCase(),
                full_name: `${formData.firstName} ${formData.lastName}`,
                company_name: formData.companyName || "OEE",
                mobile_no: formData.phone,
                country_code: formData.countryCode,
                photo: null
            };
            console.log('Creating User with payload:', payload);

            await usersApi.create(payload);

            toast.success('User created successfully!');
            if (onCancel) onCancel();
        } catch (error) {
            console.error('Failed to create user:', error);
            toast.error(`Failed to create user: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Create New User</h2>
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
                        <p className="photo-hint">Upload Profile Photo</p>
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
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">User</option>

                                </select>
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
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
                                        required
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
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="secondary-btn" onClick={onCancel} disabled={loading}>Cancel</button>
                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateUser;
