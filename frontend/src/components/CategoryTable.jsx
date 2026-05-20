import React from 'react';
import './CategoryTable.css';
import ToggleSwitch from './ToggleSwitch';
import { MoreVertical, Check } from 'react-feather';
import wheatBag from '../assets/images/wheatbag.png';

const CustomCheckbox = ({ checked, onChange }) => (
  <div className={`custom-checkbox ${checked ? 'checked' : ''}`} onClick={onChange}>
    {checked && <Check className="tick" size={16} />}
  </div>
);

const CategoryTable = ({ categories, onSelect, onToggle, canEdit = true }) => {

  return (
    <table className="category-table">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Urdu Name</th>
          <th>ID</th>
          <th>Created on</th>
          <th>Active</th>
          <th>Admin Verified</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {categories.map(category => (
          <tr key={category._id || category.id}>
            <td>
              <CustomCheckbox checked={category.isSelected} onChange={() => onSelect?.(category._id || category.id)} />
            </td>
            <td>
              <div className="category-info-cell">
                <img src={category.imageUrl || wheatBag} alt={category.nameEn} className="category-image" />
                <span>{category.nameEn}</span>
              </div>
            </td>
            <td className="urdu-cell">{category.nameUr}</td>
            <td>{category._id?.slice(-6) || category.code}</td>
            <td>{new Date(category.createdAt || Date.now()).toLocaleDateString()}</td>
            <td><ToggleSwitch checked={category.active} onChange={() => onToggle?.(category._id || category.id, 'active', category)} disabled={!canEdit} /></td>
            <td><ToggleSwitch checked={category.adminVerified} onChange={() => onToggle?.(category._id || category.id, 'adminVerified', category)} disabled={!canEdit} /></td>
            <td className="action-cell">
              <MoreVertical className="action-icon" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoryTable;
