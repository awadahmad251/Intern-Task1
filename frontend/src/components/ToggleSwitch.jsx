import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ checked, onChange, disabled = false }) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
      <span className="slider round"></span>
    </label>
  );
};

export default ToggleSwitch;
