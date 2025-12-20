import ModuleLayout from '../../components/ModuleLayout';
import '../../components/ModulePage.css';

function Admin() {
  return (
    <ModuleLayout moduleName="Admin" sidebarItems={['Dashboard', 'Users', 'Settings', 'Permissions']}>
      <div className="module-page-container">
        <div className="module-toggle-container">
          <h2>Admin Module</h2>
          <p>Admin functionality will be available here.</p>
        </div>
      </div>
    </ModuleLayout>
  );
}

export default Admin;

