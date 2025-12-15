import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LeftNav from './components/LeftNav';
import { useState, useEffect } from 'react';
import DigitalInput from './pages/DigitalInput';
import DigitalOutput from './pages/DigitalOutput';
import Page2 from './pages/Page2';
import AnalogOutput from './pages/AnalogOutput';
import MachineDashboard from './pages/MachineDashboard';
import OeeDashboard from './pages/OeeDashboard';
import Report from './pages/Report';
import EnergyConsumption from './pages/EnergyConsumption';
import EnergyMonitoringDashboard from './pages/EnergyMonitoringDashboard/EnergyMonitoringDashboard';
import Alerts from './pages/Alerts/Alerts';
import PowerQualityMonitoring from './pages/PowerQualityMonitoring/powerQualityMonitoring';
import EventData from './pages/EventData/EventData';
import AlertSetup from './pages/AlertSetup/AlertSetup';
import './App.css';

function App() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Default: open on desktop, closed on mobile
    const mq = window.matchMedia && window.matchMedia('(max-width: 768px)');
    const update = () => {
      const mobile = mq ? mq.matches : false;
      setIsMobile(mobile);
      setIsNavOpen(!mobile);
    };
    update();
    if (mq && mq.addEventListener) mq.addEventListener('change', update);
    else if (mq && mq.addListener) mq.addListener(update);
    return () => {
      if (mq && mq.removeEventListener) mq.removeEventListener('change', update);
      else if (mq && mq.removeListener) mq.removeListener(update);
    };
  }, []);

  useEffect(() => {
    if (isNavOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isNavOpen, isMobile]);

  return (
    <Router>
      <div className="app">
        <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
        <div className="app-body">
          <LeftNav isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} isMobile={isMobile} />
          {isNavOpen && isMobile && (
            <div className="nav-backdrop" onClick={() => setIsNavOpen(false)} />
          )}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/digital-input" replace />} />
              <Route path="/digital-input" element={<DigitalInput />} />
              <Route path="/digital-output" element={<DigitalOutput />} />
              <Route path="/analog-input" element={<Page2 />} />
              <Route path="/analog-output" element={<AnalogOutput />} />
              <Route path="/machine-dashboard" element={<MachineDashboard />} />
              <Route path="/oee-dashboard" element={<OeeDashboard />} />
              <Route path="/report" element={<Report />} />
              <Route path="/energy-consumption" element={<EnergyConsumption />} />
              <Route path="/energy-monitoring-dashboard" element={<EnergyMonitoringDashboard />} />
              <Route path="/power-quality-monitoring" element={<PowerQualityMonitoring />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/alert-setup" element={<AlertSetup />} />
              <Route path="/event-data" element={<EventData />} />  

            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
