import React from "react";
import Chart from "react-apexcharts";

const HourlyEnergyConsumption = ({ theme, data = [], labels = [] }) => {
  const commonColor = theme === "dark" ? "#f9fafb" : "#333";
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.1)" : "#e0e0e0";

  const series = [{ name: "Consumption", data }];

  const options = {
    chart: {
      type: "bar",
      height: 350,
      fontFamily: "inherit",
      toolbar: { show: false },
      background: "transparent",
      zoom: { enabled: false },
      parentHeightOffset: 0
    },
    colors: ["#5cb85c"],
    plotOptions: {
      bar: {
        columnWidth: "45%",
        borderRadius: 3
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: labels,
      labels: {
        rotate: -45,
        style: { colors: commonColor }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: (val) => `${val.toFixed(1)} kWh`,
        style: { colors: commonColor }
      },
      title: {
        text: "Consumption (kWh)",
        style: { color: commonColor, fontWeight: 600 }
      }
    },
    grid: {
      borderColor: gridColor,
      yaxis: { lines: { show: true } }
    },
    tooltip: {
      theme: theme === "dark" ? "dark" : "light"
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: { bar: { columnWidth: "60%" } },
          xaxis: { labels: { style: { fontSize: "10px" } } },
          yaxis: { labels: { style: { fontSize: "10px" } } }
        }
      }
    ]
  };

  return (
    <div
      style={{
        width: "80%",
        overflowX: "auto",
        overflowY: "hidden",
        paddingBottom: 3,
        scrollbarWidth: "thin",
        scrollbarColor: "#e5ebe5ff transparent"
      }}
    >
      
      <style>
        {`
          div::-webkit-scrollbar {
            height: 6px;
          }
          div::-webkit-scrollbar-thumb {
            background-color: #5cb85c;
            border-radius: 10px;
          }
          div::-webkit-scrollbar-track {
            background: transparent;
          }
        `}
      </style>

      <div
        style={{
          minWidth: labels.length * 60,
          height: 350
        }}
      >
        <Chart options={options} series={series} type="bar" height={350} />
      </div>
    </div>
  );
};

export default HourlyEnergyConsumption;
