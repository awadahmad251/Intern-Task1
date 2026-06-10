import React, { useRef, useState } from 'react';
import './AddBanner.css';
import { uploads } from '../api/client';

const AddBanner = ({ onClose, onSave, initialData = null, isEdit = false }) => {
  const [altText, setAltText] = useState(initialData?.altText || '');
  const [city, setCity] = useState(initialData?.city?._id || initialData?.city || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setUploadError('');
      const result = await uploads.uploadImage(file);
      setImageUrl(result.url);
    } catch (err) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="ab-overlay" onClick={onClose}>
      <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="ab-title">{isEdit ? 'Edit Banner' : 'Add Banner'}</h2>

        <p className="ab-thumb-label">Banner Image</p>
        <div className="ab-upload-box" role="button" tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Banner preview" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 6 }} />
          ) : (
            <>
              <div className="ab-upload-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" fill="#fff0eb" stroke="#e07b54" strokeWidth="1.4"/>
                  <path d="M8.5 12.5l2.5 2.5 4-5" stroke="#e07b54" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="8.5" r="1" fill="#e07b54"/>
                </svg>
              </div>
              <p className="ab-upload-text"><span className="ab-upload-link">Click to upload</span> or drag and drop</p>
              <p className="ab-upload-hint">JPG, PNG (max. 10MB)</p>
            </>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
        {uploading && <p className="ab-upload-hint">Uploading...</p>}
        {uploadError && <p className="ab-upload-hint" style={{ color: '#d63c3c' }}>{uploadError}</p>}

        <input className="ab-input" type="text" placeholder="Image URL (or upload above)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <input className="ab-input" type="text" placeholder="Alternate Text" value={altText} onChange={(e) => setAltText(e.target.value)} />

        <div className="ab-select-wrap">
          <select className="ab-select" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Choose City</option>
            <option value="lahore">Lahore</option>
            <option value="karachi">Karachi</option>
            <option value="islamabad">Islamabad</option>
          </select>
        </div>

        <div className="ab-footer">
          <button className="ab-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="ab-save-btn" onClick={() => onSave?.({ imageUrl, altText, city })}>
            {isEdit ? 'Save Changes' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBanner;
