import React, { useState } from "react";
import Power_Quality_Header from "./Power_Quality_Header";
import rawData from "../../../services/Data.json";
import KiloWatt from "./KiloWatt";
import VoltageImbalance from "./VoltageImbalance";
import HourlyEnergyConsumption from "./HourlyEnergyConsumption";
import PhaseWiseCurrent from "./PhaseWiseCurrent";
import "../EnergyMonitoringDashboard/EnergyMonitoringDashboard.css";
import "./powerQualityMonitoring.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PowerQualityMonitoring() {
    const [theme, setTheme] = useState("light");
    const [selectedMeter, setSelectedMeter] = useState("meter1");
    const [timeRange, setTimeRange] = useState("6h");

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const downloadPDF = () => {
        const input = document.querySelector(".emd-root");

        if (!input) {
            console.error("❌ .emd-root not found");
            return;
        }

        html2canvas(input, {
            scale: 3, 
            useCORS: true,
            backgroundColor: "#ffffff",
            ignoreElements: (element) => {
                return element.classList.contains('pdf-exclude');
            }
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
            pdf.save("Power_Quality_Daily_Report.pdf");
        });
    };

    const getFilteredData = () => {
        const sortedData = [...rawData].sort(
            (a, b) => new Date(a.ts) - new Date(b.ts)
        );

        const lastTimestamp =
            sortedData.length > 0
                ? new Date(sortedData[sortedData.length - 1].ts).getTime()
                : Date.now();

        let rangeMs = 6 * 60 * 60 * 1000;
        if (timeRange === "24h") rangeMs = 24 * 60 * 60 * 1000;
        if (timeRange === "7d") rangeMs = 7 * 24 * 60 * 60 * 1000;

        const cutOffTime = lastTimestamp - rangeMs;

        const kwData = [];
        const kwhData = [];

        let minKW = Infinity;
        let maxKW = -Infinity;
        let lastKW = 0;
        let currentKWH = 0;

        sortedData.forEach((item) => {
            const time = new Date(item.ts).getTime();
            if (time < cutOffTime) return;

            let valKW = 0;
            if (selectedMeter === "meter1") {
                valKW = item["Meter:KW"] || item["Meter1:KW"] || 0;
            } else if (selectedMeter === "meter2") {
                valKW = item["meter2:KW"] || item["Meter2:KW"] || 0;
            } else {
                valKW = item["meter3:KW"] || item["Meter3:KW"] || 0;
            }

            minKW = Math.min(minKW, valKW);
            maxKW = Math.max(maxKW, valKW);
            lastKW = valKW;

            kwData.push([time, valKW]);

            let valKWH = 0;
            if (selectedMeter === "meter1") {
                valKWH = item["Meter:KWH"] || item["Meter1:KWH"] || 0;
            } else if (selectedMeter === "meter2") {
                valKWH = item["meter2:KWH"] || item["Meter2:KWH"] || 0;
            } else {
                valKWH = item["meter3:KWH"] || item["Meter3:KWH"] || 0;
            }

            currentKWH = valKWH;
            kwhData.push(valKWH);
        });

        if (minKW === Infinity) minKW = 0;
        if (maxKW === -Infinity) maxKW = 0;

        return {
            kwData,
            kwhData: kwhData.slice(-6),
            stats: {
                lastKW,
                minKW,
                maxKW,
                currentKWH
            }
        };
    };

    const { kwData, kwhData, stats } = getFilteredData();

    return (
        <section className="emd-root">
            <Power_Quality_Header
                toggleTheme={toggleTheme}
                selectedRange={timeRange}
                onRangeChange={setTimeRange}
                onDownloadReport={downloadPDF}
            />

            <div className="main-block" style={{ gap: "2.7vh" }}>
                <div className="first-block">
                    <div className="meter-row pdf-exclude">
                        <select
                            className="meter-dropdown"
                            value={selectedMeter}
                            onChange={(e) => setSelectedMeter(e.target.value)}
                        >
                            <option value="meter1">Meter 1</option>
                            <option value="meter2">Meter 2</option>
                            <option value="meter3">Meter 3</option>
                        </select>

                        <div className="meter-dropdown">
                            Compressor <span style={{ fontSize: "1.1vh", opacity: 0.7 }}>▼</span>
                        </div>
                    </div>

                    <div className="kwh-card">
                        <h2 className="kwh-title">KWH</h2>
                        <span className="kwh-value">{stats.currentKWH} kWh</span>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <h3 className="chart-title">
                                KW <span style={{ fontSize: "1.3vh", opacity: 0.7 }}>▼</span>
                            </h3>
                        </div>
                        <KiloWatt
                            theme={theme}
                            data={kwData}
                            stats={{
                                last: stats.lastKW,
                                min: stats.minKW,
                                max: stats.maxKW
                            }}
                        />
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <h3 className="chart-title">Voltage Imbalance</h3>
                        </div>
                        <VoltageImbalance theme={theme} />
                    </div>
                </div>

                <div className="second-block">
                    <div className="spacer-block"></div>

                    <div className="kwh-card">
                        <h2 className="kwh-title">KWH</h2>
                        <span className="kwh-value">{stats.currentKWH} kWh</span>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <h3 className="chart-title">Hourly Energy Consumption</h3>
                        </div>
                        <HourlyEnergyConsumption theme={theme} data={kwhData} />
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <h3 className="chart-title">Phase Wise Current</h3>
                        </div>
                        <PhaseWiseCurrent theme={theme} />
                    </div>
                </div>
            </div>
        </section>
    );
}
