import React from "react";
import Chart from "react-apexcharts";

const HourlyEnergyConsumption = ({ theme }) => {
    const commonColor = theme === 'dark' ? '#f9fafb' : '#333';
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e0e0e0';

    const series = [
        {
            name: "Consumption",
            data: [71, 79, 70, 92, 81, 65]
        }
    ];

    const options = {
        chart: {
            type: "bar",
            height: 350,
            fontFamily: "Arial, sans-serif",
            toolbar: { show: false },
            background: 'transparent',
            animations: { enabled: false }
        },
        colors: ["#5cb85c"], // Green color
        plotOptions: {
            bar: {
                columnWidth: '45%',
                borderRadius: 2,
            },
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: ["08:30", "09:30", "10:30", "11:30", "12:30", "13:00"],
            labels: {
                style: { colors: commonColor }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            min: 0,
            max: 100,
            labels: {
                style: { colors: commonColor }
            },
        },
        grid: {
            borderColor: gridColor,
            strokeDashArray: 0,
            yaxis: { lines: { show: true } },
        },
        tooltip: {
            theme: theme === 'dark' ? 'dark' : 'light',
        }
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, minHeight: 0 }}>
                <Chart options={options} series={series} type="bar" height="100%" />
            </div>
            {/* Footer Legend */}
            {/* <div style={{ marginTop: '1.1vh', fontSize: '1.1vh', color: '#666', fontFamily: 'monospace' }}>
                <span style={{ color: '#5cb85c', fontWeight: 'bold' }}>- </span>
                _value (_field="kwh", _start="2022-05-25...")
            </div> */}
        </div>
    );
};

export default HourlyEnergyConsumption;
