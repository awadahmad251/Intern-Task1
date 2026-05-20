import React, { useEffect, useState } from 'react';
import { Search } from 'react-feather';
import './Categories.css';
import CategoryTable from './CategoryTable';
import CreateCategory from './CreateCategory';
import { api, isAdminUser } from '../api/client';

const Categories = () => {
  const [showModal, setShowModal] = useState(false); // ← add this
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const isAdmin = isAdminUser();

  const loadCategories = async () => {
    try {
      const data = await api.get('/api/categories');
      setCategories(data.map((category) => ({ ...category, isSelected: false })));
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load categories.');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSelect = (categoryId) => {
    setCategories((prev) => prev.map((cat) => (cat._id === categoryId ? { ...cat, isSelected: !cat.isSelected } : cat)));
  };

  const handleToggle = async (categoryId, field, category) => {
    try {
      const updated = await api.put(`/api/categories/${categoryId}`, { [field]: !category[field] });
      setCategories((prev) => prev.map((cat) => (cat._id === categoryId ? { ...cat, ...updated } : cat)));
    } catch (err) {
      setError(err.message || 'Failed to update category.');
    }
  };

  const handleCreate = async (payload) => {
    try {
      const created = await api.post('/api/categories', {
        nameEn: payload.nameEn,
        nameUr: payload.nameUr,
        imageUrl: payload.imageUrl,
        city: payload.city,
      });
      setCategories((prev) => [{ ...created, isSelected: false }, ...prev]);
      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Failed to create category.');
    }
  };

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
          {isAdmin && (
            <button className="add-category-btn" onClick={() => setShowModal(true)}> {/* ← add onClick */}
              <span className="add-icon">+</span>
              Create Category
            </button>
          )}
        </div>
      </div>
      {error && <div className="categories-error">{error}</div>}
      <CategoryTable categories={categories} onSelect={handleSelect} onToggle={handleToggle} canEdit={isAdmin} />

      {/* ← modal renders only when showModal is true */}
      {showModal && isAdmin && (
        <CreateCategory onClose={() => setShowModal(false)} onSave={handleCreate} />
      )}
    </div>
  );
};

export default Categories;