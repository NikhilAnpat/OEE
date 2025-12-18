import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import "./EnergyMonitoringDashboard.css";
import energyData from "../../services/Data.json";

export default function EnergyMonitoringDashboard() {
  const [theme, setTheme] = useState("light");
  const [energyMetrics, setEnergyMetrics] = useState({
    totalConsumption: 0,
    totalCost: 0,
    maxDemand: 0
  });
  const [hasRecords, setHasRecords] = useState(true);

  const lineRef = useRef(null);
  const barRef = useRef(null);
  const pieRef = useRef(null);

  // Calculate energy metrics from data
  useEffect(() => {
    // ✅ device/system current time
    const now = new Date();

    // ✅ last 24 hours window
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // ✅ filter JSON data for last 24 hours
    const last24HrData = energyData.filter(item => {
      if (!item.ts || typeof item["Meter:KWH"] !== "number") return false;
      const ts = new Date(item.ts);
      return ts >= last24Hours && ts <= now;
    });

    if (last24HrData.length === 0) {
      setHasRecords(false);
      return;
    }

    setHasRecords(true);

    // ✅ sort by timestamp
    last24HrData.sort((a, b) => new Date(a.ts) - new Date(b.ts));

    console.log('last24HrData', last24HrData);

    // ✅ cumulative meter logic
    const firstKwh = last24HrData[0]["Meter:KW"];
    const lastKwh = last24HrData[last24HrData.length - 1]["Meter:KW"];

    console.log('lastKwh', lastKwh);
    console.log('firstKwh', firstKwh);

    const totalEnergyKwh = lastKwh + firstKwh;
    const COST_PER_KWH = 7;

    // ✅ max demand logic
    const maxKW = Math.max(...last24HrData.map(d => d["Meter:KW"] || 0));

    setEnergyMetrics({
      totalConsumption: totalEnergyKwh,   // kWh
      totalCost: totalEnergyKwh * COST_PER_KWH,
      maxDemand: maxKW / 1000 // MW
    });

  }, []);





  useEffect(() => {
    const isDark = theme === "dark";

    const commonLabelColor = isDark ? "#e5e7eb" : "#374151";
    const gridColor = isDark ? "rgba(255,255,255,0.15)" : "#e5e7eb";

    const line = new ApexCharts(lineRef.current, {
      chart: {
        type: "line",
        height: "100%",
        toolbar: { show: false },
        foreColor: commonLabelColor
      },

      theme: {
        mode: isDark ? "dark" : "light"
      },

      tooltip: {
        theme: isDark ? "dark" : "light"
      },

      series: [
        { name: "WBSEDCL Line", data: [1.1, 1.3, 1.45, 1.4, 1.35, 1.5, 1.42] },
        { name: "Generator", data: [0, 0, 0, 0, 0, 0, 0] }
      ],

      xaxis: {
        categories: ["07:30", "08:30", "09:30", "10:30", "11:30", "12:30", "13:00"],
        labels: {
          style: {
            colors: commonLabelColor
          }
        }
      },

      yaxis: {
        labels: {
          style: {
            colors: commonLabelColor
          }
        }
      },

      grid: {
        borderColor: gridColor
      },

      stroke: { width: 3 },
      colors: ["#6aa84f", "#f1c232"]
    });

    const bar = new ApexCharts(barRef.current, {
      chart: {
        type: "bar",
        stacked: true,
        height: 260,
        toolbar: { show: false },
        foreColor: commonLabelColor
      },

      theme: {
        mode: isDark ? "dark" : "light"
      },

      tooltip: {
        theme: isDark ? "dark" : "light"
      },

      series: [
        { name: "Grid", data: [1.4, 1.35, 1.38, 1.3, 1.42] },
        { name: "Generator", data: [0.8, 0.85, 0.9, 0.8, 0.95] }
      ],

      xaxis: {
        categories: ["09:00", "10:00", "11:00", "12:00", "13:00"]
      },

      grid: {
        borderColor: gridColor
      },

      colors: ["#6aa84f", "#cc0000"]
    });

    const pie = new ApexCharts(pieRef.current, {
      chart: {
        type: "pie",
        height: 260,
        foreColor: commonLabelColor
      },

      theme: {
        mode: isDark ? "dark" : "light"
      },

      tooltip: {
        theme: isDark ? "dark" : "light"
      },

      series: [56, 28, 6, 10],
      labels: ["Satake", "Miltech", "Compressor", "Boiler"],
      colors: ["#6aa84f", "#cc0000", "#3d85c6", "#f1c232"]
    });

    line.render();
    bar.render();
    pie.render();

    return () => {
      line.destroy();
      bar.destroy();
      pie.destroy();
    };
  }, [theme]);

  return (
    <section
      className="emd-root"
      style={
        theme === "dark"
          ? {
            "--bg-main": "#020617",
            "--text-main": "#f9fafb",
            "--card-bg": "#0f172a",
            "--border-color": "rgba(255,255,255,0.15)",
            "--btn-bg": "#0f172a",
            "--btn-text": "#ffffff",
            "--shadow": "0 4px 12px rgba(0,0,0,0.4)",
            "--muted-text": "#94a3b8"
          }
          : {}
      }
    >
      <div className="emd-topbar">
        <div className="emd-breadcrumb">
          Energy management / Energy Monitoring Dashboard
        </div>

        <div className="emd-actions">
          <select className="emd-select">
            <option>Last 6 hours</option>
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
          </select>

          <button className="emd-btn">Download Daily Report</button>

          <div className="emd-toggle">
            <span>☀</span>
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
        </div>
      </div>

      <div className="emd-top-row">
        <div className="emd-card power-card">
          <h3>Power Consumption (WBSEDCL Line vs Generator)</h3>
          <div className="chart-holder" ref={lineRef}></div>
        </div>

        <div className="emd-kpi-grid">
          <div className="emd-card kpi">
            <p>Last 24 Hrs Energy Consumption</p>

            {hasRecords ? (
              <h2 className="green">
                {energyMetrics.totalConsumption.toFixed(1)} <span>kWh</span>
                <br />
                {/* <small style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
        ({(energyMetrics.totalConsumption / 1000).toFixed(2)} MWh)
      </small> */}
              </h2>
            ) : (
              <h2 style={{ color: "#9ca3af", fontSize: "1rem" }}>
                No records for last 24 hours
              </h2>
            )}
          </div>


          <div className="emd-card kpi">
            <p>Energy from Generator</p>
            <h2 className="red">444 <span>kWh</span></h2>
          </div>

          <div className="emd-card kpi">
            <p>Last 24 Hrs Energy Cost</p>

            {hasRecords ? (
              <h2 className="green">
                ₹{energyMetrics.totalCost.toFixed(0)}
                <br />
                {/* <small style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
        (₹{(energyMetrics.totalCost / 1000).toFixed(2)} K)
      </small> */}
              </h2>
            ) : (
              <h2 style={{ color: "#9ca3af", fontSize: "1rem" }}>
                No records for last 24 hours
              </h2>
            )}
          </div>


          <div className="emd-card kpi">
            <p>Max Demand (Last 24 Hrs)</p>
            {hasRecords ? (
              <h2 className="green">
                {energyMetrics.maxDemand.toFixed(2)} <span>MW</span>
              </h2>
            ) : (
              <h2 style={{ color: "#9ca3af", fontSize: "1.6vh" }}>No records for last 24 hours</h2>
            )}
          </div>

          <div className="emd-card kpi">
            <p>Max Demand Time</p>
            <h2>2022-05-24<br />20:29:07</h2>
          </div>

          <div className="emd-card kpi">
            <p>Power Outage</p>
            <h2 className="green">56 <span>min</span></h2>
          </div>
        </div>
      </div>

      <div className="emd-grid">
        <div className="emd-card span-2">
          <h3>Hourly Segment Wise Energy Consumption</h3>
          <div ref={barRef}></div>
        </div>

        <div className="emd-card">
          <h3>Segment Wise Energy Consumption</h3>
          <div ref={pieRef}></div>
        </div>

        <div className="emd-card">
          <h3>Motor Running Status</h3>

          <div className="motor-row">
            <span>Silky Motor 1</span>
            <div className="motor-bar">
              <span className="on"></span>
              <span className="on"></span>
              <span className="off"></span>
              <span className="on"></span>
            </div>
          </div>

          <div className="motor-row">
            <span>Whitener Motor 5</span>
            <div className="motor-bar">
              <span className="on"></span>
              <span className="on"></span>
              <span className="on"></span>
              <span className="off"></span>
            </div>
          </div>

          <div className="motor-row">
            <span>Silky Motor 3</span>
            <div className="motor-bar">
              <span className="on"></span>
              <span className="off"></span>
              <span className="on"></span>
              <span className="on"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
