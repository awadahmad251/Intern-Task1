import React from 'react';
import './CityTable.css';
import ToggleSwitch from './ToggleSwitch';
import { MoreVertical, Check } from 'react-feather';

const CustomCheckbox = ({ checked, onChange }) => (
  <div className={`custom-checkbox ${checked ? 'checked' : ''}`} onClick={onChange}>
    {checked && <Check className="tick" size={16} />}
  </div>
);

const CityTable = ({ cities, onSelect, onToggle, canEdit = true }) => {

  return (
    <div className="cities-table-wrap">
      <table className="cities-table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Created Date</th>
            <th>Active</th>
            <th>Admin Verified</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city._id || city.id}>
              <td>
                <CustomCheckbox checked={city.isSelected} onChange={() => onSelect?.(city._id || city.id)} />
              </td>
              <td>{city._id?.slice(-6) || city.id}</td>
              <td>{city.name}</td>
              <td>
                <div className="cities-date">
                  <span>{new Date(city.createdAt || Date.now()).toLocaleDateString()}</span>
                  <span className="cities-time">{new Date(city.createdAt || Date.now()).toLocaleTimeString()}</span>
                </div>
              </td>
              <td>
                <ToggleSwitch checked={city.active} onChange={() => onToggle?.(city._id || city.id, 'active', city)} disabled={!canEdit} />
              </td>
              <td>
                <ToggleSwitch checked={city.adminVerified} onChange={() => onToggle?.(city._id || city.id, 'adminVerified', city)} disabled={!canEdit} />
              </td>
              <td>
                <button className="cities-dots" type="button">
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CityTable;
