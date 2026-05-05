import React from 'react';
import './NotificationsPanel.css';
import { Bell, Search } from 'react-feather';

const notifications = [
  { id: 1, title: 'Notification Title', body: 'Egestas libero ac ut lectus cursus. Urna integer nisl imperdiet et turpis.', time: '2 min ago' },
  { id: 2, title: 'Notification Title', body: 'Egestas libero ac ut lectus cursus. Urna integer nisl imperdiet et turpis.', time: '2 min ago' },
  { id: 3, title: 'Notification Title', body: 'Egestas libero ac ut lectus cursus. Urna integer nisl imperdiet et turpis.', time: '2 min ago' },
  { id: 4, title: 'Notification Title', body: 'Egestas libero ac ut lectus cursus. Urna integer nisl imperdiet et turpis.', time: '2 min ago' },
  { id: 5, title: 'Notification Title', body: 'Egestas libero ac ut lectus cursus. Urna integer nisl imperdiet et turpis.', time: '2 min ago' },
];

const NotificationsPanel = () => {
  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h3>Notifications</h3>
        <div className="notifications-search">
          <Search size={16} />
          <input type="text" placeholder="Search" />
        </div>
      </div>
      <div className="notifications-list">
        {notifications.map(notification => (
          <div key={notification.id} className="notification-item">
            <div className="notification-icon">
              <Bell size={16} />
            </div>
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <p className="notification-body">{notification.body}</p>
            </div>
            <span className="notification-time">{notification.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;
