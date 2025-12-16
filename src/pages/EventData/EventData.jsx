import '../EventData/EventData.css';
import { useState } from 'react';
function EventData() 
{
  const [theme, setTheme] = useState("light");
  return (<>

  <div
      className="alert-setup-container"
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

      <div className="eemd-toggle">
        <span className="sun-symbol">☀</span>
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
    <h1 className="event-data-h1">
      Event Data
    </h1>

    <div className="filter-bar">
  <div className="filter-group">
    <label>Meter</label>
    <select>
      <option>All Meters</option>
      <option>101</option>
      <option>102</option>
      <option>103</option>
    </select>
  </div>

  <div className="filter-group">
    <label>Start Date</label>
    <input type="datetime-local" />
  </div>

  <div className="filter-group">
    <label>End Date</label>
    <input type="datetime-local" />
  </div>

  <button className="filter-btn">Filter Events</button>
</div>


<div className="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>EventID</th>
        <th>MeterID</th>
        <th>Timestamp</th>
        <th>AvgCurrent</th>
        <th>AvgVoltage</th>
        <th>AvgPowerFactor</th>
        <th>Total_KW</th>
        <th>Total_KWH</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>6607</td>
        <td>101</td>
        <td>2025-09-09 20:08:00</td>
        <td>25.47</td>
        <td>230.10</td>
        <td>0.98</td>
        <td>17.50</td>
        <td>1024.75</td>
      </tr>
      <tr>
        <td>6592</td>
        <td>102</td>
        <td>2025-09-09 14:29:51</td>
        <td>28.18</td>
        <td>229.62</td>
        <td>0.98</td>
        <td>5.43</td>
        <td>304.11</td>
      </tr>
    </tbody>
  </table>
</div>
</div>
</>
  );
}

export default EventData;

