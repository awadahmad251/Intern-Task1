import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ checked, onChange, disabled }) => (
  <label className={`toggle-switch ${disabled ? 'disabled' : ''}`}>
    <input type="checkbox" checked={!!checked} onChange={disabled ? undefined : onChange} disabled={disabled} />
    <span className="toggle-slider" />
  </label>
);

export default ToggleSwitch;
