import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Search, ChevronDown } from 'react-feather';
import './LogsPage.css';

const logRows = [
  { id: '#L21241', user: 'Wajahat', role: 'Admin', details: 'Logged in using Mac OS 2017', date: '24/10/2022', time: '12:35 Pm' },
  { id: '#L21241', user: 'Wajahat', role: 'Admin', details: 'Logged in using Mac OS 2017', date: '24/10/2022', time: '12:35 Pm' },
  { id: '#L21241', user: 'Wajahat', role: 'Admin', details: 'Logged in using Mac OS 2017', date: '24/10/2022', time: '12:35 Pm' },
  { id: '#L21241', user: 'Wajahat', role: 'Admin', details: 'Logged in using Mac OS 2017', date: '24/10/2022', time: '12:35 Pm' },
  { id: '#L21241', user: 'Wajahat', role: 'Admin', details: 'Logged in using Mac OS 2017', date: '24/10/2022', time: '12:35 Pm' },
  { id: '#L21241', user: 'Wajahat', role: 'Admin', details: 'Logged in using Mac OS 2017', date: '24/10/2022', time: '12:35 Pm' },
  { id: '#L21241', user: 'Wajahat', role: 'Admin', details: 'Logged in using Mac OS 2017', date: '24/10/2022', time: '12:35 Pm' },
  { id: '#L21241', user: 'Wajahat', role: 'Admin', details: 'Logged in using Mac OS 2017', date: '24/10/2022', time: '12:35 Pm' },
];

const LogsPage = () => {
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

            <div className="logs-list">
              {logRows.map((row, index) => (
                <div className="logs-row" key={`${row.id}-${index}`}>
                  <div className="logs-select-box" />
                  <div className="logs-cell logs-id">{row.id}</div>
                  <div className="logs-cell">{row.user}</div>
                  <div className="logs-cell">{row.role}</div>
                  <div className="logs-cell logs-details"><strong>Logged in</strong> {row.details.replace('Logged in ', '')}</div>
                  <div className="logs-cell logs-datetime"><span>{row.date}</span><span className="logs-time">| {row.time}</span></div>
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