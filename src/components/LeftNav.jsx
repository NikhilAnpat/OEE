import { NavLink } from 'react-router-dom';
import './LeftNav.css';

function LeftNav({ isNavOpen = true, setIsNavOpen, isMobile = false }) {
  const handleLinkClick = () => {
    if (isMobile && setIsNavOpen) setIsNavOpen(false);
  };

  return (
    <nav className={`left-nav ${isNavOpen ? 'open' : 'closed'}`}>
      {isMobile && isNavOpen && (
        <button
          className="nav-close"
          onClick={() => setIsNavOpen && setIsNavOpen(false)}
          aria-label="Close navigation"
        >
          ✕
        </button>
      )}

      <NavLink 
        to="/digital-input" 
        onClick={handleLinkClick}
        className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}>
        Digital Input
      </NavLink>
      <NavLink 
        to="/digital-output" 
        onClick={handleLinkClick}
        className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
      >
        Digital Output
      </NavLink>
      <NavLink 
        to="/analog-input" 
        onClick={handleLinkClick}
        className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
      >
        Analog Input
      </NavLink>
      <NavLink 
        to="/analog-output" 
        onClick={handleLinkClick}
        className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
      >
        Analog Output
      </NavLink>
      <NavLink 
        to="/machine-dashboard" 
        onClick={handleLinkClick}
        className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
      >
        Machine Dashboard
      </NavLink>
      
      <NavLink 
        to="/report" 
        onClick={handleLinkClick}
        className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
      >
        Report
      </NavLink>
      <NavLink 
        to="/energy-consumption" 
        onClick={handleLinkClick}
        className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
      >
        Energy Consumption
      </NavLink>
      <NavLink 
        to="/oee-dashboard" 
        onClick={handleLinkClick}
        className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
      >
        OEE Dashboard
      </NavLink>
    </nav>
  );
}

export default LeftNav;

