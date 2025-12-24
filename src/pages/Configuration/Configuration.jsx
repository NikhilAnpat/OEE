import { useState, useEffect } from 'react';
import ModuleLayout from '../../components/ModuleLayout';
import {
  getAllModules,
  getEnergySubRoutes,
} from '../../utils/permissions';
import { usersApi, permissionsApi } from '../../services/oeeBeApi';
import './Configuration.css';

function Configuration() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [permissions, setPermissions] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const modules = getAllModules();
  const energySubRoutes = getEnergySubRoutes();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingUsers(true);
      setErrorMessage('');
      try {
        const rows = await usersApi.list();
        if (!mounted) return;
        setUsers(rows);
        if (rows.length > 0) {
          setSelectedUserId(String(rows[0].id));
        }
      } catch (err) {
        if (!mounted) return;
        setErrorMessage(err?.message || 'Failed to load users');
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      setPermissions(null);
      return;
    }

    const user = users.find((u) => String(u.id) === String(selectedUserId));
    if (!user) {
      setPermissions(null);
      return;
    }

    let mounted = true;
    (async () => {
      setLoadingPermissions(true);
      setErrorMessage('');
      try {
        const row = await permissionsApi.getByUserId(user.id);
        if (!mounted) return;
        setPermissions({
          modules: row?.modules || {},
          energySubRoutes: row?.energySubRoutes || {},
        });
      } catch (err) {
        const message = err?.message || 'Failed to load permissions';
        // If permissions are missing, create defaults for this user based on role.
        if (message === 'Permissions not found') {
          try {
            const created = await permissionsApi.resetDefaults(user.id, user.role);
            if (!mounted) return;
            setPermissions({
              modules: created?.modules || {},
              energySubRoutes: created?.energySubRoutes || {},
            });
            return;
          } catch (err2) {
            if (!mounted) return;
            setErrorMessage(err2?.message || message);
          }
        } else {
          if (!mounted) return;
          setErrorMessage(message);
        }
      } finally {
        if (mounted) setLoadingPermissions(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectedUserId, users]);

  const selectedUser = users.find((u) => String(u.id) === String(selectedUserId)) || null;

  const handleUserSelect = (userId) => {
    setSelectedUserId(String(userId));
  };

  const persistPermissions = async (nextPermissions) => {
    if (!selectedUser) return;
    setErrorMessage('');
    try {
      const updated = await permissionsApi.updateByUserId(selectedUser.id, nextPermissions);
      setPermissions({
        modules: updated?.modules || {},
        energySubRoutes: updated?.energySubRoutes || {},
      });
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to save permissions');
    }
  };

  const handleModuleToggle = (moduleId, enabled) => {
    if (!selectedUser || !permissions) return;

    const next = {
      modules: { ...permissions.modules, [moduleId]: enabled },
      energySubRoutes: { ...permissions.energySubRoutes },
    };

    // If disabling Energy module, disable all Energy sub-routes
    if (moduleId === 'energy' && !enabled) {
      Object.keys(next.energySubRoutes).forEach((route) => {
        next.energySubRoutes[route] = false;
      });
    }

    // If enabling Energy module, enable all sub-routes
    if (moduleId === 'energy' && enabled) {
      Object.keys(next.energySubRoutes).forEach((route) => {
        next.energySubRoutes[route] = true;
      });
    }

    setPermissions(next);
    persistPermissions(next);
  };

  const handleEnableAllModule = (moduleId, enabled) => {
    if (!selectedUser || !permissions || moduleId !== 'energy') return;

    const next = {
      modules: { ...permissions.modules, [moduleId]: enabled },
      energySubRoutes: { ...permissions.energySubRoutes },
    };

    Object.keys(next.energySubRoutes).forEach((route) => {
      next.energySubRoutes[route] = enabled;
    });

    setPermissions(next);
    persistPermissions(next);
  };

  const handleEnergySubRouteToggle = (routeId, enabled) => {
    if (!selectedUser || !permissions) return;

    const next = {
      modules: { ...permissions.modules },
      energySubRoutes: { ...permissions.energySubRoutes, [routeId]: enabled },
    };

    // If enabling any Energy sub-route, enable Energy module
    if (enabled) {
      next.modules.energy = true;
    } else {
      const allDisabled = Object.values(next.energySubRoutes).every((val) => val === false);
      if (allDisabled) {
        next.modules.energy = false;
      }
    }

    setPermissions(next);
    persistPermissions(next);
  };

  const handleGroupToggle = (groupName, routes, enabled) => {
    if (!selectedUser || !permissions) return;

    const next = {
      modules: { ...permissions.modules },
      energySubRoutes: { ...permissions.energySubRoutes },
    };

    routes.forEach((route) => {
      next.energySubRoutes[route.id] = enabled;
    });

    const allDisabled = Object.values(next.energySubRoutes).every((val) => val === false);
    next.modules.energy = !allDisabled;

    setPermissions(next);
    persistPermissions(next);
  };


  const toggleModuleExpansion = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const groupedEnergyRoutes = energySubRoutes.reduce((acc, route) => {
    if (!acc[route.group]) {
      acc[route.group] = [];
    }
    acc[route.group].push(route);
    return acc;
  }, {});

  return (
    <ModuleLayout moduleName="Configuration" sidebarItems={['User Management', 'Permissions', 'Access Control', 'Settings']}>
      <div className="configuration-container">
        <div className="configuration-header">
          <div className="header-top">
            <div>
              <h1>User Access Management</h1>
              <p>Manage user permissions and module access</p>
            </div>
          </div>

          <div className="user-selector-section">
            <div className="user-selector">
              <label htmlFor="user-select">Select User:</label>
              <select
                id="user-select"
                value={selectedUserId}
                onChange={(e) => {
                  handleUserSelect(e.target.value);
                }}
                className="user-dropdown"
              >
                <option value="">-- Select User --</option>
                {users.map((user) => (
                  <option key={user.id} value={String(user.id)}>
                    {user.email} ({String(user.role).toLowerCase()})
                  </option>
                ))}
              </select>
              <button
                className="reset-permissions-btn"
                onClick={() => {
                  if (!selectedUser) return;
                  if (!window.confirm('Reset permissions to default for this user?')) return;
                  (async () => {
                    try {
                      const row = await permissionsApi.resetDefaults(selectedUser.id, selectedUser.role);
                      setPermissions({
                        modules: row?.modules || {},
                        energySubRoutes: row?.energySubRoutes || {},
                      });
                    } catch (err) {
                      setErrorMessage(err?.message || 'Failed to reset permissions');
                    }
                  })();
                }}
                title="Reset to default permissions"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="no-selection">
            <p style={{ color: 'crimson' }}>{errorMessage}</p>
          </div>
        )}

        {selectedUser && permissions ? (
          <div className="permissions-content-new">
            <div className="modules-list">
              {modules.map((module) => {
                const hasAccess = permissions.modules?.[module.id] === true;
                const isExpanded = expandedModules[module.id];
                const isEnergy = module.id === 'energy';
                const isAdmin = String(selectedUser.role).toLowerCase() === 'admin';

                return (
                  <div key={module.id} className="module-section">
                    <div
                      className="module-section-header"
                      onClick={() => {
                        if (hasAccess || isEnergy) {
                          toggleModuleExpansion(module.id);
                        }
                      }}
                    >
                      <div className="module-header-left">
                        <button
                          className="expand-icon-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (hasAccess || isEnergy) {
                              toggleModuleExpansion(module.id);
                            }
                          }}
                          disabled={!hasAccess && !isEnergy}
                        >
                          {isExpanded ? '▼' : '▶'}
                        </button>
                        <span className="module-section-title">{module.name} Features</span>
                        <span className="info-icon" title="Module information">ℹ️</span>
                      </div>
                      <div className="module-header-right" onClick={(e) => e.stopPropagation()}>
                        <span className="enable-all-label">Enable All {module.name} Features</span>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={hasAccess}
                            onChange={(e) => handleModuleToggle(module.id, e.target.checked)}
                            disabled={isAdmin}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>

                    {isEnergy && hasAccess && isExpanded && (
                      <div className="module-sub-features">
                        {Object.entries(groupedEnergyRoutes).map(([group, routes]) => {
                          const allGroupRoutesEnabled = routes.every(
                            (route) => permissions.energySubRoutes?.[route.id] === true
                          );
                          const hasAnyGroupRouteEnabled = routes.some(
                            (route) => permissions.energySubRoutes?.[route.id] === true
                          );

                          return (
                            <div key={group} className="sub-feature-group">
                              <div
                                className="sub-feature-group-header"
                                onClick={() =>
                                  setExpandedModules((prev) => ({
                                    ...prev,
                                    [group]: !prev[group],
                                  }))
                                }
                              >
                                <button
                                  className="expand-icon-btn small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedModules((prev) => ({
                                      ...prev,
                                      [group]: !prev[group],
                                    }));
                                  }}
                                >
                                  {expandedModules[group] ? '▼' : '▶'}
                                </button>
                                <span className="sub-feature-group-title">{group}</span>
                                <div className="group-toggle-container">
                                  <span className="enable-all-label">Enable All {group} Features</span>
                                  <label
                                    className="toggle-switch"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={allGroupRoutesEnabled}
                                      onChange={(e) =>
                                        handleGroupToggle(group, routes, e.target.checked)
                                      }
                                      disabled={isAdmin}
                                    />
                                    <span className="toggle-slider"></span>
                                  </label>
                                </div>
                              </div>

                            {expandedModules[group] && (
                              <div className="sub-feature-items">
                                {routes.map((route) => {
                                  const hasSubAccess =
                                    permissions.energySubRoutes?.[route.id] === true;
                                  return (
                                    <div key={route.id} className="sub-feature-item">
                                      <div className="sub-feature-info">
                                        <span className="sub-feature-name">{route.name}?</span>
                                        <span className="info-icon small" title="Feature information">
                                          ℹ️
                                        </span>
                                      </div>
                                      <label className="toggle-switch">
                                        <input
                                          type="checkbox"
                                          checked={hasSubAccess}
                                          onChange={(e) =>
                                            handleEnergySubRouteToggle(route.id, e.target.checked)
                                          }
                                          disabled={isAdmin}
                                        />
                                        <span className="toggle-slider"></span>
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="no-selection">
            <p>
              {loadingUsers || loadingPermissions
                ? 'Loading...'
                : 'Please select a user to manage their permissions'}
            </p>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}

export default Configuration;
