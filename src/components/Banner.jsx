import React, { useState } from 'react';
import { Search, MoreVertical } from 'react-feather';
import './Banner.css';
import ToggleSwitch from './ToggleSwitch';
import AddBanner from './AddBanner';
import BannerPreview from './BannerPreview';
import bannerImage from '../assets/images/banner.png';

const Banner = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [bannerStatus, setBannerStatus] = useState(true);
  const [bannerVerified, setBannerVerified] = useState(true);

  const handleSaveBanner = () => {
    setShowAddModal(false);
    setShowPreview(true);
  };

  const handlePreviewOpen = () => {
    setShowPreview(true);
  };

  const handleStatusToggle = () => {
    setBannerStatus(!bannerStatus);
  };

  const handleVerifiedToggle = () => {
    setBannerVerified(!bannerVerified);
  };

  return (
    <div className="banner-container">
      <div className="banner-topbar">
        <h1 className="banner-heading">Banner</h1>
        <div className="banner-toolbar">
          <div className="banner-search">
            <Search size={15} className="banner-search-icon" />
            <input type="text" placeholder="Search by Alternate Text" className="banner-search-input" />
          </div>
          <button className="banner-filter-btn" type="button">
            City
            <span className="banner-caret" />
          </button>
          <button className="banner-filter-btn" type="button">
            Status
            <span className="banner-caret" />
          </button>
          <button className="banner-add-btn" type="button" onClick={() => setShowAddModal(true)}>
            + Add New
          </button>
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
            <tr onClick={handlePreviewOpen} className="banner-row">
              <td>
                <div className="banner-image-cell">
                  <img src={bannerImage} alt="Banner" />
                </div>
              </td>
              <td className="banner-muted">Ac dictum sit aliquam diam mauris nullam.</td>
              <td>
                <div className="banner-date">
                  <span>24/10/2022</span>
                  <span className="banner-time">12:35 Pm</span>
                </div>
              </td>
              <td onClick={(e) => e.stopPropagation()}><ToggleSwitch checked={bannerStatus} onChange={handleStatusToggle} /></td>
              <td onClick={(e) => e.stopPropagation()}><ToggleSwitch checked={bannerVerified} onChange={handleVerifiedToggle} /></td>
              <td onClick={(e) => e.stopPropagation()}>
                <button className="banner-dots" type="button">
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddBanner
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveBanner}
        />
      )}

      {showPreview && (
        <BannerPreview image={bannerImage} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};

export default Banner;
