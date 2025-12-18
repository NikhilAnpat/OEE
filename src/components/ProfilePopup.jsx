import './ProfilePopup.css';

function ProfilePopup({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <>
            <div className="profile-overlay" onClick={onClose}></div>
            <div className="profile-popup">
                <div className="profile-header">
                    <div className="profile-avatar-large">👤</div>
                    <div className="profile-info">
                        <h3>John Doe</h3>
                        <p className="profile-email">john.doe@company.com</p>
                    </div>
                </div>

                <div className="profile-menu">
                    <button className="profile-menu-item">
                        <span className="menu-icon">👤</span>
                        <span>My Profile</span>
                    </button>
                    <button className="profile-menu-item">
                        <span className="menu-icon">⚙️</span>
                        <span>Settings</span>
                    </button>
                    
                    <button className="profile-menu-item">
                        <span className="menu-icon">❓</span>
                        <span>Help & Support</span>
                    </button>
                    <div className="menu-divider"></div>
                    <button className="profile-menu-item logout">
                        <span className="menu-icon">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}

export default ProfilePopup;
