import React from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Mentors = () => {
  const { user, logout } = useAuth();
  return (
    <div className="main-layout">
      <Sidebar user={user} onLogout={logout} />
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="page-title">Mentors</h1>
        </div>
        <div style={{ padding: '24px', color: '#666' }}>Mentors placeholder</div>
      </div>
    </div>
  );
};

export default Mentors;


