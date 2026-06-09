import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ message = 'Are you sure? This cannot be undone.', onConfirm, onCancel }) => (
  <div className="confirm-overlay" onClick={onCancel}>
    <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
      <div className="confirm-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#fff3f3" stroke="#f87171" strokeWidth="1.5"/>
          <path d="M12 7v5" stroke="#d63c3c" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="16" r="1" fill="#d63c3c"/>
        </svg>
      </div>
      <p className="confirm-text">{message}</p>
      <div className="confirm-actions">
        <button className="confirm-cancel-btn" onClick={onCancel}>Cancel</button>
        <button className="confirm-delete-btn" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
