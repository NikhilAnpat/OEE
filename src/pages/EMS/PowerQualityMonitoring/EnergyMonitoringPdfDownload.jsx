import React from "react";
import Chart from "react-apexcharts";

const EnergyMonitoringPdfDownload = ({
    isPrinting,
    theme,
    energyMetrics,
    lineSeries,
    barData
}) => {
    if (!isPrinting) return null;

    const commonColor = theme === "dark" ? "#e5e7eb" : "#374151";
    const bgColor = theme === "dark" ? "#020617" : "#f9fafb";
    const cardBg = theme === "dark" ? "#1e293b" : "#ffffff";
    const borderColor = theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb";

    const generateVoltageData = (baseVoltage, noise) => {
        const data = [];
        let currentTime = new Date("2023-01-01 07:30").getTime();
        const endTime = new Date("2023-01-01 13:00").getTime();
        while (currentTime <= endTime) {
            const angle = (currentTime / 1000000);
            let value = baseVoltage + Math.sin(angle) * 3 + (Math.random() - 0.5) * noise;
            data.push([currentTime, parseFloat(value.toFixed(1))]);
            currentTime += 15 * 60 * 1000;
        }
        return data;
    };

    const generateCurrentData = (offset) => {
        const data = [];
        const baseDate = "2023-01-01";
        const timestamps = ["07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00"];
        timestamps.forEach((t) => {
            let val = 140 + Math.random() * 5 + offset;
            const timeVal = new Date(`${baseDate} ${t}`).getTime();
            data.push([timeVal, parseFloat(val.toFixed(1))]);
        });
        return data;
    };

    const voltageSeries = [
        { name: "Phase 1", data: generateVoltageData(238, 2) },
        { name: "Phase 2", data: generateVoltageData(233, 2) },
        { name: "Phase 3", data: generateVoltageData(230, 2) },
    ];

    const currentSeries = [
        { name: "Phase 1", data: generateCurrentData(0) },
        { name: "Phase 2", data: generateCurrentData(-2) },
        { name: "Phase 3", data: generateCurrentData(-5) }
    ];

    return (
        <div className="emd-print-wrapper" id="pdf-report-content" style={{
            position: 'fixed',
            left: '-5000px',
            top: 0,
            width: '1400px',
            background: bgColor,
            padding: '40px',
            zIndex: -9999,
            fontFamily: "'Inter', sans-serif"
        }}>
            <style>{`
                .emd-print-wrapper .emd-card {
                    background: ${cardBg};
                    border: 1px solid ${borderColor};
                    border-radius: 12px;
                    padding: 24px;
                    height: 100%;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                }
                .emd-print-wrapper h3 {
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: ${commonColor};
                }
                .emd-kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 15px;
                    margin-bottom: 30px;
                }
                .emd-card.kpi {
                    text-align: center;
                    padding: 15px 10px;
                }
                .emd-card.kpi p {
                    font-size: 12px;
                    color: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
                    margin: 0 0 5px 0;
                    font-weight: 500;
                }
                .emd-card.kpi h2 {
                    font-size: 20px;
                    margin: 0;
                    color: ${commonColor};
                    font-weight: 700;
                }
                .emd-middle-row, .emd-bottom-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                    margin-bottom: 24px;
                }
                .emd-top-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid ${borderColor};
                    padding-bottom: 15px;
                }
                .emd-top-header h1 {
                    font-size: 24px;
                    margin: 0;
                    color: ${commonColor};
                }
            `}</style>

            <div className="emd-top-header">
                <h1>Power Quality Monitoring Report</h1>
                <div style={{ textAlign: 'right', fontSize: '13px', color: '#64748b' }}>
                    Generated: {new Date().toLocaleString()}
                </div>
            </div>

            <div className="emd-top-row">
                <div className="emd-kpi-grid">
                    <div className="emd-card kpi"><p>Total Energy</p><h2>{energyMetrics.totalConsumption.toFixed(1)} kWh</h2></div>
                    <div className="emd-card kpi"><p>Last KW</p><h2>{energyMetrics.lastKW?.toFixed(1) || 0} kW</h2></div>
                    <div className="emd-card kpi"><p>Min KW</p><h2>{energyMetrics.minKW?.toFixed(1) || 0} kW</h2></div>
                    <div className="emd-card kpi"><p>Max KW</p><h2>{energyMetrics.maxKW?.toFixed(1) || 0} kW</h2></div>
                    <div className="emd-card kpi"><p>Max Consumption</p><h2>{energyMetrics.maxConsumption?.toFixed(1) || 0} kWh</h2></div>
                    <div className="emd-card kpi"><p>Report Period</p><h2>Last 24h</h2></div>
                </div>
            </div>

            <div className="emd-middle-row">
                <div className="emd-card">
                    <h3>KW & KWH Trends</h3>
                    <div style={{ height: '400px' }}>
                        <Chart
                            type="line"
                            height="100%"
                            series={lineSeries}
                            options={{
                                chart: { toolbar: { show: false }, animations: { enabled: false }, foreColor: commonColor },
                                stroke: { curve: 'smooth', width: 3 },
                                colors: ["#4daf50", "#e91e63"],
                                xaxis: { type: 'datetime', labels: { datetimeUTC: false } },
                                yaxis: [
                                    { title: { text: "kW" }, labels: { style: { colors: commonColor } } },
                                    { opposite: true, title: { text: "kWh" }, labels: { style: { colors: commonColor } } }
                                ],
                                grid: { borderColor: borderColor }
                            }}
                        />
                    </div>
                </div>
                <div className="emd-card">
                    <h3>Voltage Imbalance</h3>
                    <div style={{ height: '400px' }}>
                        <Chart
                            type="line"
                            height="100%"
                            series={voltageSeries}
                            options={{
                                chart: { toolbar: { show: false }, animations: { enabled: false }, foreColor: commonColor },
                                stroke: { curve: 'smooth', width: 2 },
                                colors: ["#7e8ce0", "#e0c87e", "#7eb3a8"],
                                xaxis: { type: 'datetime', labels: { datetimeUTC: false } },
                                yaxis: { min: 220, max: 250, labels: { style: { colors: commonColor } } },
                                grid: { borderColor: borderColor }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="emd-bottom-row">
                <div className="emd-card">
                    <h3>Energy Consumption</h3>
                    <div style={{ height: '400px' }}>
                        <Chart
                            type="bar"
                            height="100%"
                            series={barData.series}
                            options={{
                                chart: { toolbar: { show: false }, animations: { enabled: false }, foreColor: commonColor },
                                plotOptions: { bar: { columnWidth: '60%', borderRadius: 4 } },
                                colors: ["#5cb85c"],
                                xaxis: { categories: barData.labels },
                                yaxis: { title: { text: "kWh" }, labels: { style: { colors: commonColor } } },
                                grid: { borderColor: borderColor }
                            }}
                        />
                    </div>
                </div>
                <div className="emd-card">
                    <h3>Phase Wise Current</h3>
                    <div style={{ height: '400px' }}>
                        <Chart
                            type="line"
                            height="100%"
                            series={currentSeries}
                            options={{
                                chart: { toolbar: { show: false }, animations: { enabled: false }, foreColor: commonColor },
                                stroke: { curve: 'smooth', width: 2 },
                                colors: ["#e91e63", "#ff9800", "#2196f3"],
                                xaxis: { type: 'datetime', labels: { datetimeUTC: false } },
                                yaxis: { min: 0, max: 200, labels: { style: { colors: commonColor } } },
                                grid: { borderColor: borderColor }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnergyMonitoringPdfDownload;
