import React, { useState } from "react";
import Power_Quality_Header from "./Power_Quality_Header";
import KiloWatt from "./KiloWatt";
import VoltageImbalance from "./VoltageImbalance";
import HourlyEnergyConsumption from "./HourlyEnergyConsumption";
import PhaseWiseCurrent from "./PhaseWiseCurrent";
import "../EnergyMonitoringDashboard/EnergyMonitoringDashboard.css";
import "./powerQualityMonitoring.css";

export default function PowerQualityMonitoring() {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

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
                        "--muted-text": "#94a3b8",
                    }
                    : {}
            }
        >
            <Power_Quality_Header theme={theme} toggleTheme={toggleTheme} />
            <div className="main-block" style={{ gap: '2.7vh' }}>
                <div className="first-block">

                    <div className="meter-row">
                        <button className="meter-btn">Select Meter</button>
                        <div className="meter-dropdown">
                            Compressor <span style={{ fontSize: '1.1vh', opacity: 0.7 }}>▼</span>
                        </div>
                    </div>

                    {/* Duplicate KWH card? Keeping as requested but styling with class */}
                    <div className="kwh-card">
                        <h2 className="kwh-title">KWH</h2>
                        <span className="kwh-value">457 kWh</span>
                    </div>

                    {/* KW CARD */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3 className="chart-title">
                                KW <span style={{ fontSize: '1.3vh', opacity: 0.7 }}>▼</span>
                            </h3>
                        </div>
                        <KiloWatt theme={theme} />
                    </div>

                    {/* VOLTAGE IMBALANCE CARD */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3 className="chart-title">
                                Voltage Imbalance
                            </h3>
                        </div>
                        <VoltageImbalance theme={theme} />
                    </div>
                </div>


                <div className="second-block">
                    {/* Spacer */}
                    <div className="spacer-block"></div>

                    {/* KWH CARD */}
                    <div className="kwh-card">
                        <h2 className="kwh-title">KWH</h2>
                        <span className="kwh-value">457 kWh</span>
                    </div>

                    {/* HOURLY ENERGY CARD */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3 className="chart-title">
                                Hourly Energy Consumption
                            </h3>
                        </div>
                        <HourlyEnergyConsumption theme={theme} />
                    </div>

                    {/* PHASE WISE CURRENT CARD */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3 className="chart-title">
                                Phase Wise Current
                            </h3>
                        </div>
                        <PhaseWiseCurrent theme={theme} />
                    </div>
                </div>



            </div>
            {/* Select Meter Row */}

        </section>
    );
}
