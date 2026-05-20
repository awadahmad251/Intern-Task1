import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Search, ChevronDown } from 'react-feather';
import './LogsPage.css';
import { api } from '../api/client';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  const loadLogs = async () => {
    try {
      const data = await api.get('/api/logs');
      setLogs(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load logs.');
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="logs-page">
      <Sidebar />
      <div className="logs-main-content">
        <Header />

        <div className="logs-container">
          <div className="logs-topbar">
            <h1 className="logs-heading">Logs</h1>
            <div className="logs-toolbar">
              <div className="logs-search">
                <Search size={15} className="logs-search-icon" />
                <input type="text" placeholder="Search by User, ID..." className="logs-search-input" />
              </div>
              <button className="logs-filter-btn" type="button">City <ChevronDown size={15} /></button>
              <button className="logs-filter-btn" type="button">Role <ChevronDown size={15} /></button>
              <button className="logs-filter-btn" type="button">Date & Time <ChevronDown size={15} /></button>
            </div>
          </div>

          <div className="logs-table-shell">
            <div className="logs-table-head">
              <span>ID</span>
              <span>User</span>
              <span>Role</span>
              <span>Details</span>
              <span>Date & Time</span>
            </div>

            {error && <div className="logs-error">{error}</div>}

            <div className="logs-list">
              {logs.map((row) => (
                <div className="logs-row" key={row._id}>
                  <div className="logs-select-box" />
                  <div className="logs-cell logs-id">{row._id?.slice(-6)}</div>
                  <div className="logs-cell">{row.actor?.name || 'System'}</div>
                  <div className="logs-cell">{row.actor?.role || 'Admin'}</div>
                  <div className="logs-cell logs-details"><strong>{row.action}</strong> {row.message}</div>
                  <div className="logs-cell logs-datetime">
                    <span>{new Date(row.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span className="logs-time">| {new Date(row.createdAt || Date.now()).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;