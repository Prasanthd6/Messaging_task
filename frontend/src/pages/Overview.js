import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import './Overview.css';

const charts = [
  { id: 'sales', title: 'Sales Performance', type: 'line' },
  { id: 'visitors', title: 'Visitors', type: 'bar' },
  { id: 'conversion', title: 'Conversion Rate', type: 'area' },
  { id: 'sources', title: 'Traffic Sources', type: 'pie' }
];

const Overview = () => {
  const { user, logout } = useAuth();
  const [openChart, setOpenChart] = useState(null);

  return (
    <div className="main-layout">
      <Sidebar user={user} onLogout={logout} />
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="page-title">Overview</h1>
        </div>

        <div className="charts-grid">
          {charts.map((c) => (
            <div key={c.id} className="chart-card" onClick={() => setOpenChart(c)}>
              <div className="chart-title">{c.title}</div>
              <div className={`chart-placeholder ${c.type}`}></div>
            </div>
          ))}
        </div>

        {openChart && (
          <div className="chart-modal-overlay" onClick={() => setOpenChart(null)}>
            <div className="chart-modal" onClick={(e) => e.stopPropagation()}>
              <div className="chart-modal-header">
                <h3>{openChart.title}</h3>
                <button className="close-btn" onClick={() => setOpenChart(null)}>✕</button>
              </div>
              <div className="chart-modal-body">
                <div className={`chart-placeholder large ${openChart.type}`}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;


