import React from "react";
import Chart from "react-apexcharts";

const KiloWatt = ({ theme, data = [], kwhData = [], stats = { last: 0, min: 0, max: 0 } }) => {

    const series = [
        {
            name: "KW",
            data: data.length > 0 ? data : [],
        },
        {
            name: "KWH",
            data: kwhData.length > 0 ? kwhData : [],
        },
    ];

    const commonColor = theme === 'dark' ? '#f9fafb' : '#333';
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e0e0e0';

    const options = {
        chart: {
            type: "line",
            height: 350,
            fontFamily: "Arial, sans-serif",
            zoom: { enabled: false },
            toolbar: { show: false },
            background: 'transparent',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        stroke: {
            curve: "smooth",
            width: [3, 3],
        },
        colors: ["#4daf50", "#e91e63"], // Green for KW, Pink/Red for KWH
        fill: {
            type: 'solid',
            opacity: 1
        },
        dataLabels: { enabled: false },
        xaxis: {
            type: "datetime",
            // min and max removed to allow auto-scaling based on data
            tickAmount: 6,
            labels: {
                datetimeUTC: false,
                format: "HH:mm",
                style: { colors: commonColor }
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false }
        },
        yaxis: [
            {
                min: 30,
                max: 10,
                tickAmount: 7,
                labels: {
                    formatter: (val) => `${val.toFixed(0)} kW`,
                    style: { colors: commonColor },
                    align: 'left'
                },
                title: {
                    text: "KW",
                    style: { color: "#4daf50", fontWeight: 600 }
                },
            },
            {
                opposite: true,
                labels: {
                    formatter: (val) => `${val.toFixed(0)} kWh`,
                    style: { colors: commonColor },
                    align: 'right'
                },
                title: {
                    text: "KWH",
                    style: { color: "#e91e63", fontWeight: 800 , fontSize: '1vh' }
                },
            }
        ],
        grid: {
            borderColor: gridColor,
            strokeDashArray: 0,
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } },
        },
        legend: { show: false },
        tooltip: {
            enabled: true,
            theme: theme === 'dark' ? 'dark' : 'light',
            x: { format: "HH:mm" },
            y: { formatter: (val) => `${val} kW` },
            marker: { show: true },
        },
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, minHeight: 0 }}>
                <Chart options={options} series={series} type="line" height="100%" />
            </div>

            {/* Footer Stats similar to screenshot */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: '1.1vh',
                padding: '0 0.4vh',
                fontFamily: 'sans-serif'
            }}>
                {/* Legend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2vh', marginBottom: '0.7vh' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9vh' }}>
                        <div style={{ width: '1.3vh', height: '0.3vh', background: '#4daf50', borderRadius: '1px' }}></div>
                        <span style={{ fontWeight: 600, fontSize: '1.4vh', color: commonColor }}>KW</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9vh' }}>
                        <div style={{ width: '1.3vh', height: '0.3vh', background: '#e91e63', borderRadius: '1px' }}></div>
                        <span style={{ fontWeight: 600, fontSize: '1.4vh', color: commonColor }}>KWH</span>
                    </div>
                </div>

                {/* Stats Table */}
                <div style={{ display: 'flex', gap: '3.6vh', textAlign: 'right' }}>
                    {/* Last */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ color: '#1a73e8', fontSize: '1.3vh', fontWeight: 600, marginBottom: '0.2vh' }}>Last *</span>
                        <span style={{ color: commonColor, fontWeight: 'bold', fontSize: '1.6vh' }}>{(stats?.last ?? 0).toFixed(1)} kW</span>
                    </div>

                    {/* Min */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ color: '#1a73e8', fontSize: '1.3vh', fontWeight: 600, marginBottom: '0.2vh' }}>Min</span>
                        <span style={{ color: commonColor, fontWeight: 'bold', fontSize: '1.6vh' }}>{(stats?.min ?? 0).toFixed(1)} kW</span>
                    </div>

                    {/* Max */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ color: '#1a73e8', fontSize: '1.3vh', fontWeight: 600, marginBottom: '0.2vh' }}>Max</span>
                        <span style={{ color: commonColor, fontWeight: 'bold', fontSize: '1.6vh' }}>{(stats?.max ?? 0).toFixed(1)} kW</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KiloWatt;
