import React from 'react'

const Power_Quality_Header = ({ theme, toggleTheme }) => {
    return (
        <div className="emd-topbar">
            <div className="emd-breadcrumb">Energy management / Power Quality Monitoring</div>
            <div className="emd-actions">
                <select className="emd-select">
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
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                        />
                        <span className="slider"></span>
                    </label>
                    <span>🌙</span>
                </div>
            </div>
        </div>
    )
}

export default Power_Quality_Header