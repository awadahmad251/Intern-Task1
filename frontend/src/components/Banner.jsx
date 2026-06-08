import React, { useEffect, useRef, useState } from 'react';
import { Search, MoreVertical } from 'react-feather';
import './Banner.css';
import './AdminToolbar.css';
import ToggleSwitch from './ToggleSwitch';
import AddBanner from './AddBanner';
import BannerPreview from './BannerPreview';
import bannerImage from '../assets/images/banner.png';
import { api, isAdminUser } from '../api/client';

const Banner = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [banners, setBanners] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [error, setError] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const isAdmin = isAdminUser();

  const loadBanners = async () => {
    try {
      const data = await api.get('/api/banners');
      setBanners(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load banners.');
    }
  };

  useEffect(() => {
    loadBanners();
    api.get('/api/cities').then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    if (!openMenuId) return;
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleSaveBanner = async (payload) => {
    try {
      const created = await api.post('/api/banners', { imageUrl: payload.imageUrl, altText: payload.altText, city: payload.city });
      setBanners((prev) => [created, ...prev]);
      setShowAddModal(false);
    } catch (err) {
      setError(err.message || 'Failed to create banner.');
    }
  };

  const handleEditBanner = async (payload) => {
    if (!editBanner) return;
    try {
      const updated = await api.put(`/api/banners/${editBanner._id}`, { imageUrl: payload.imageUrl, altText: payload.altText });
      setBanners((prev) => prev.map((b) => (b._id === editBanner._id ? { ...b, ...updated } : b)));
      setEditBanner(null);
    } catch (err) {
      setError(err.message || 'Failed to update banner.');
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      await api.del(`/api/banners/${bannerId}`);
      setBanners((prev) => prev.filter((b) => b._id !== bannerId));
      setDeleteConfirmId(null);
      setOpenMenuId(null);
    } catch (err) {
      setError(err.message || 'Failed to delete banner.');
    }
  };

  const handleToggle = async (bannerId, field, banner) => {
    try {
      const updated = await api.put(`/api/banners/${bannerId}`, { [field]: !banner[field] });
      setBanners((prev) => prev.map((item) => (item._id === bannerId ? { ...item, ...updated } : item)));
    } catch (err) {
      setError(err.message || 'Failed to update banner.');
    }
  };

  const visibleBanners = banners.filter((banner) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = !query || [banner.altText, banner._id, banner.imageUrl].filter(Boolean).some((v) => String(v).toLowerCase().includes(query));
    const bannerCityId = banner.city?._id || banner.city || '';
    const matchesCity = selectedCity === 'all' || bannerCityId === selectedCity;
    const matchesStatus = selectedStatus === 'all'
      || (selectedStatus === 'active' && banner.active)
      || (selectedStatus === 'inactive' && !banner.active)
      || (selectedStatus === 'verified' && banner.adminVerified)
      || (selectedStatus === 'unverified' && !banner.adminVerified);
    return matchesSearch && matchesCity && matchesStatus;
  });

  return (
    <div className="banner-container">
      <div className="banner-topbar">
        <h1 className="banner-heading">Banner</h1>
        <div className="banner-toolbar">
          <div className="banner-search">
            <Search size={15} className="banner-search-icon" />
            <input type="text" placeholder="Search by Alternate Text" className="banner-search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className="banner-filter-select" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            <option value="all">City</option>
            {cities.map((city) => <option key={city._id} value={city._id}>{city.name}</option>)}
          </select>
          <select className="banner-filter-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          {(searchTerm || selectedCity !== 'all' || selectedStatus !== 'all') && (
            <button type="button" className="banner-clear-btn" onClick={() => { setSearchTerm(''); setSelectedCity('all'); setSelectedStatus('all'); }}>Clear Filters</button>
          )}
          {isAdmin && <button className="banner-add-btn" type="button" onClick={() => setShowAddModal(true)}>+ Add New</button>}
        </div>
      </div>

      <div className="banner-table-wrap">
        <table className="banner-table">
          <thead>
            <tr>
              <th>Banner</th>
              <th>Alternate Text</th>
              <th>Created Date</th>
              <th>Status</th>
              <th>Admin Verified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visibleBanners.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#aaa', fontSize: '14px' }}>No banners found.</td></tr>
            )}
            {visibleBanners.map((banner) => (
              <tr key={banner._id} onClick={() => { setPreviewBanner(banner); setShowPreview(true); }} className="banner-row">
                <td><div className="banner-image-cell"><img src={banner.imageUrl || bannerImage} alt={banner.altText || 'Banner'} /></div></td>
                <td className="banner-muted">{banner.altText || '-'}</td>
                <td>
                  <div className="banner-date">
                    <span>{new Date(banner.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span className="banner-time">{new Date(banner.createdAt || Date.now()).toLocaleTimeString()}</span>
                  </div>
                </td>
                <td onClick={(e) => e.stopPropagation()}><ToggleSwitch checked={banner.active} onChange={() => handleToggle(banner._id, 'active', banner)} disabled={!isAdmin} /></td>
                <td onClick={(e) => e.stopPropagation()}><ToggleSwitch checked={banner.adminVerified} onChange={() => handleToggle(banner._id, 'adminVerified', banner)} disabled={!isAdmin} /></td>
                <td onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
                  {isAdmin && (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <button className="banner-dots" type="button" onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === banner._id ? null : banner._id); }}>
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === banner._id && (
                        <div className="banner-dropdown">
                          <button className="banner-dropdown-item" onClick={(e) => { e.stopPropagation(); setEditBanner(banner); setOpenMenuId(null); }}>Edit</button>
                          <button className="banner-dropdown-item banner-dropdown-delete" onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(banner._id); setOpenMenuId(null); }}>Delete</button>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <div className="banner-error">{error}</div>}

      {/* Delete confirm */}
      {deleteConfirmId && (
        <div className="banner-confirm-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="banner-confirm-box" onClick={(e) => e.stopPropagation()}>
            <p className="banner-confirm-text">Delete this banner? This cannot be undone.</p>
            <div className="banner-confirm-actions">
              <button className="banner-cancel-btn" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
              <button className="banner-delete-btn" onClick={() => handleDeleteBanner(deleteConfirmId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && isAdmin && <AddBanner onClose={() => setShowAddModal(false)} onSave={handleSaveBanner} />}
      {editBanner && isAdmin && <AddBanner onClose={() => setEditBanner(null)} onSave={handleEditBanner} initialData={editBanner} isEdit />}
      {showPreview && <BannerPreview image={previewBanner?.imageUrl || bannerImage} onClose={() => setShowPreview(false)} />}
    </div>
  );
};

export default Banner;
