import React, { useState } from 'react';
import './UserDetailsPanel.css';

const UserDetailsPanel = ({ onBack, user }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [isUserActive, setIsUserActive] = useState(user?.active ?? true);

  if (!user) return null;

  const stats = [
    { label: 'Daily Target', value: '20,000 Rs' },
    { label: 'Achieved Target', value: '10,000 Rs' },
    { label: 'Total Orders Completed', value: '10' },
    { label: 'Total Revenue', value: '10,000 Rs' },
    { label: 'Total Balance', value: '1200 Rs' },
  ];

  const personalDetails = [
    { label: 'Full Name', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Phone', value: user.phone },
    { label: 'CNIC', value: user.cnic },
    { label: 'Role', value: user.role || 'User' },
  ];

  const data = activeTab === 'stats' ? stats : personalDetails;

  const handleToggleUser = () => {
    setIsUserActive(!isUserActive);
  };

  return (
    <div className="ud-wrapper">
      {/* Back button */}
      <div className="ud-back" onClick={onBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Cover / Banner */}
      <div className="ud-cover">
        <div className="ud-cover-pattern">
          {[...Array(20)].map((_, i) => (
            <CoverIcon key={i} index={i} />
          ))}
        </div>
        {/* Avatar overlapping cover */}
        <div className="ud-avatar-wrap">
          <img
            src={user.avatarUrl || user.avatar || 'https://randomuser.me/api/portraits/men/10.jpg'}
            alt={user.name}
            className="ud-avatar"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="ud-profile">
        <div className="ud-profile-top">
          <div>
            <h2 className="ud-name">{user.name}</h2>
            <p className="ud-role">{user.role || 'User'}</p>
            <p className="ud-email">{user.email}</p>
          </div>
          <button className="ud-edit-btn" aria-label="Edit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#e07b54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#e07b54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="ud-tabs">
          <button
            className={`ud-tab ${activeTab === 'stats' ? 'ud-tab--active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </button>
          <button
            className={`ud-tab ${activeTab === 'personal' ? 'ud-tab--active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Details
          </button>
        </div>
      </div>

      {/* Stats / Personal Details List */}
      <div className="ud-list">
        {data.map((item, i) => (
          <div className="ud-list-item" key={i}>
            <p className="ud-list-label">{item.label}</p>
            <p className="ud-list-value">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Disable User Button */}
      <div className="ud-footer">
        <button className="ud-disable-btn" onClick={handleToggleUser}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <polyline points="3 6 5 6 21 6" stroke="#e07b54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="#e07b54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 11v6M14 11v6" stroke="#e07b54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {isUserActive ? 'Disable User' : 'Enable User'}
        </button>
      </div>
    </div>
  );
};

/* Small decorative icons for the cover pattern */
function CoverIcon({ index }) {
  const icons = [
    // shopping bag
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="3" y1="6" x2="21" y2="6" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 10a4 4 0 01-8 0" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    // tag
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="7" y1="7" x2="7.01" y2="7" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
    </svg>,
    // search
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="#ccc" strokeWidth="1.5" />
      <path d="M21 21l-4.35-4.35" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
  ];
  return <span className="ud-cover-icon">{icons[index % icons.length]}</span>;
}

export default UserDetailsPanel;
