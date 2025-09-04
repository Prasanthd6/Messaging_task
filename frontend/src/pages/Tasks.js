import React from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user, logout } = useAuth();
  return (
    <div className="main-layout">
      <Sidebar user={user} onLogout={logout} />
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="page-title">Task</h1>
        </div>
        <div style={{ padding: '24px', color: '#666' }}>Tasks placeholder</div>
      </div>
    </div>
  );
};

export default Tasks;


