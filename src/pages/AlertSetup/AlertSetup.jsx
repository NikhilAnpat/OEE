import "../AlertSetup/AlertSetup.css";
import { useState, useEffect } from "react";
import EditAlertModal from "../../models/ems/EditAlertModel";

function AlertSetup() {
  const [theme, setTheme] = useState("light");


  const [alerts, setAlerts] = useState(() => {
    const savedAlerts = localStorage.getItem("alertSetupAlerts");
    return savedAlerts ? JSON.parse(savedAlerts) : [];
  });


  const [meter, setMeter] = useState("");
  const [parameter, setParameter] = useState("");
  const [threshold, setThreshold] = useState("");
  const [message, setMessage] = useState("");


  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);

  useEffect(() => {
    localStorage.setItem("alertSetupAlerts", JSON.stringify(alerts));
  }, [alerts]);


  const handleSave = () => {
    if (!meter || !parameter || !threshold || !message) return;

    setAlerts([
      ...alerts,
      {
        id: Date.now(),
        meter,
        parameter,
        threshold,
        message,
      },
    ]);

    setMeter("");
    setParameter("");
    setThreshold("");
    setMessage("");
  };


  const handleEdit = (alert) => {
    setEditingAlert({ ...alert });
    setIsEditOpen(true);
  };


  const handleModalSave = (updatedAlert) => {
    setAlerts(
      alerts.map((a) =>
        a.id === updatedAlert.id ? updatedAlert : a
      )
    );
    setIsEditOpen(false);
    setEditingAlert(null);
  };


  const handleDelete = (id) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div
      className="alert-setup-container"
      style={
        theme === "dark"
          ? {
            "--bg-main": "#020617",
            "--text-main": "#f9fafb",
            "--card-bg": "#0f172a",
            "--border-color": "rgba(255,255,255,0.15)",
            "--input-bg": "#1e293b",
            "--shadow": "0 4px 12px rgba(0,0,0,0.4)",
          }
          : {}
      }
    >

      <div className="eemd-toggle">
        <span className="sun-symbol">☀</span>
        <label className="switch">
          <input
            type="checkbox"
            onChange={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
          />
          <span className="slider"></span>
        </label>
        <span>🌙</span>
      </div>

      <div className="active-alert-section" >
        <h1 className="alert-h1">Active Alert Rules</h1>

        <div className="meter-container">
          {alerts.length === 0 && (
            <p style={{ textAlign: "center", opacity: 0.6 }}>
              No alerts created yet
            </p>
          )}

          {alerts.map((alert) => (
            <div className="meter-row" key={alert.id}>
              <span className="meter-text">
                Meter {alert.meter}: {alert.parameter} &gt;{" "}
                {alert.threshold}
              </span>

              <div className="meter-actions">
                <button
                  className="btn edit"
                  onClick={() => handleEdit(alert)}
                >
                  ✏️
                </button>
                <button
                  className="btn delete"
                  onClick={() => handleDelete(alert.id)}
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr />


      <h1 className="alert-h1">Create Alert Rule</h1>

      <div className="alert-card">
        <div className="alert-form">
          <div className="form-group">
            <label>Meter</label>
            <select value={meter} onChange={(e) => setMeter(e.target.value)}>
              <option value="">Select Meter</option>
              <option>101 - Shop-1</option> <option>102 - Shop-2</option> <option>103 - Warehouse</option> <option>104 - Office Block</option> <option>105 - Main Panel</option> <option>106 - Generator</option> <option>107 - Server Room</option> <option>108 - Parking Area</option>

            </select>
          </div>

          <div className="form-group">
            <label>Parameter</label>
            <select
              value={parameter}
              onChange={(e) => setParameter(e.target.value)}
            >
              <option value="">Select Parameter</option>
              <option>AvgVoltage</option> <option>MinVoltage</option> <option>MaxVoltage</option> <option>AvgCurrent</option> <option>MaxCurrent</option> <option>Power</option> <option>Energy</option> <option>Frequency</option> <option>Power Factor</option> <option>Load</option>

            </select>
          </div>

          <div className="form-group">
            <label>Threshold Value</label>
            <input
              placeholder="Enter Value"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Alert Message</label>
            <input
              placeholder="Enter Message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <div className="btn-wrapper">
          <button className="save-btn" onClick={handleSave}>
            💾 Save Alert
          </button>
        </div>
      </div>

      <EditAlertModal
        isOpen={isEditOpen}
        alert={editingAlert}
        onClose={() => {
          setIsEditOpen(false);
          setEditingAlert(null);
        }}
        onSave={handleModalSave}
      />
    </div>
  );
}

export default AlertSetup;
