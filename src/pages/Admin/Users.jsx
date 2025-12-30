import React, { useEffect, useState } from 'react';
import './Admin.css';
import { usersApi } from '../../services/oeeBeApi';

function Users({ onCreateClick, onEditClick }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        usersApi.list()
            .then((data) => {
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                    ? data.data
                    : [];
               
                setUsers(list);
                setLoading(false);
            })
            .catch((err) => {
                setError(err?.message || 'Failed to fetch users');
                setLoading(false);
            });
    }, []);

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>User Management</h2>
            </div>

            <div className="table-container">
                {loading ? (
                    <div>Loading users...</div>
                ) : error ? (
                    <div style={{ color: 'red' }}>Error: {error}</div>
                ) : users.length === 0 ? (
                    <div>No users found</div>
                ) : (
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th className="user-th">User</th>
                                <th>Role</th>
                                <th>Company</th>
                                <th>Contact</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                try {
                                    return users.map(( user, idx) => (
                                        <tr key={user.id || idx}>
                                            <td className="user-td">
                                                <div className="table-user-info">
                                                    <div className="table-user-avatar">
                                                        {(user.full_name || user.name || 'U')
                                                            .split(' ')
                                                            .map(n => n[0] || '')
                                                            .join('')}
                                                    </div>
                                                    <div className="table-user-details">
                                                        <span className="table-user-name">{user.full_name || user.name || 'Unknown'}</span>
                                                        <span className="table-user-email">{user.email || '-'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="role-badge">{user.role || '-'}</span>
                                            </td>
                                            <td>
                                                <span className="company-badge">{user.company_name || '-'}</span>
                                            </td>
                                            <td>{user.mobile_no || '-'}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="action-btn edit-btn"
                                                        title="Edit"
                                                        onClick={() => typeof onEditClick === 'function' ? onEditClick(user) : null}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="action-btn delete-btn"
                                                        title="Delete"
                                                        onClick={async () => {
                                                            if (window.confirm('Are you sure you want to delete this user?')) {
                                                                try {
                                                                    await usersApi.remove(user.id);
                                                                    setUsers(prev => prev.filter(u => u.id !== user.id));
                                                                    alert('User deleted successfully!');
                                                                } catch (err) {
                                                                    alert(err?.message || 'Failed to delete user');
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ));
                                } catch (err) {
                                   
                                    return (
                                        <tr>
                                            <td colSpan={5} style={{ color: 'red' }}>Error rendering users: {err.message}</td>
                                        </tr>
                                    );
                                }
                            })()}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Users;
