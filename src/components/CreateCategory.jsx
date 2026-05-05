import { useState } from "react";
import "./CreateCategory.css";

export default function CreateCategory({ onClose, onSave }) {
  const [nameEn, setNameEn] = useState("");
  const [nameUr, setNameUr] = useState("");
  const [city, setCity] = useState("");

  return (
    <div className="cc-overlay" onClick={onClose}>
      <div className="cc-modal" onClick={(e) => e.stopPropagation()}>

        <h2 className="cc-title">Create Category</h2>

        <p className="cc-thumb-label">Thumbnail</p>

        <div className="cc-upload-box">
          <div className="cc-upload-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" fill="#fff0eb" stroke="#e07b54" strokeWidth="1.4"/>
              <path d="M8.5 12.5l2.5 2.5 4-5" stroke="#e07b54" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8.5" cy="8.5" r="1" fill="#e07b54"/>
            </svg>
          </div>
          <p className="cc-upload-text">
            <span className="cc-upload-link">Click to upload</span> or drag and drop
          </p>
          <p className="cc-upload-hint">JPG, PNG (max. 10MB)</p>
        </div>

        <input
          className="cc-input"
          type="text"
          placeholder="Name in English"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
        />

        <input
          className="cc-input"
          type="text"
          placeholder="Name in Urdu"
          value={nameUr}
          onChange={(e) => setNameUr(e.target.value)}
        />

        <div className="cc-select-wrap">
          <select
            className="cc-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Choose City</option>
            <option value="lahore">Lahore</option>
            <option value="karachi">Karachi</option>
            <option value="islamabad">Islamabad</option>
          </select>
          <span className="cc-select-arrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>

        <div className="cc-footer">
          <button className="cc-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="cc-save-btn" onClick={() => onSave?.({ nameEn, nameUr, city })}>Save</button>
        </div>

      </div>
    </div>
  );
}
