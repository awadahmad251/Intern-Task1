import { useState } from 'react';
import './AddBanner.css';

export default function AddBanner({ onClose, onSave }) {
  const [altText, setAltText] = useState('');
  const [city, setCity] = useState('');

  return (
    <div className="abn-overlay" onClick={onClose}>
      <div className="abn-modal" onClick={(event) => event.stopPropagation()}>
        <h2 className="abn-title">Add Banner</h2>

        <p className="abn-thumb-label">Upload Banner Image</p>
        <div className="abn-upload-box">
          <div className="abn-upload-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" fill="#fff0eb" stroke="#e07b54" strokeWidth="1.4" />
              <path d="M8.5 12.5l2.5 2.5 4-5" stroke="#e07b54" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8.5" cy="8.5" r="1" fill="#e07b54" />
            </svg>
          </div>
          <p className="abn-upload-text">
            <span className="abn-upload-link">Click to upload</span> or drag and drop
          </p>
          <p className="abn-upload-hint">JPG, PNG or PDF (max. 10MB)</p>
        </div>

        <input
          className="abn-input"
          type="text"
          placeholder="Enter Alternate Text"
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
        />

        <div className="abn-select-wrap">
          <select
            className="abn-select"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          >
            <option value="">Choose City</option>
            <option value="lahore">Lahore</option>
            <option value="karachi">Karachi</option>
            <option value="islamabad">Islamabad</option>
          </select>
          <span className="abn-select-arrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <div className="abn-footer">
          <button className="abn-cancel-btn" onClick={onClose} type="button">Cancel</button>
          <button className="abn-save-btn" onClick={() => onSave?.({ altText, city })} type="button">Save</button>
        </div>
      </div>
    </div>
  );
}
