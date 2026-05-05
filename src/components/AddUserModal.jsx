import React from 'react';
import './AddUserModal.css';

const AddUserModal = ({ closeModal, userType }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Add {userType}</h2>
        <form>
          <div className="form-group">
            <label>Profile Image</label>
            <div className="file-upload">
              Click to upload or drag and drop
              <p>JPG, PNG (max. 10MB)</p>
            </div>
          </div>
          <div className="form-group">
            <input type="text" placeholder="Name" />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email" />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Phone No." />
          </div>
          <div className="form-group">
            <input type="text" placeholder="CNIC" />
          </div>
          <div className="form-group">
            <select>
              <option>Choose City</option>
            </select>
          </div>
          <div className="form-group">
            <textarea placeholder="Address"></textarea>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={closeModal}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;