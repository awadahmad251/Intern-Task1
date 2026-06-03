import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Users from '../components/Users';
import './UsersPage.css';

const UsersPage = () => {
  return (
    <div className="users-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Users />
      </div>
    </div>
  );
};

export default UsersPage;