import React, { useEffect, useState } from 'react';
import { Search } from 'react-feather';
import './Cities.css';
import CityTable from './CityTable';
import AddCity from './AddCity';
import { api, isAdminUser } from '../api/client';

const Cities = () => {
  const [showModal, setShowModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const isAdmin = isAdminUser();

  const loadCities = async () => {
    try {
      const data = await api.get('/api/cities');
      setCities(data.map((city) => ({ ...city, isSelected: false })));
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load cities.');
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
      const created = await api.post('/api/cities', { name: payload.name });
      setCities((prev) => [{ ...created, isSelected: false }, ...prev]);
      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Failed to create city.');
    }
  };

  const visibleCities = cities.filter((city) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return [city.name, city._id]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
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
          <button className="cities-filter-btn" type="button">
            Status
            <span className="cities-caret" />
          </button>
          {isAdmin && (
            <button className="cities-add-btn" type="button" onClick={() => setShowModal(true)}>
              + Add City
            </button>
          )}
        </div>
      </div>

      {error && <div className="cities-error">{error}</div>}
      <CityTable cities={visibleCities} onSelect={handleSelect} onToggle={handleToggle} canEdit={isAdmin} />

      {showModal && isAdmin && <AddCity onClose={() => setShowModal(false)} onSave={handleCreate} />}
    </div>
  );
};

export default Cities;
