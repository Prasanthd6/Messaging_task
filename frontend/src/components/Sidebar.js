import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiBookOpen, FiUsers, FiMessageCircle, FiSettings, FiBarChart2, FiHelpCircle } from 'react-icons/fi';

const Sidebar = ({ user, onLogout, open = true, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { icon: FiGrid, label: 'Overview', path: '/overview' },
    { icon: FiBookOpen, label: 'Task', path: '/tasks' },
    { icon: FiUsers, label: 'Mentors', path: '/mentors' },
    { icon: FiMessageCircle, label: 'Message', path: '/dashboard' },
    { icon: FiSettings, label: 'Settings', path: '/settings' }
  ];

  return (
    <div className={`sidebar ${open ? 'open' : 'closed-mobile'}`}>
      <div className="sidebar-header">
        <div className="logo">
                  <div className="logo-icon">
          <FiBarChart2 />
        </div>
          <span>DNX</span>
        </div>
      </div>

      <nav className="nav-menu">
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={index}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <IconComponent className="nav-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="help-center">
        <div className="help-icon">
          <FiHelpCircle />
        </div>
        <div className="help-title">Help Center</div>
        <div className="help-description">
          Having Trouble in Learning. Please contact us for more questions.
        </div>
        <button className="help-button">Go To Help Center</button>
      </div>
    </div>
  );
};

export default Sidebar;
