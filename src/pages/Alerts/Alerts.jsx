import "./Alerts.css";
import { useState, useEffect } from "react";

function Alerts() {
  const [theme, setTheme] = useState("light");
  const [alerts, setAlerts] = useState([]);

  const alertsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const loadTriggeredAlerts = () => {
    const triggeredAlerts = localStorage.getItem("triggeredAlerts");
    if (!triggeredAlerts) {
      setAlerts([]);
      return;
    }

    const allAlerts = JSON.parse(triggeredAlerts);
    const today = new Date().toDateString();

    const todayAlerts = allAlerts.filter((alert) => {
      const alertDate = new Date(alert.timestamp).toDateString();
      return alertDate === today;
    });

    setAlerts(todayAlerts);
  };

  
  useEffect(() => {
    loadTriggeredAlerts();

    const handleStorageChange = (e) => {
      if (e.key === "triggeredAlerts") {
        loadTriggeredAlerts();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const totalPages = Math.ceil(alerts.length / alertsPerPage);
  const startIndex = (currentPage - 1) * alertsPerPage;
  const currentAlerts = alerts.slice(
    startIndex,
    startIndex + alertsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [alerts]);

  return (
    <div
      className="a-alert-setup-container"
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
      
      <div className="a-eemd-toggle">
        <span className="a-sun-symbol">☀</span>
        <label className="a-switch">
          <input
            type="checkbox"
            onChange={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
          />
          <span className="a-slider"></span>
        </label>
        <span>🌙</span>
      </div>

      
      <div className="a-alert-container">
        <h1 className="a-alert-h1">Triggered Alerts (Today)</h1>

        <div className="a-meter-container">
          {alerts.length === 0 && (
            <p style={{ textAlign: "center", opacity: 0.6 }}>
              No alerts triggered today
            </p>
          )}

          {currentAlerts.map((alert) => (
            <div className="a-meter-row" key={alert.id}>
              <span className="a-meter-text">
                [{new Date(alert.timestamp).toLocaleTimeString()}]{" "}
                {alert.message}
              </span>
            </div>
          ))}
        </div>

        
        {alerts.length > alertsPerPage && (
          <div className="pagination">
            <button
              className="page-btn prev"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-btn ${
                  currentPage === i + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="page-btn next"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Alerts;
