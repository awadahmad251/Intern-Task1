import React, { useState } from 'react';
import './Products.css';
import { Search } from 'react-feather';
import ProductTable from './ProductTable';
import AddProductModal from './AddProductModal';

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="products-container">
      <div className="page-header">
        <h1>Products</h1>
        <div className="toolbar">
          <div className="search-input">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search by name, id..." />
          </div>
          <select className="toolbar-select">
            <option>City</option>
          </select>
          <select className="toolbar-select">
            <option>Brand</option>
          </select>
          <select className="toolbar-select">
            <option>Category</option>
          </select>
          <select className="toolbar-select">
            <option>Status</option>
          </select>
          <button className="add-product-btn" onClick={toggleModal}>
            <span className="add-icon">+</span>
            Add Product
          </button>
        </div>
      </div>
      <ProductTable />
      {isModalOpen && <AddProductModal onClose={toggleModal} />}
    </div>
  );
};

export default Products;
