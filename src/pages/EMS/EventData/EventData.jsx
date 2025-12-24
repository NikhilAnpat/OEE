import './EventData.css';
import { useEffect, useState } from 'react';
import ClearFilter from '../../../assets/remove.png';
import { eventRecordsApi } from '../../../services/oeeBeApi';

function EventData() {
  const [theme, setTheme] = useState("light");

  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  
  const formatDateTime = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const defaultEndDate = formatDateTime(now);
  const defaultStartDate = formatDateTime(thirtyDaysAgo);

  const [selectedMeter, setSelectedMeter] = useState("All Meters");
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const [appliedFilters, setAppliedFilters] = useState({
    meterId: null,
    start: defaultStartDate,
    end: defaultEndDate,
  });

  const alertsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const formatOccurredAt = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toISOString().replace('T', ' ').slice(0, 19);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const result = await eventRecordsApi.list({
          meterId: appliedFilters.meterId,
          start: appliedFilters.start,
          end: appliedFilters.end,
          page: currentPage,
          limit: alertsPerPage,
        });

        if (!mounted) return;
        const items = result?.items || [];
        setTotalRecords(result?.total || 0);
        setRecords(
          items.map((r) => ({
            id: r.eventId,
            meter: r.meterId,
            time: formatOccurredAt(r.occurredAt),
            cur: r.avgCurrent,
            volt: r.avgVoltage,
            pf: r.avgPowerFactor,
            kw: r.totalKW,
            kwh: r.totalKWH,
          }))
        );
      } catch (err) {
        if (!mounted) return;
        setErrorMessage(err?.message || 'Failed to load event records');
        setRecords([]);
        setTotalRecords(0);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [appliedFilters, currentPage]);

  const handleFilter = () => {
    setCurrentPage(1);
    setAppliedFilters({
      meterId: selectedMeter === 'All Meters' ? null : selectedMeter,
      start: startDate || null,
      end: endDate || null,
    });
  };

  const handleClearFilter = () => {
    setSelectedMeter("All Meters");
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setAppliedFilters({ meterId: null, start: defaultStartDate, end: defaultEndDate });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalRecords / alertsPerPage) || 1;
  const currentAlerts = records;

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
            colorScheme: "dark",
          }
          : {
            colorScheme: "light",
          }
      }
    >

      <div className="eemd-toggle">
        <span className="symbol">☀</span>
        <label className="switch">
          <input
            type="checkbox"
            onChange={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
          />
          <span className="slider"></span>
        </label>
        <span className='symbol'>🌙</span>
      </div>
      <h1 className="event-data-h1">
        Event Data
      </h1>

      {errorMessage && (
        <p style={{ textAlign: 'center', color: 'crimson' }}>{errorMessage}</p>
      )}

      <div className="filter-bar">
        <div className="filter-group">
          <label>Meter</label>
          <select
            value={selectedMeter}
            onChange={(e) => setSelectedMeter(e.target.value)}
          >
            <option>All Meters</option>
            <option>101</option>
            <option>102</option>
            <option>103</option>
            <option>104</option>
            <option>105</option>
            <option>106</option>
            <option>107</option>
            <option>108</option>
            <option>109</option>
            <option>110</option>
            <option>111</option>
            <option>112</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Start Date</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>End Date</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <img
          src={ClearFilter}
          alt="Clear Filter"
          onClick={handleClearFilter}
          style={{
            width: "20px",
            height: "20px",
            cursor: "pointer",
            marginBottom: "5px",
            filter: theme === "dark" ? "brightness(0) invert(1)" : "none"
          }}
        />
        <button className="filter-btn" onClick={handleFilter}>

          Filter Events
        </button>
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
            {currentAlerts.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.meter}</td>
                <td>{row.time}</td>
                <td>{row.cur}</td>
                <td>{row.volt}</td>
                <td>{row.pf}</td>
                <td>{row.kw}</td>
                <td>{row.kwh}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && (
        <p style={{ textAlign: 'center', opacity: 0.6 }}>Loading...</p>
      )}
      {totalRecords > alertsPerPage && (
        <div className="pagination">
          <button
            className="page-btn prev"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${currentPage === i + 1 ? "active" : ""
                }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="page-btn next"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

    </div>
  </>
  );
}

export default EventData;

