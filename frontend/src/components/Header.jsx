import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import notificationIcon from '../assets/notification-icon.svg';
import NotificationsPanel from './NotificationsPanel';
import { auth, getCurrentUser } from '../api/client';

const Header = () => {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    let mounted = true;
    const loadCurrentUser = async () => {
      try {
        const result = await auth.me();
        if (mounted) {
          setCurrentUser(result.user);
          localStorage.setItem('user', JSON.stringify(result.user));
        }
      } catch (err) {
        if (mounted) {
          setCurrentUser(getCurrentUser());
        }
      }
    };

    loadCurrentUser();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="header">
        <div className="header-welcome">
            <h2>Welcome {currentUser?.name || 'Admin'}!</h2>
            <p>{formattedDate}</p>
        </div>
      <div className="user-info">
        <img src={notificationIcon} alt="Notifications" className="notification-icon" onClick={toggleNotifications} />
        <img src={currentUser?.avatarUrl || 'https://i.pravatar.cc/150?img=12'} alt="Admin" className="user-avatar" />
        <div>
          <span className="user-name">{currentUser?.name || 'Admin'}</span>
            <span className="user-role">{currentUser?.role || 'admin'}</span>
        </div>
        {isNotificationsOpen && <NotificationsPanel onClose={toggleNotifications} />}
      </div>
    </div>
  );
};

export default Header;