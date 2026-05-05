import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Banner from '../components/Banner';
import './BannerPage.css';

const BannerPage = () => {
  return (
    <div className="banner-page">
      <Sidebar />
      <div className="banner-main-content">
        <Header />
        <Banner />
      </div>
    </div>
  );
};

export default BannerPage;
