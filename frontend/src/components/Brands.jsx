import React, { useEffect, useState } from 'react';
import { Search, MoreVertical, Check } from 'react-feather';
import './Brands.css';
import AddBrand from './AddBrand';
import ToggleSwitch from './ToggleSwitch';
import neonLogo from '../assets/images/neonlogo.png';
import { api, isAdminUser } from '../api/client';

const Brands = () => {
  const [showModal, setShowModal] = useState(false);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const isAdmin = isAdminUser();

  const loadBrands = async () => {
    try {
      const data = await api.get('/api/brands');
      setBrands(data.map((brand) => ({ ...brand, rowId: brand._id, isSelected: false })));
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load brands.');
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleSelectBrand = (brandId) => {
    setBrands(brands.map(brand => (
      brand.rowId === brandId ? { ...brand, isSelected: !brand.isSelected } : brand
    )));
  };

  const handleToggle = async (brandId, field) => {
    const target = brands.find((brand) => brand.rowId === brandId);
    if (!target) {
      return;
    }

    try {
      const updated = await api.put(`/api/brands/${brandId}`, { [field]: !target[field] });
      setBrands(brands.map((brand) => (brand.rowId === brandId ? { ...brand, ...updated } : brand)));
    } catch (err) {
      setError(err.message || 'Failed to update brand.');
    }
  };

  const handleAddBrand = async (payload) => {
    try {
      const created = await api.post('/api/brands', {
        nameEn: payload.nameEn,
        nameUr: payload.nameUr,
        commission: Number(payload.commission || 0),
        category: payload.category,
        city: payload.city,
        logoUrl: payload.logoUrl,
      });
      setBrands((prev) => [{ ...created, rowId: created._id, isSelected: false }, ...prev]);
      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Failed to create brand.');
    }
  };

  const visibleBrands = brands.filter((brand) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return [brand.nameEn, brand.nameUr, brand._id]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  return (
    <div className="brands-container">

      {/* Top Bar */}
      <div className="brands-topbar">
        <h1 className="brands-heading">Brands</h1>
        <div className="brands-toolbar">
          <div className="brands-search">
            <Search size={15} className="brands-search-icon" />
            <input type="text" placeholder="Search by name, id..." className="brands-search-input" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
          <button className="brands-filter-btn">
            City
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="brands-filter-btn">
            Status
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {isAdmin && (
            <button className="brands-add-btn" onClick={() => setShowModal(true)}>
              + Add Brand
            </button>
          )}
        </div>
      </div>

      {error && <div className="brands-error">{error}</div>}

      {/* Table */}
      <div className="brands-table-wrap">
        <table className="brands-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Urdu Name</th>
              <th>ID</th>
              <th>Commission (%)</th>
              <th>Created on</th>
              <th>Status</th>
              <th>Admin Verified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visibleBrands.map((brand) => (
              <tr key={brand.rowId}>
                <td>
                  <div
                    className={`custom-checkbox ${brand.isSelected ? 'checked' : ''}`}
                    onClick={() => handleSelectBrand(brand.rowId)}
                  >
                    {brand.isSelected && <Check className="tick" size={16} />}
                  </div>
                </td>
                <td>
                  <div className="brands-name-cell">
                    <div className="brands-logo">
                      <img src={brand.logoUrl || neonLogo} alt={brand.nameEn} />
                    </div>
                    <span className="brands-name">{brand.nameEn}</span>
                  </div>
                </td>
                <td className="brands-urdu">{brand.nameUr}</td>
                <td className="brands-muted">{brand._id?.slice(-6) || brand.id}</td>
                <td className="brands-muted">{brand.commission}%</td>
                <td className="brands-muted">{new Date(brand.createdAt || Date.now()).toLocaleDateString()}</td>
                <td>
                  <ToggleSwitch
                    checked={brand.active}
                    onChange={() => handleToggle(brand.rowId, 'active')}
                    disabled={!isAdmin}
                  />
                </td>
                <td>
                  <ToggleSwitch
                    checked={brand.adminVerified}
                    onChange={() => handleToggle(brand.rowId, 'adminVerified')}
                    disabled={!isAdmin}
                  />
                </td>
                <td>
                  <button className="brands-dots" type="button">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Brand Modal */}
      {showModal && isAdmin && (
        <AddBrand
          onClose={() => setShowModal(false)}
          onSave={handleAddBrand}
        />
      )}
    </div>
  );
};

export default Brands;
