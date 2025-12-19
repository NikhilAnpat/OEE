import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import "./EnergyMonitoringDashboard.css";
import energyData from "../../services/Data.json";

export default function EnergyMonitoringDashboard() {
  const [theme, setTheme] = useState("light");
  const [selectedRange, setSelectedRange] = useState("Last 24 hours"); // Track selected range

  const [energyMetrics, setEnergyMetrics] = useState({
    totalConsumption: 0,
    totalCost: 0,
    maxDemand: 0
  });

  // State for chart series
  const [chartData, setChartData] = useState([]);
  const [hasRecords, setHasRecords] = useState(true);

  const lineRef = useRef(null);
  const barRef = useRef(null);
  const pieRef = useRef(null);

  // Calculate 24-Hour KPI Metrics (Fixed)
  useEffect(() => {
    const now = new Date();
    // Fixed Window: Last 24 Hours
    const kpiStartTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const kpiData = energyData.filter(item => {
      if (!item.ts) return false;
      const localTsString = item.ts.replace("Z", "");
      const ts = new Date(localTsString);
      return ts >= kpiStartTime && ts <= now;
    });

    if (kpiData.length === 0) {
      setEnergyMetrics({ totalConsumption: 0, totalCost: 0, maxDemand: 0 });
      setHasRecords(false); // Indicates no data for the MAIN KPI 24h view 
    } else {
      setHasRecords(true);

      let totalKWh = 0;
      const kwValues = [];
      const INTERVAL_HOURS = 1 / 60;

      kpiData.forEach(entry => {
        const kw = typeof entry["Meter:KW"] === 'number' ? entry["Meter:KW"] : 0;
        kwValues.push(kw);
        totalKWh += kw * INTERVAL_HOURS;
      });

      const maxKW = Math.max(...kwValues);
      const COST_PER_KWH = 7;

      setEnergyMetrics({
        totalConsumption: totalKWh,
        totalCost: totalKWh * COST_PER_KWH,
        maxDemand: maxKW / 1000
      });
    }
  }, []); // Runs once on mount


  // Calculate Graph Data (Dynamic based on Filter)
  useEffect(() => {
    const now = new Date();
    let startTime;

    if (selectedRange === "Last 6 hours") {
      startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    } else if (selectedRange === "Last 7 days") {
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const filteredData = energyData.filter(item => {
      if (!item.ts) return false;
      const localTsString = item.ts.replace("Z", "");
      const ts = new Date(localTsString);
      return ts >= startTime && ts <= now;
    });

    // Sort for graph
    filteredData.sort((a, b) => new Date(a.ts.replace("Z", "")) - new Date(b.ts.replace("Z", "")));

    console.log(selectedRange, filteredData.length);
    console.log('Window:', startTime.toLocaleString(), '-', now.toLocaleString());

    if (filteredData.length === 0) {
      console.log(selectedRange, "No records found in window:", startTime.toLocaleString(), "to", now.toLocaleString());
      setChartData([]);
      return;
    }

    // Prepare chart series
    const chartSeriesData = filteredData.map(entry => {
      const kw = typeof entry["Meter:KW"] === 'number' ? entry["Meter:KW"] : 0;
      const ts = new Date(entry.ts.replace("Z", "")).getTime();
      return [ts, kw];
    });

    setChartData(chartSeriesData);

  }, [selectedRange]); // Runs whenever filter changes


  useEffect(() => {
    const isDark = theme === "dark";
    const commonLabelColor = isDark ? "#e5e7eb" : "#374151";
    const gridColor = isDark ? "rgba(255,255,255,0.15)" : "#e5e7eb";

    // Format date on x-axis based on range
    let xFormat = "HH:mm";
    if (selectedRange === "Last 7 days") {
      xFormat = "dd MMM";
    }

    // LINE CHART - Recreated with real data
    // Destroy previous instance if it exists (react-apexcharts handles this usually, 
    // but here we are using raw ApexCharts so we might need to be careful. 
    // However, the existing code cleans up in the return function)
    if (lineRef.current) {
      lineRef.current.innerHTML = ""; // simplistic clear for vanilla JS usage context inside React
    }

    const line = new ApexCharts(lineRef.current, {
      chart: {
        type: "line",
        height: "100%",
        toolbar: { show: false },
        foreColor: commonLabelColor,
        zoom: { enabled: false }
      },
      theme: { mode: isDark ? "dark" : "light" },
      tooltip: {
        theme: isDark ? "dark" : "light",
        x: { format: xFormat }
      },
      series: [
        { name: "WBSEDCL Line", data: chartData },
        // Showing real data now. 
        // Note: Generator data is not in JSON, keeping empty or removing 
        { name: "Generator", data: [] }
      ],
      xaxis: {
        type: 'datetime',
        labels: {
          style: { colors: commonLabelColor },
          datetimeUTC: false
        },
        tooltip: { enabled: false }
      },
      yaxis: {
        labels: { style: { colors: commonLabelColor } },
        title: { text: "KW", style: { color: commonLabelColor } }
      },
      grid: { borderColor: gridColor },
      stroke: { width: 2, curve: 'smooth' },
      colors: ["#6aa84f", "#f1c232"],
      dataLabels: { enabled: false }
    });

    // ... Bar and Pie charts remain static for now as requested focus was "the graph" (Line)
    // Re-rendering them to keep layout consistent
    if (barRef.current) barRef.current.innerHTML = "";
    const bar = new ApexCharts(barRef.current, {
      chart: {
        type: "bar",
        stacked: true,
        height: 260,
        toolbar: { show: false },
        foreColor: commonLabelColor
      },
      theme: { mode: isDark ? "dark" : "light" },
      series: [
        { name: "Grid", data: [1.4, 1.35, 1.38, 1.3, 1.42] },
        { name: "Generator", data: [0.8, 0.85, 0.9, 0.8, 0.95] }
      ],
      xaxis: { categories: ["09:00", "10:00", "11:00", "12:00", "13:00"] },
      grid: { borderColor: gridColor },
      colors: ["#6aa84f", "#cc0000"]
    });

    if (pieRef.current) pieRef.current.innerHTML = "";
    const pie = new ApexCharts(pieRef.current, {
      chart: { type: "pie", height: 260, foreColor: commonLabelColor },
      theme: { mode: isDark ? "dark" : "light" },
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
  }, [theme, chartData, selectedRange]); // Re-render chart when data/range changes

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
          <select
            className="emd-select"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
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
