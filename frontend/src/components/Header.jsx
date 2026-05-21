import React, { useEffect, useState } from 'react';
import './Header.css';
import notificationIcon from '../assets/notification-icon.svg';
import NotificationsPanel from './NotificationsPanel';
import { api, auth, getCurrentUser } from '../api/client';
import ProfileModal from './ProfileModal';

const Header = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
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
      const cachedUser = getCurrentUser();
      if (cachedUser && mounted) {
        setCurrentUser(cachedUser);
        return;
      }

      try {
        const result = await auth.me();
        if (mounted) {
          setCurrentUser(result.user);
          localStorage.setItem('user', JSON.stringify(result.user));
        }
      } catch (err) {
        if (mounted) {
          // If token is invalid, clear and fall back to login.
          if (err?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('auth-changed'));
            setCurrentUser(null);
            window.location.assign('/');
            return;
          }
          setCurrentUser(getCurrentUser());
        }
      }
    };

    loadCurrentUser();
    const syncUser = () => {
      if (mounted) {
        setCurrentUser(getCurrentUser());
      }
    };

    window.addEventListener('storage', syncUser);
    window.addEventListener('auth-changed', syncUser);
    return () => {
      mounted = false;
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('auth-changed', syncUser);
    };
  }, []);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const openProfileEditor = () => {
    if (currentUser) {
      setIsProfileOpen(true);
    }
  };

  const handleProfileSave = async ({ name, avatarUrl, phone }) => {
    if (!currentUser?._id && !currentUser?.id) {
      return;
    }

    try {
      setIsSavingProfile(true);
      const updated = await api.put(`/api/users/${currentUser._id || currentUser.id}`, {
        name,
        avatarUrl,
        phone,
      });
      const nextUser = { ...currentUser, ...updated };
      setCurrentUser(nextUser);
      localStorage.setItem('user', JSON.stringify(nextUser));
      window.dispatchEvent(new Event('auth-changed'));
      setIsProfileOpen(false);
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="header">
        <div className="header-welcome">
            <h2>Welcome {currentUser?.name || 'Admin'}!</h2>
            <p>{formattedDate}</p>
        </div>
      <div className="user-info">
        <img src={notificationIcon} alt="Notifications" className="notification-icon" onClick={toggleNotifications} />
        <button type="button" className="profile-button" onClick={openProfileEditor} title="Edit admin profile">
          <img src={currentUser?.avatarUrl || 'https://i.pravatar.cc/150?img=12'} alt="Admin" className="user-avatar" />
          <div>
            <span className="user-name">{currentUser?.name || 'Admin'}</span>
            <span className="user-role">{currentUser?.role || 'admin'}</span>
          </div>
        </button>
        {isNotificationsOpen && <NotificationsPanel onClose={toggleNotifications} />}
      </div>
      {isProfileOpen && (
        <ProfileModal
          user={currentUser}
          onClose={() => setIsProfileOpen(false)}
          onSave={handleProfileSave}
          saving={isSavingProfile}
        />
      )}
    </div>
  );
};

export default Header;