import React, { useState } from 'react';
import { Search, MoreVertical, Check } from 'react-feather';
import './Brands.css';
import AddBrand from './AddBrand';
import ToggleSwitch from './ToggleSwitch';
import neonLogo from '../assets/images/neonlogo.png';

const mockBrands = [
  { id: '#P321', name: 'Neon', urduName: 'نیان', commission: '07%', createdOn: '24/10/2022', status: true, adminVerified: true },
  { id: '#P321', name: 'Neon', urduName: 'نیان', commission: '07%', createdOn: '24/10/2022', status: true, adminVerified: true },
  { id: '#P321', name: 'Neon', urduName: 'نیان', commission: '07%', createdOn: '24/10/2022', status: true, adminVerified: true },
  { id: '#P321', name: 'Neon', urduName: 'نیان', commission: '07%', createdOn: '24/10/2022', status: true, adminVerified: true },
  { id: '#P321', name: 'Neon', urduName: 'نیان', commission: '07%', createdOn: '24/10/2022', status: true, adminVerified: true },
  { id: '#P321', name: 'Neon', urduName: 'نیان', commission: '07%', createdOn: '24/10/2022', status: true, adminVerified: true },
  { id: '#P321', name: 'Neon', urduName: 'نیان', commission: '07%', createdOn: '24/10/2022', status: true, adminVerified: true },
  { id: '#P321', name: 'Neon', urduName: 'نیان', commission: '07%', createdOn: '24/10/2022', status: true, adminVerified: true },
];

const Brands = () => {
  const [showModal, setShowModal] = useState(false);

  const [brands, setBrands] = useState(
    mockBrands.map((brand, index) => ({
      ...brand,
      rowId: `${brand.id}-${index}`,
      isSelected: index % 2 === 0,
    }))
  );

  const handleSelectBrand = (brandId) => {
    setBrands(brands.map(brand => (
      brand.rowId === brandId ? { ...brand, isSelected: !brand.isSelected } : brand
    )));
  };

  const handleToggle = (brandId, field) => {
    setBrands(brands.map(brand => (
      brand.rowId === brandId ? { ...brand, [field]: !brand[field] } : brand
    )));
  };

  return (
    <div className="brands-container">

      {/* Top Bar */}
      <div className="brands-topbar">
        <h1 className="brands-heading">Brands</h1>
        <div className="brands-toolbar">
          <div className="brands-search">
            <Search size={15} className="brands-search-icon" />
            <input type="text" placeholder="Search by name, id..." className="brands-search-input" />
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
          <button className="brands-add-btn" onClick={() => setShowModal(true)}>
            + Add Brand
          </button>
        </div>
      </div>

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
            {brands.map((brand) => (
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
                      <img src={neonLogo} alt={brand.name} />
                    </div>
                    <span className="brands-name">{brand.name}</span>
                  </div>
                </td>
                <td className="brands-urdu">{brand.urduName}</td>
                <td className="brands-muted">{brand.id}</td>
                <td className="brands-muted">{brand.commission}</td>
                <td className="brands-muted">{brand.createdOn}</td>
                <td>
                  <ToggleSwitch
                    checked={brand.status}
                    onChange={() => handleToggle(brand.rowId, 'status')}
                  />
                </td>
                <td>
                  <ToggleSwitch
                    checked={brand.adminVerified}
                    onChange={() => handleToggle(brand.rowId, 'adminVerified')}
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
      {showModal && (
        <AddBrand
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            console.log('Brand saved:', data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Brands;
