// Permissions helper for the current logged-in user.
//
// Backend login returns the user's permissions, which are stored in:
// - localStorage.currentPermissions: { modules: {...}, energySubRoutes: {...} }
// - localStorage.userRole: 'admin' | 'user' (lowercased in Login.jsx)

const ENERGY_SUBROUTE_IDS = [
  'digital-input',
  'digital-output',
  'analog-input',
  'analog-output',
  'machine-dashboard',
  'oee-dashboard',
  'report',
  'energy-consumption',
  'energy-monitoring-dashboard',
  'power-quality-monitoring',
  'alerts',
  'alert-setup',
  'event-data',
];

function safeJsonParse(value, fallback) {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getRole() {
  const role = (localStorage.getItem('userRole') || '').toLowerCase();
  return role || 'user';
}

function normalizeRoute(route) {
  if (!route) return '';
  const trimmed = String(route).trim();
  if (!trimmed) return '';
  return trimmed;
}

export const getCurrentPermissions = () => {
  const parsed = safeJsonParse(localStorage.getItem('currentPermissions'), null);
  if (!parsed || typeof parsed !== 'object') return { modules: {}, energySubRoutes: {} };
  return {
    modules: parsed.modules && typeof parsed.modules === 'object' ? parsed.modules : {},
    energySubRoutes:
      parsed.energySubRoutes && typeof parsed.energySubRoutes === 'object' ? parsed.energySubRoutes : {},
  };
};

export const hasModuleAccess = (moduleId) => {
  if (!moduleId) return false;
  if (getRole() === 'admin') return true;
  const perms = getCurrentPermissions();
  return perms.modules?.[moduleId] === true;
};

export const hasRouteAccess = (route) => {
  const normalized = normalizeRoute(route);
  if (!normalized) return false;
  if (getRole() === 'admin') return true;

  const perms = getCurrentPermissions();

  // App sometimes passes energy routes as: 'digital-input' (no slash)
  // LeftNav passes energy routes as: 'digital-input'
  // Other modules pass routes as: '/checklist', '/quality', etc.
  const routeId = normalized.startsWith('/') ? normalized.slice(1) : normalized;

  if (ENERGY_SUBROUTE_IDS.includes(routeId)) {
    if (perms.modules?.energy !== true) return false;
    return perms.energySubRoutes?.[routeId] === true;
  }

  const moduleMap = {
    '/admin': 'admin',
    '/configuration': 'configuration',
    '/checklist': 'checklist',
    '/mint': 'mint',
    '/quality': 'quality',
    '/console': 'console',
    '/productivity': 'productivity',
    '/dfx-ai': 'dfx-ai',
    '/datonis-bi': 'datonis-bi',
    '/documents': 'documents',
    '/maintenance': 'maintenance',
    '/designer': 'designer',
  };

  const routeWithSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
  const moduleId = moduleMap[routeWithSlash];
  if (!moduleId) return false;

  return perms.modules?.[moduleId] === true;
};

// Get all modules list
export const getAllModules = () => {
  return [
    { id: 'admin', name: 'ADMIN', path: '/admin' },
    { id: 'configuration', name: 'CONFIGURATION', path: '/configuration' },
    { id: 'checklist', name: 'CHECKLIST', path: '/checklist' },
    { id: 'mint', name: 'MINT', path: '/mint' },
    { id: 'energy', name: 'ENERGY', path: '/digital-input' },
    { id: 'quality', name: 'QUALITY', path: '/quality' },
    { id: 'console', name: 'CONSOLE', path: '/console' },
    { id: 'productivity', name: 'PRODUCTIVITY', path: '/productivity' },
    { id: 'dfx-ai', name: 'DFX AI', path: '/dfx-ai' },
    { id: 'datonis-bi', name: 'DATONIS BI', path: '/datonis-bi' },
    { id: 'documents', name: 'DOCUMENTS', path: '/documents' },
    { id: 'maintenance', name: 'MAINTENANCE', path: '/maintenance' },
    { id: 'designer', name: 'DESIGNER', path: '/designer' },
  ];
};

// Get all Energy sub-routes
export const getEnergySubRoutes = () => {
  return [
    { id: 'digital-input', name: 'Digital Input', path: '/digital-input', group: 'IO Management' },
    { id: 'digital-output', name: 'Digital Output', path: '/digital-output', group: 'IO Management' },
    { id: 'analog-input', name: 'Analog Input', path: '/analog-input', group: 'IO Management' },
    { id: 'analog-output', name: 'Analog Output', path: '/analog-output', group: 'IO Management' },
    { id: 'machine-dashboard', name: 'Machine Dashboard', path: '/machine-dashboard', group: 'Machine' },
    { id: 'oee-dashboard', name: 'OEE Dashboard', path: '/oee-dashboard', group: 'Machine' },
    { id: 'energy-consumption', name: 'Energy Consumption', path: '/energy-consumption', group: 'Machine' },
    { id: 'report', name: 'Report', path: '/report', group: 'Machine' },
    { id: 'energy-monitoring-dashboard', name: 'Energy Monitoring Dashboard', path: '/energy-monitoring-dashboard', group: 'Energy Management' },
    { id: 'power-quality-monitoring', name: 'Power Quality Monitoring', path: '/power-quality-monitoring', group: 'Energy Management' },
    { id: 'event-data', name: 'Event Data', path: '/event-data', group: 'Energy Management' },
    { id: 'alerts', name: 'Alerts', path: '/alerts', group: 'Energy Management' },
    { id: 'alert-setup', name: 'Alert Setup', path: '/alert-setup', group: 'Energy Management' },
  ];
};

