import React, { useRef, useState } from 'react';
import './AddUserModal.css';
import { uploads } from '../api/client';
import { digitsOnly, formatPakCnic } from '../utils/formatters';

const AddUserModal = ({ closeModal, userType, onSave, initialData = null, forcedRole = '' }) => {
  const [formState, setFormState] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    phone: initialData?.phone || '',
    cnic: initialData?.cnic || '',
    city: initialData?.city?._id || initialData?.city || '',
    address: initialData?.address || '',
    avatarUrl: initialData?.avatarUrl || '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (field) => (event) => {
    const rawValue = event.target.value;
    const nextValue = field === 'phone'
      ? rawValue.replace(/\D/g, '').slice(0, 11)
      : field === 'cnic'
        ? digitsOnly(rawValue).slice(0, 13)
        : rawValue;
    setFormError('');
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
      setFormError('Contact number must be exactly 11 digits.');
      return;
    }
    if (formState.cnic && !/^\d{13}$/.test(formState.cnic)) {
      setFormError('CNIC must be exactly 13 digits.');
      return;
    }
    const roleMap = {
      'Sales Person': 'sales',
      'Warehouse Managers': 'warehouse',
      Retailers: 'retailer',
      Coordinators: 'coordinator',
    };

    const out = {
      ...formState,
      role: forcedRole || roleMap[userType] || 'user',
    };
    console.log('[addUserModal] submit payload:', out);
    onSave?.(out);
  };

  const isEditMode = Boolean(initialData);

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{isEditMode ? `Edit ${userType}` : `Add ${userType}`}</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
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
            <input name="fullName" autoComplete="off" type="text" placeholder="Name" value={formState.name} onChange={handleChange('name')} required />
          </div>
          <div className="form-group">
            <input name="email" autoComplete="off" type="email" placeholder="Email" value={formState.email} onChange={handleChange('email')} required />
          </div>
          <div className="form-group">
            <input name="password" autoComplete="new-password" type="password" placeholder={isEditMode ? 'New Password (leave blank to keep current)' : 'Password'} value={formState.password} onChange={handleChange('password')} required={!isEditMode} />
          </div>
          <div className="form-group">
            <input name="phone" autoComplete="off" type="text" inputMode="numeric" maxLength="11" placeholder="Phone No." value={formState.phone} onChange={handleChange('phone')} />
          </div>
          <div className="form-group">
            <input name="cnic" autoComplete="off" type="text" inputMode="numeric" maxLength="15" placeholder="12345-1234567-1" value={formatPakCnic(formState.cnic)} onChange={handleChange('cnic')} />
          </div>
          <div className="form-group">
            <select name="city" autoComplete="off">
              <option>Choose City</option>
            </select>
          </div>
          <div className="form-group">
            <textarea name="address" autoComplete="off" placeholder="Address" value={formState.address} onChange={handleChange('address')}></textarea>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={closeModal}>Cancel</button>
            <button type="submit" disabled={uploading}>{isEditMode ? 'Update' : 'Save'}</button>
          </div>
          {formError && <p className="upload-error">{formError}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;