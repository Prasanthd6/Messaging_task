import React from 'react';
import { FiGrid, FiBookOpen, FiUsers, FiMessageCircle, FiSettings, FiBarChart2, FiHelpCircle } from 'react-icons/fi';

const Sidebar = ({ user, onLogout }) => {
  const navItems = [
    { icon: FiGrid, label: 'Overview', active: false },
    { icon: FiBookOpen, label: 'Task', active: false },
    { icon: FiUsers, label: 'Mentors', active: false },
    { icon: FiMessageCircle, label: 'Message', active: true },
    { icon: FiSettings, label: 'Settings', active: false }
  ];

  return (
    <div className="sidebar">
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
              className={`nav-item ${item.active ? 'active' : ''}`}
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
