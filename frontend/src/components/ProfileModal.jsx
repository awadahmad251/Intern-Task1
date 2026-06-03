import React, { useRef, useState } from 'react';
import './ProfileModal.css';
import { uploads } from '../api/client';

const ProfileModal = ({ user, onClose, onSave, saving = false }) => {
  const [formState, setFormState] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatarUrl: user?.avatarUrl || '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (field) => (event) => {
    const rawValue = event.target.value;
    const nextValue = field === 'phone' ? rawValue.replace(/\D/g, '').slice(0, 11) : rawValue;
    setFormState((prev) => ({ ...prev, [field]: nextValue }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setUploadError('');
      const result = await uploads.uploadImage(file);
      setFormState((prev) => ({ ...prev, avatarUrl: result.url }));
    } catch (err) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formState.phone && !/^\d{11}$/.test(formState.phone)) {
      setUploadError('Phone number must be exactly 11 digits.');
      return;
    }
    onSave?.(formState);
  };

  return (
    <div className="profile-modal-backdrop" onClick={onClose}>
      <div className="profile-modal-content" onClick={(event) => event.stopPropagation()}>
        <h2>Edit Admin Profile</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="profile-image-row">
            <img
              className="profile-preview"
              src={formState.avatarUrl || 'https://i.pravatar.cc/150?img=12'}
              alt="Admin profile preview"
            />
            <div>
              <button type="button" className="upload-trigger" onClick={() => fileInputRef.current?.click()}>
                Change photo
              </button>
              <p>PNG or JPG up to 10 MB</p>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
          {uploadError && <p className="profile-error">{uploadError}</p>}
          <label className="profile-field">
            <span>Name</span>
            <input type="text" value={formState.name} onChange={handleChange('name')} required />
          </label>
          <label className="profile-field">
            <span>Email</span>
            <input type="email" value={user?.email || ''} readOnly />
          </label>
          <label className="profile-field">
            <span>Phone</span>
            <input type="text" inputMode="numeric" maxLength="11" value={formState.phone} onChange={handleChange('phone')} placeholder="Optional" />
          </label>
          <div className="profile-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;