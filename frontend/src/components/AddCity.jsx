import { useState } from 'react';
import './AddCity.css';

export default function AddCity({ onClose, onSave, initialData = null }) {
  const [name, setName] = useState(initialData?.name || '');
  const isEditMode = Boolean(initialData);

  return (
    <div className="ac-overlay" onClick={onClose}>
      <div className="ac-modal" onClick={(event) => event.stopPropagation()}>
        <h2 className="ac-title">{isEditMode ? 'Edit City' : 'Add City'}</h2>
        <hr />

        <input
          className="ac-input"
          type="text"
          placeholder="City Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <hr />

        <div className="ac-footer">
          <button className="ac-cancel-btn" onClick={onClose} type="button">Cancel</button>
          <button className="ac-save-btn" onClick={() => onSave?.({ name })} type="button">{isEditMode ? 'Update' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}
