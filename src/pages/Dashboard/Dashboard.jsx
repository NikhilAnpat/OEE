import { useNavigate } from 'react-router-dom';
import { hasModuleAccess } from '../../utils/permissions';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  // Get user email and role from localStorage
  const userEmail = localStorage.getItem('userEmail') || '';
  const userRole = localStorage.getItem('userRole') || 'user';
  const isAdmin = userRole === 'admin';

  const allModules = [
    { id: 'admin', name: 'ADMIN', icon: '⚙️', path: '/admin' },
    { id: 'configuration', name: 'CONFIGURATION', icon: '⚙️', path: '/configuration', adminOnly: true },
    { id: 'checklist', name: 'CHECKLIST', icon: '📄', path: '/checklist' },
    { id: 'mint', name: 'MINT', icon: '⚙️', path: '/mint' },
    { id: 'energy', name: 'ENERGY', icon: '⚡', path: '/digital-input' },
    { id: 'quality', name: 'QUALITY', icon: '🏆', path: '/quality' },
    { id: 'console', name: 'CONSOLE', icon: '🖥️', path: '/console' },
    { id: 'productivity', name: 'PRODUCTIVITY', icon: '📈', path: '/productivity' },
    { id: 'dfx-ai', name: 'DFX AI', icon: '🧠', path: '/dfx-ai' },
    { id: 'datonis-bi', name: 'DATONIS BI', icon: '📊', path: '/datonis-bi' },
    { id: 'documents', name: 'DOCUMENTS', icon: '📁', path: '/documents' },
    { id: 'maintenance', name: 'MAINTENANCE', icon: '🔧', path: '/maintenance' },
    { id: 'designer', name: 'DESIGNER', icon: '📐', path: '/designer' },
  ];

  // Filter modules based on user permissions
  const modules = allModules.filter(module => {
    // Admin-only modules (like Configuration)
    if (module.adminOnly && !isAdmin) {
      return false;
    }
    // Check module access using permissions system
    if (!isAdmin) {
      return hasModuleAccess(userEmail, module.id);
    }
    // Admin has access to everything
    return true;
  });

  const handleModuleClick = (module) => {
    if (module.path) {
      navigate(module.path);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        {/* <div className="dashboard-logo">
          <span className="logo-icon">⚙️</span>
          <span className="logo-text">DFX</span>
        </div> */}
        <div className="dashboard-banner">
          <h1>Demo</h1>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="modules-grid">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`module-hex ${module.id === 'productivity' ? 'active' : ''}`}
              onClick={() => handleModuleClick(module)}
            >
              <div className="hex-icon">{module.icon}</div>
              <div className="hex-label">{module.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

