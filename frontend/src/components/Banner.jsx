import React, { useEffect, useState } from 'react';
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
  const [showPreview, setShowPreview] = useState(false);
  const [banners, setBanners] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [error, setError] = useState('');
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

  const handleSaveBanner = async (payload) => {
    try {
      const created = await api.post('/api/banners', {
        imageUrl: payload.imageUrl,
        altText: payload.altText,
        city: payload.city,
      });
      setBanners((prev) => [created, ...prev]);
      setShowAddModal(false);
    } catch (err) {
      setError(err.message || 'Failed to create banner.');
    }
  };

  const handlePreviewOpen = (banner) => {
    setSelectedBanner(banner);
    setShowPreview(true);
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
    const matchesSearch = !query || [banner.altText, banner._id, banner.imageUrl]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));

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
            <input type="text" placeholder="Search by Alternate Text" className="banner-search-input" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
          <select className="banner-filter-select" value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
            <option value="all">City</option>
            {cities.map((city) => (
              <option key={city._id || city.id} value={city._id || city.id}>{city.name}</option>
            ))}
          </select>
          <select className="banner-filter-select" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
            <option value="all">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          {(searchTerm || selectedCity !== 'all' || selectedStatus !== 'all') && (
            <button
              type="button"
              className="banner-clear-btn"
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
            <button className="banner-add-btn" type="button" onClick={() => setShowAddModal(true)}>
              + Add New
            </button>
          )}
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
            {visibleBanners.map((banner) => (
              <tr key={banner._id} onClick={() => handlePreviewOpen(banner)} className="banner-row">
                <td>
                  <div className="banner-image-cell">
                    <img src={banner.imageUrl || bannerImage} alt={banner.altText || 'Banner'} />
                  </div>
                </td>
                <td className="banner-muted">{banner.altText || '-'}</td>
                <td>
                  <div className="banner-date">
                    <span>{new Date(banner.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span className="banner-time">{new Date(banner.createdAt || Date.now()).toLocaleTimeString()}</span>
                  </div>
                </td>
                <td onClick={(e) => e.stopPropagation()}><ToggleSwitch checked={banner.active} onChange={() => handleToggle(banner._id, 'active', banner)} disabled={!isAdmin} /></td>
                <td onClick={(e) => e.stopPropagation()}><ToggleSwitch checked={banner.adminVerified} onChange={() => handleToggle(banner._id, 'adminVerified', banner)} disabled={!isAdmin} /></td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button className="banner-dots" type="button">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <div className="banner-error">{error}</div>}

      {showAddModal && isAdmin && (
        <AddBanner
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveBanner}
        />
      )}

      {showPreview && (
        <BannerPreview image={selectedBanner?.imageUrl || bannerImage} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};

export default Banner;
