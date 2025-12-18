import { useState } from 'react';
import './NotificationPopup.css';

function NotificationPopup({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('all');

    // Sample notification data
    const notifications = [
        {
            id: 1,
            user: 'Dora Peshi',
            action: 'published a project',
            project: '"AI Tools in Design"',
            time: '3 min ago',
            workspace: 'Working Space',
            avatar: '👤',
            type: 'info'
        },
        {
            id: 2,
            user: 'Alex Green',
            action: 'attached multiple Photos',
            time: '12 min ago',
            workspace: 'Working Space',
            avatar: '👤',
            type: 'attachment'
        },
        {
            id: 3,
            user: 'Max Lie',
            action: 'attached Files',
            time: '18 min ago',
            files: ['meneger.pdf', 'illustration.png'],
            avatar: '👤',
            type: 'files'
        },
        {
            id: 4,
            user: 'Sofie Cooper',
            action: 'sent a Project Invitation',
            time: '26 min ago',
            workspace: 'Working Space',
            avatar: '👤',
            type: 'invitation',
            hasActions: true
        },
        {
            id: 5,
            user: 'John Owner',
            action: 'sent a message in channel AI Trend',
            message: 'Wow, this is really epic',
            time: '1 day ago',
            workspace: 'Working Space',
            avatar: '👤',
            type: 'message'
        }
    ];

    if (!isOpen) return null;

    return (
        <>
            <div className="notification-overlay" onClick={onClose}></div>
            <div className="notification-popup">
                <div className="notification-header">
                    <h3>Notifications</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="notification-tabs">
                    <button
                        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        View All <span className="badge">8</span>
                    </button>
                
                </div>

                <div className="notification-list">
                    {notifications.map((notif) => (
                        <div key={notif.id} className="notification-item">
                            <div className="notification-avatar">{notif.avatar}</div>
                            <div className="notification-content">
                                <div className="notification-text">
                                    <strong>{notif.user}</strong> {notif.action} {notif.project && <span className="highlight">{notif.project}</span>}
                                    {notif.message && <div className="notification-message">"{notif.message}"</div>}
                                </div>
                                <div className="notification-meta">
                                    <span className="time">{notif.time}</span>
                                    {notif.workspace && <span className="workspace"> • {notif.workspace}</span>}
                                </div>
                                {notif.files && (
                                    <div className="notification-files">
                                        {notif.files.map((file, idx) => (
                                            <div key={idx} className="file-item">
                                                <span className="file-icon">📄</span>
                                                <span className="file-name">{file}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {notif.hasActions && (
                                    <div className="notification-actions">
                                        <button className="accept-btn">Accept</button>
                                        <button className="decline-btn">Decline</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="notification-footer">
                    <a href="#" className="see-all-link">See all notifications</a>
                </div>
            </div>
        </>
    );
}

export default NotificationPopup;
