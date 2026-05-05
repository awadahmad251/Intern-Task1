import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Brands from '../components/Brands';
import './BrandsPage.css';

const BrandsPage = () => {
  return (
    <div className="brands-page">
      <Sidebar />
      <div className="brands-main-content">
        <Header />
        <Brands />
      </div>
    </div>
  );
};

export default BrandsPage;
