import React, { useEffect, useState } from 'react';
import { Search } from 'react-feather';
import './Cities.css';
import './AdminToolbar.css';
import CityTable from './CityTable';
import AddCity from './AddCity';
import { api, isAdminUser } from '../api/client';

const Cities = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [error, setError] = useState('');
  const isAdmin = isAdminUser();

  const loadCities = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/cities');
      setCities(data.map((city) => ({ ...city, isSelected: false })));
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load cities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  const handleSelect = (cityId) => {
    setCities((prev) => prev.map((city) => (city._id === cityId ? { ...city, isSelected: !city.isSelected } : city)));
  };

  const handleToggle = async (cityId, field, city) => {
    try {
      const updated = await api.put(`/api/cities/${cityId}`, { [field]: !city[field] });
      setCities((prev) => prev.map((c) => (c._id === cityId ? { ...c, ...updated } : c)));
    } catch (err) {
      setError(err.message || 'Failed to update city.');
    }
  };

  const handleCreate = async (payload) => {
    try {
      if (editingCity) {
        const updated = await api.put(`/api/cities/${editingCity._id || editingCity.id}`, { name: payload.name });
        setCities((prev) => prev.map((city) => ((city._id || city.id) === (editingCity._id || editingCity.id)
          ? { ...city, ...updated }
          : city)));
      } else {
        const created = await api.post('/api/cities', { name: payload.name });
        setCities((prev) => [{ ...created, isSelected: false }, ...prev]);
      }
      setShowModal(false);
      setEditingCity(null);
    } catch (err) {
      setError(err.message || 'Failed to create city.');
    }
  };

  const handleEdit = (city) => {
    setEditingCity(city);
    setShowModal(true);
  };

  const handleDelete = async (cityId) => {
    if (!window.confirm('Delete this city?')) {
      return;
    }

    try {
      await api.del(`/api/cities/${cityId}`);
      setCities((prev) => prev.filter((city) => (city._id || city.id) !== cityId));
    } catch (err) {
      setError(err.message || 'Failed to delete city.');
    }
  };

  const visibleCities = cities.filter((city) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = !query || [city.name, city._id]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));

    const matchesStatus = selectedStatus === 'all'
      || (selectedStatus === 'active' && city.active)
      || (selectedStatus === 'inactive' && !city.active)
      || (selectedStatus === 'verified' && city.adminVerified)
      || (selectedStatus === 'unverified' && !city.adminVerified);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="cities-container">
      <div className="cities-topbar">
        <h1 className="cities-heading">Cities</h1>
        <div className="cities-toolbar">
          <div className="cities-search">
            <Search size={15} className="cities-search-icon" />
            <input type="text" placeholder="Search by city name..." className="cities-search-input" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
          <select className="cities-filter-select" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
            <option value="all">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          {(searchTerm || selectedStatus !== 'all') && (
            <button
              className="cities-clear-btn"
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
              }}
            >
              Clear Filters
            </button>
          )}
          {isAdmin && (
            <button className="cities-add-btn" type="button" onClick={() => setShowModal(true)}>
              + Add City
            </button>
          )}
        </div>
      </div>

      {error && <div className="cities-error">{error}</div>}
      {loading ? (
        <div className="page-loading">Loading...</div>
      ) : (
        <CityTable
          cities={visibleCities}
          onSelect={handleSelect}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          canEdit={isAdmin}
        />
      )}

      {showModal && isAdmin && (
        <AddCity
          onClose={() => {
            setShowModal(false);
            setEditingCity(null);
          }}
          onSave={handleCreate}
          initialData={editingCity}
        />
      )}
    </div>
  );
};

export default Cities;
