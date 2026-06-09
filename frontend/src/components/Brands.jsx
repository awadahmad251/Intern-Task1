import React, { useEffect, useRef, useState } from 'react';
import { Search, MoreVertical, Check } from 'react-feather';
import './Brands.css';
import './AdminToolbar.css';
import AddBrand from './AddBrand';
import ToggleSwitch from './ToggleSwitch';
import neonLogo from '../assets/images/neonlogo.png';
import { api, isAdminUser } from '../api/client';
import ConfirmDialog from './ConfirmDialog';

const Brands = () => {
  const [showModal, setShowModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [error, setError] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const menuRef = useRef(null);
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
    api.get('/api/cities').then(setCities).catch(() => {});
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!openMenuId) return;
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleSelectBrand = (brandId) => {
    setBrands(brands.map(brand =>
      brand.rowId === brandId ? { ...brand, isSelected: !brand.isSelected } : brand
    ));
  };

  const handleToggle = async (brandId, field) => {
    const target = brands.find((brand) => brand.rowId === brandId);
    if (!target) return;
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

  const handleEditBrand = async (payload) => {
    if (!editBrand) return;
    try {
      const body = {
        nameEn: payload.nameEn,
        nameUr: payload.nameUr,
        commission: Number(payload.commission || 0),
        logoUrl: payload.logoUrl,
      };
      if (payload.category) body.category = payload.category;
      if (payload.city) body.city = payload.city;

      const updated = await api.put(`/api/brands/${editBrand._id}`, body);
      setBrands((prev) =>
        prev.map((b) => (b.rowId === editBrand._id ? { ...b, ...updated, rowId: updated._id } : b))
      );
      setEditBrand(null);
    } catch (err) {
      setError(err.message || 'Failed to update brand.');
    }
  };

  const handleDeleteBrand = async (brandId) => {
    try {
      await api.del(`/api/brands/${brandId}`);
      setBrands((prev) => prev.filter((b) => b.rowId !== brandId));
      setDeleteConfirmId(null);
      setOpenMenuId(null);
    } catch (err) {
      setError(err.message || 'Failed to delete brand.');
    }
  };

  const visibleBrands = brands.filter((brand) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = !query || [brand.nameEn, brand.nameUr, brand._id]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
    const brandCityId = brand.city?._id || brand.city || '';
    const matchesCity = selectedCity === 'all' || brandCityId === selectedCity;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && brand.active) ||
      (selectedStatus === 'inactive' && !brand.active) ||
      (selectedStatus === 'verified' && brand.adminVerified) ||
      (selectedStatus === 'unverified' && !brand.adminVerified);
    return matchesSearch && matchesCity && matchesStatus;
  });

  return (
    <div className="brands-container">
      {/* Top Bar */}
      <div className="brands-topbar">
        <h1 className="brands-heading">Brands</h1>
        <div className="brands-toolbar">
          <div className="brands-search">
            <Search size={15} className="brands-search-icon" />
            <input
              type="text"
              placeholder="Search by name, id..."
              className="brands-search-input"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <select className="brands-filter-select" value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
            <option value="all">City</option>
            {cities.map((city) => (
              <option key={city._id || city.id} value={city._id || city.id}>{city.name}</option>
            ))}
          </select>
          <select className="brands-filter-select" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
            <option value="all">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          {(searchTerm || selectedCity !== 'all' || selectedStatus !== 'all') && (
            <button
              type="button"
              className="brands-clear-btn"
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
            {visibleBrands.length === 0 ? (
              <tr>
                <td colSpan={9} className="brands-empty">
                  No brands found.
                </td>
              </tr>
            ) : (
              visibleBrands.map((brand) => (
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
                  <td style={{ position: 'relative' }}>
                    {isAdmin && (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button
                          className="brands-dots"
                          type="button"
                          onClick={() => setOpenMenuId(openMenuId === brand.rowId ? null : brand.rowId)}
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openMenuId === brand.rowId && (
                          <div className="brands-dropdown">
                            <button
                              className="brands-dropdown-item"
                              onClick={() => {
                                setEditBrand(brand);
                                setOpenMenuId(null);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="brands-dropdown-item brands-dropdown-delete"
                              onClick={() => setDeleteConfirmId(brand.rowId)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirmId && (
        <ConfirmDialog
          message="Delete this brand? This cannot be undone."
          onConfirm={() => handleDeleteBrand(deleteConfirmId)}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}

      {/* Add Brand Modal */}
      {showModal && isAdmin && (
        <AddBrand onClose={() => setShowModal(false)} onSave={handleAddBrand} />
      )}

      {/* Edit Brand Modal */}
      {editBrand && isAdmin && (
        <AddBrand
          onClose={() => setEditBrand(null)}
          onSave={handleEditBrand}
          initialData={editBrand}
          isEdit
        />
      )}
    </div>
  );
};

export default Brands;
