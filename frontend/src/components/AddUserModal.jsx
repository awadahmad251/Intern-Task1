import React, { useRef, useState } from 'react';
import './AddUserModal.css';
import { uploads } from '../api/client';

const AddUserModal = ({ closeModal, userType, onSave }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    cnic: '',
    city: '',
    address: '',
    avatarUrl: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (field) => (event) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
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
    const roleMap = {
      'Sales Person': 'sales',
      'Warehouse Managers': 'warehouse',
      Retailers: 'retailer',
      Coordinators: 'coordinator',
    };

    onSave?.({
      ...formState,
      role: roleMap[userType] || 'user',
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Add {userType}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Profile Image</label>
            <div
              className="file-upload"
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              Click to upload or drag and drop
              <p>JPG, PNG (max. 10MB)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {uploading && <p>Uploading...</p>}
            {uploadError && <p className="upload-error">{uploadError}</p>}
            {formState.avatarUrl && (
              <div className="avatar-preview">
                <img src={formState.avatarUrl} alt="Preview" />
              </div>
            )}
          </div>
          <div className="form-group">
            <input type="text" placeholder="Name" value={formState.name} onChange={handleChange('name')} required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email" value={formState.email} onChange={handleChange('email')} required />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" value={formState.password} onChange={handleChange('password')} required />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Phone No." value={formState.phone} onChange={handleChange('phone')} />
          </div>
          <div className="form-group">
            <input type="text" placeholder="CNIC" value={formState.cnic} onChange={handleChange('cnic')} />
          </div>
          <div className="form-group">
            <select>
              <option>Choose City</option>
            </select>
          </div>
          <div className="form-group">
            <textarea placeholder="Address" value={formState.address} onChange={handleChange('address')}></textarea>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={closeModal}>Cancel</button>
            <button type="submit" disabled={uploading}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;