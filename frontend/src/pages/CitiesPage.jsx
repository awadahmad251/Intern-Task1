import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Cities from '../components/Cities';
import './CitiesPage.css';

const CitiesPage = () => {
  return (
    <div className="cities-page">
      <Sidebar />
      <div className="cities-main-content">
        <Header />
        <Cities />
      </div>
    </div>
  );
};

export default CitiesPage;
