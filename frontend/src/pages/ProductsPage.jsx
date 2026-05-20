import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Products from '../components/Products';
import './ProductsPage.css';

const ProductsPage = () => {
  return (
    <div className="products-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Products />
      </div>
    </div>
  );
};

export default ProductsPage;
