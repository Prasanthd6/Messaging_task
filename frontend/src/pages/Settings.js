import React, { useState } from 'react';
import './Settings.css';
import { FiBell, FiUser } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [timeFormat, setTimeFormat] = useState('24');

  const [notif, setNotif] = useState({
    message: true,
    taskUpdate: false,
    taskDeadline: true,
    mentorHelp: false
  });

  const handleSave = (e) => {
    e.preventDefault();
    // Here you would call an API to persist settings
    // For now, just log
    // eslint-disable-next-line no-console
    console.log({ language, timezone, timeFormat, notif });
    alert('Settings saved');
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="main-layout">
      <div className="mobile-topbar" style={{ display: window.innerWidth <= 768 ? 'flex' : 'none' }}>
        <button className="hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
        <div style={{ fontWeight: 600 }}>Settings</div>
        <div style={{width:36}} />
      </div>
      {/* Always open sidebar on desktop */}
      <Sidebar user={user} onLogout={logout} open={window.innerWidth > 768 || isSidebarOpen} />
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="page-title desktop-only">Settings</h1>
          <div className="header-actions">
            <button className="notification-btn">
              <FiBell />
              <span className="notification-dot"></span>
            </button>
            <div className="profile-picture" style={{ position: 'relative' }}>
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="profile-image"
                  onClick={() => setMenuOpen(prev => !prev)}
                />
              ) : (
                <div className="profile-placeholder" onClick={() => setMenuOpen(prev => !prev)}>
                  <FiUser />
                </div>
              )}
              {menuOpen && (
                <div style={{ position:'absolute', right:0, top:'calc(100% + 8px)', background:'#fff', border:'1px solid #e5e7eb', borderRadius:8, boxShadow:'0 6px 20px rgba(0,0,0,0.1)', zIndex:10 }}>
                  <button style={{ padding:'10px 14px', background:'transparent', border:'none', width:'100%', textAlign:'left', cursor:'pointer' }} onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-tabs">
            <button
              className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button
              className={`settings-tab ${activeTab === 'notification' ? 'active' : ''}`}
              onClick={() => setActiveTab('notification')}
            >
              Notification
            </button>
          </div>

          {activeTab === 'general' && (
            <form className="settings-form" onSubmit={handleSave}>
              <div className="form-row">
                <label>Language</label>
                <div className="select-wrapper">
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="en">English (Default)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <label>Timezone</label>
                <div className="select-wrapper">
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                    <option value="UTC">UTC (Default)</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <label>Timezone</label>
                <div className="time-format-group">
                  <label className={`chip ${timeFormat === '24' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="timeformat"
                      value="24"
                      checked={timeFormat === '24'}
                      onChange={() => setTimeFormat('24')}
                    />
                    24 Hours
                  </label>
                  <label className={`chip ${timeFormat === '12' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="timeformat"
                      value="12"
                      checked={timeFormat === '12'}
                      onChange={() => setTimeFormat('12')}
                    />
                    12 Hours
                  </label>
                </div>
              </div>

              <div className="actions">
                <button className="primary-btn" type="submit">Save Changes</button>
              </div>
            </form>
          )}

          {activeTab === 'notification' && (
            <form className="settings-form" onSubmit={handleSave}>
              <div className="toggle-row">
                <label>Message</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notif.message}
                    onChange={(e) => setNotif({ ...notif, message: e.target.checked })}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="toggle-row">
                <label>Task Update</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notif.taskUpdate}
                    onChange={(e) => setNotif({ ...notif, taskUpdate: e.target.checked })}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="toggle-row">
                <label>Task Deadline</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notif.taskDeadline}
                    onChange={(e) => setNotif({ ...notif, taskDeadline: e.target.checked })}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="toggle-row">
                <label>Mentor Help</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notif.mentorHelp}
                    onChange={(e) => setNotif({ ...notif, mentorHelp: e.target.checked })}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="actions">
                <button className="primary-btn" type="submit">Save Changes</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;



