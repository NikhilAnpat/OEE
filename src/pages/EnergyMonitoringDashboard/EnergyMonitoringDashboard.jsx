import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import "./EnergyMonitoringDashboard.css";

export default function EnergyMonitoringDashboard() {
  const [theme, setTheme] = useState("light");

  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    /* ---------- LINE CHART ---------- */
    const lineChart = new ApexCharts(lineChartRef.current, {
      chart: {
        type: "line",
        height: 260,
        toolbar: { show: false }
      },
      series: [
        { name: "WBSEDCL Line", data: [1.1, 1.3, 1.45, 1.4, 1.35, 1.5, 1.42] },
        { name: "Generator", data: [0, 0, 0, 0, 0, 0, 0] }
      ],
      xaxis: {
        categories: ["07:30", "08:30", "09:30", "10:30", "11:30", "12:30", "13:00"]
      },
      colors: ["#6aa84f", "#f1c232"],
      stroke: { width: 3 },
      grid: { borderColor: "#e5e7eb" }
    });

    /* ---------- BAR CHART ---------- */
    const barChart = new ApexCharts(barChartRef.current, {
      chart: {
        type: "bar",
        height: 260,
        stacked: true,
        toolbar: { show: false }
      },
      series: [
        { name: "Green", data: [1.4, 1.35, 1.38, 1.3, 1.42] },
        { name: "Red", data: [0.8, 0.85, 0.9, 0.8, 0.95] }
      ],
      xaxis: {
        categories: ["09:00", "10:00", "11:00", "12:00", "13:00"]
      },
      colors: ["#6aa84f", "#cc0000"]
    });

    /* ---------- PIE CHART ---------- */
    const pieChart = new ApexCharts(pieChartRef.current, {
      chart: {
        type: "pie",
        height: 260
      },
      series: [56, 28, 6, 10],
      labels: ["Satake", "Miltech", "Compressor", "Boiler"],
      colors: ["#6aa84f", "#cc0000", "#3d85c6", "#f1c232"]
    });

    lineChart.render();
    barChart.render();
    pieChart.render();

    return () => {
      lineChart.destroy();
      barChart.destroy();
      pieChart.destroy();
    };
  }, []);

  return (
    <div className={`emd-root ${theme}`}>
      
      {/* ===== TOP BAR ===== */}
      <div className="emd-topbar">
        <div className="emd-breadcrumb">
          General / Energy Monitoring Dashboard
        </div>

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

      {/* ===== GRID ===== */}
      <div className="emd-grid">

        <div className="emd-card large">
          <h3>Power Consumption (WBSEDCL Line vs Generator)</h3>
          <div ref={lineChartRef}></div>
        </div>

        <div className="emd-card stat">
          <p>Last 24 Hrs Energy Consumption</p>
          <h2>28.6 <span>MWh</span></h2>
        </div>

        <div className="emd-card stat">
          <p>Energy from Generator</p>
          <h2 className="red">444 <span>kWh</span></h2>
        </div>

        <div className="emd-card stat">
          <p>Last 24 Hrs Energy Cost</p>
          <h2 className="green">₹200K</h2>
        </div>

        <div className="emd-card">
          <h3>Hourly Segment Wise Energy Consumption</h3>
          <div ref={barChartRef}></div>
        </div>

        <div className="emd-card">
          <h3>Segment Wise Energy Consumption</h3>
          <div ref={pieChartRef}></div>
        </div>

      </div>
    </div>
  );
}
