import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Orders from '../components/Orders';
import './OrdersPage.css';

const OrdersPage = () => {
  return (
    <div className="orders-page">
      <Sidebar />
      <div className="orders-main-content">
        <Header />
        <Orders />
      </div>
    </div>
  );
};

export default OrdersPage;
