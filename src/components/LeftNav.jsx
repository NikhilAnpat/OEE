import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./LeftNav.css";

function NavDropdown({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="nav-group">
      <div
        className="nav-group-title"
        onClick={() => setOpen(!open)}
      >
        {title}
        <span className="arrow">{open ? "˄" : "˅"}</span>
      </div>

      {open && <div className="nav-submenu">{children}</div>}
    </div>
  );
}

function LeftNav({ isNavOpen = true, setIsNavOpen, isMobile = false }) {
  const handleLinkClick = () => {
    if (isMobile && setIsNavOpen) setIsNavOpen(false);
  };

  return (
    <nav className={`left-nav ${isNavOpen ? "open" : "closed"}`}>
      <NavDropdown title="IO Management">
        <NavLink to="/digital-input" onClick={handleLinkClick}
          className={({ isActive }) => `nav-button sub ${isActive ? "active" : ""}`}>
          Digital Input
        </NavLink>

        <NavLink to="/digital-output" onClick={handleLinkClick}
          className={({ isActive }) => `nav-button sub ${isActive ? "active" : ""}`}>
          Digital Output
        </NavLink>

        <NavLink to="/analog-input" onClick={handleLinkClick}
          className={({ isActive }) => `nav-button sub ${isActive ? "active" : ""}`}>
          Analog Input
        </NavLink>

        <NavLink to="/analog-output" onClick={handleLinkClick}
          className={({ isActive }) => `nav-button sub ${isActive ? "active" : ""}`}>
          Analog Output
        </NavLink>
      </NavDropdown>

      <NavDropdown title="Machine">
        <NavLink to="/machine-dashboard" onClick={handleLinkClick}
          className={({ isActive }) => `nav-button sub ${isActive ? "active" : ""}`}>
          Machine Dashboard
        </NavLink>
     
        <NavLink to="/report" onClick={handleLinkClick}
          className={({ isActive }) => `nav-button sub ${isActive ? "active" : ""}`}>
          Report
        </NavLink>

        <NavLink to="/oee-dashboard" onClick={handleLinkClick}
          className={({ isActive }) => `nav-button sub ${isActive ? "active" : ""}`}>
          OEE Dashboard
        </NavLink>

        <NavLink to="/energy-consumption" onClick={handleLinkClick}
          className={({ isActive }) => `nav-button sub ${isActive ? "active" : ""}`}>
          Energy Consumption
        </NavLink>
      </NavDropdown>
      <NavDropdown title="Energy Management">
        <NavLink to="/energy-monitoring-dashboard" onClick={handleLinkClick}
          className={({ isActive }) => `nav-button sub ${isActive ? "active" : ""}`}>
          Energy Monitoring Dashboard
        </NavLink>

        <NavLink to="/power-quality-monitoring" onClick={handleLinkClick}
          className={({ isActive }) => `nav-button sub ${isActive ? "active" : ""}`}>
          Power Quality Monitoring Dashboard
        </NavLink>

        <NavLink to="/event-data" onClick={handleLinkClick}
          className={({ isActive }) => `nav-button sub ${isActive ? "active" : ""}`}>
          Event Data
        </NavLink>

        <NavLink to="/alerts" onClick={handleLinkClick}
          className={({ isActive }) => `nav-button sub ${isActive ? "active" : ""}`}>
          Alerts
        </NavLink>

        <NavLink to="/alert-setup" onClick={handleLinkClick}
          className={({ isActive }) => `nav-button sub ${isActive ? "active" : ""}`}>
          Alert Setup
        </NavLink>
        <NavLink to="/report" onClick={handleLinkClick}
          className={({ isActive }) => `nav-button sub ${isActive ? "active" : ""}`}>
          Report
        </NavLink>
 </NavDropdown>

    </nav>
  );
}

export default LeftNav;
