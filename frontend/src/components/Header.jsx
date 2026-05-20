import React, { useState } from 'react';
import './Header.css';
import notificationIcon from '../assets/notification-icon.svg';
import NotificationsPanel from './NotificationsPanel';

const Header = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const formattedDate = 'Wednesday April 19, 2023';

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  return (
    <div className="header">
        <div className="header-welcome">
            <h2>Welcome Admin!</h2>
            <p>{formattedDate}</p>
        </div>
      <div className="user-info">
        <img src={notificationIcon} alt="Notifications" className="notification-icon" onClick={toggleNotifications} />
        <img src="https://randomuser.me/api/portraits/men/10.jpg" alt="Admin" className="user-avatar" />
        <div>
          <span className="user-name">Wajahat</span>
            <span className="user-role">Admin</span>
        </div>
        {isNotificationsOpen && <NotificationsPanel onClose={toggleNotifications} />}
      </div>
    </div>
  );
};

export default Header;