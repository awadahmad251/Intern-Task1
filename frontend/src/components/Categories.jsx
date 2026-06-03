import React, { useEffect, useState } from 'react';
import { Search } from 'react-feather';
import './Categories.css';
import './AdminToolbar.css';
import CategoryTable from './CategoryTable';
import CreateCategory from './CreateCategory';
import { api, isAdminUser } from '../api/client';

const Categories = () => {
  const [showModal, setShowModal] = useState(false); // ← add this
  const [editingCategory, setEditingCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [error, setError] = useState('');
  const isAdmin = isAdminUser();

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/categories');
      setCategories(data.map((category) => ({ ...category, isSelected: false })));
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    api.get('/api/cities').then(setCities).catch(() => {});
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
      const requestPayload = {
        nameEn: payload.nameEn,
        nameUr: payload.nameUr,
        imageUrl: payload.imageUrl,
        city: payload.city,
      };

      if (editingCategory) {
        const updated = await api.put(`/api/categories/${editingCategory._id || editingCategory.id}`, requestPayload);
        setCategories((prev) => prev.map((category) => ((category._id || category.id) === (editingCategory._id || editingCategory.id)
          ? { ...category, ...updated }
          : category)));
      } else {
        const created = await api.post('/api/categories', requestPayload);
        setCategories((prev) => [{ ...created, isSelected: false }, ...prev]);
      }
      setShowModal(false);
      setEditingCategory(null);
    } catch (err) {
      setError(err.message || 'Failed to create category.');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Delete this category?')) {
      return;
    }

    try {
      await api.del(`/api/categories/${categoryId}`);
      setCategories((prev) => prev.filter((category) => (category._id || category.id) !== categoryId));
    } catch (err) {
      setError(err.message || 'Failed to delete category.');
    }
  };

  const visibleCategories = categories.filter((category) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = !query || [category.nameEn, category.nameUr, category._id]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));

    const categoryCityId = category.city?._id || category.city || '';
    const matchesCity = selectedCity === 'all' || categoryCityId === selectedCity;
    const matchesStatus = selectedStatus === 'all'
      || (selectedStatus === 'active' && category.active)
      || (selectedStatus === 'inactive' && !category.active)
      || (selectedStatus === 'verified' && category.adminVerified)
      || (selectedStatus === 'unverified' && !category.adminVerified);

    return matchesSearch && matchesCity && matchesStatus;
  });

  return (
    <div className="categories-container">
      <div className="page-header">
        <h1>Categories</h1>
        <div className="toolbar">
          <div className="search-input">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search by name, id..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
          <select className="toolbar-select" value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
            <option value="all">City</option>
            {cities.map((city) => (
              <option key={city._id || city.id} value={city._id || city.id}>{city.name}</option>
            ))}
          </select>
          <select className="toolbar-select" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
            <option value="all">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          {(searchTerm || selectedCity !== 'all' || selectedStatus !== 'all') && (
            <button
              type="button"
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('all');
                setSelectedStatus('all');
              }}
            >
              Clear Filters
            </button>
          )}
          {isAdmin && (
            <button className="add-category-btn" onClick={() => setShowModal(true)}> {/* ← add onClick */}
              <span className="add-icon">+</span>
              Create Category
            </button>
          )}
        </div>
      </div>
      {error && <div className="categories-error">{error}</div>}
      {loading ? (
        <div className="page-loading">Loading...</div>
      ) : (
        <CategoryTable
          categories={visibleCategories}
          onSelect={handleSelect}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          canEdit={isAdmin}
        />
      )}

      {/* ← modal renders only when showModal is true */}
      {showModal && isAdmin && (
        <CreateCategory
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          onSave={handleCreate}
          initialData={editingCategory}
          cities={cities}
        />
      )}
    </div>
  );
};

export default Categories;