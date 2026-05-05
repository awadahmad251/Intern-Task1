import React, { useState } from 'react';
import './AddBrand.css';

const AddBrand = ({ onClose, onSave }) => {
  const [nameEn, setNameEn] = useState('');
  const [nameUr, setNameUr] = useState('');
  const [commission, setCommission] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  return (
    <div className="ab-overlay" onClick={onClose}>
      <div className="ab-modal" onClick={(e) => e.stopPropagation()}>

        <h2 className="ab-title">Add Brand</h2>

        <p className="ab-thumb-label">Thumbnail</p>
        <div className="ab-upload-box">
          <div className="ab-upload-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" fill="#fff0eb" stroke="#e07b54" strokeWidth="1.4" />
              <path d="M8.5 12.5l2.5 2.5 4-5" stroke="#e07b54" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8.5" cy="8.5" r="1" fill="#e07b54" />
            </svg>
          </div>
          <p className="ab-upload-text">
            <span className="ab-upload-link">Click to upload</span> or drag and drop
          </p>
          <p className="ab-upload-hint">JPG, PNG (max. 10MB)</p>
        </div>

        <input
          className="ab-input"
          type="text"
          placeholder="Name in English"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
        />

        <input
          className="ab-input"
          type="text"
          placeholder="Name in Urdu"
          value={nameUr}
          onChange={(e) => setNameUr(e.target.value)}
        />

        <input
          className="ab-input"
          type="text"
          placeholder="Commission (%)"
          value={commission}
          onChange={(e) => setCommission(e.target.value)}
        />

        <div className="ab-select-wrap">
          <select
            className="ab-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose Category</option>
            <option value="lahore">Lahore</option>
            <option value="karachi">Karachi</option>
            <option value="islamabad">Islamabad</option>
          </select>
          <span className="ab-select-arrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <div className="ab-select-wrap">
          <select
            className="ab-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Choose City</option>
            <option value="lahore">Lahore</option>
            <option value="karachi">Karachi</option>
            <option value="islamabad">Islamabad</option>
          </select>
          <span className="ab-select-arrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <div className="ab-footer">
          <button className="ab-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="ab-save-btn" onClick={() => onSave?.({ nameEn, nameUr, commission, category, city })}>Save</button>
        </div>

      </div>
    </div>
  );
};

export default AddBrand;
