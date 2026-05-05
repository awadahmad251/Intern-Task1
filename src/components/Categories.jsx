import React, { useState } from 'react';
import { Search } from 'react-feather';
import './Categories.css';
import CategoryTable from './CategoryTable';
import CreateCategory from './CreateCategory';

const Categories = () => {
  const [showModal, setShowModal] = useState(false); // ← add this

  return (
    <div className="categories-container">
      <div className="page-header">
        <h1>Categories</h1>
        <div className="toolbar">
          <div className="search-input">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search by name, id..." />
          </div>
          <select className="toolbar-select">
            <option>City</option>
          </select>
          <select className="toolbar-select">
            <option>Status</option>
          </select>
          <button className="add-category-btn" onClick={() => setShowModal(true)}> {/* ← add onClick */}
            <span className="add-icon">+</span>
            Create Category
          </button>
        </div>
      </div>
      <CategoryTable />

      {/* ← modal renders only when showModal is true */}
      {showModal && (
        <CreateCategory onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Categories;