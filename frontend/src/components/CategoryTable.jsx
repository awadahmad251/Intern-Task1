import React, { useState } from 'react';
import './CategoryTable.css';
import ToggleSwitch from './ToggleSwitch';
import { MoreVertical, Check } from 'react-feather';
import wheatBag from '../assets/images/wheatbag.png';

const CustomCheckbox = ({ checked, onChange }) => (
  <div className={`custom-checkbox ${checked ? 'checked' : ''}`} onClick={onChange}>
    {checked && <Check className="tick" size={16} />}
  </div>
);

const CategoryTable = ({ categories, onSelect, onToggle, onEdit, onDelete, canEdit = true }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (event, categoryId) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === categoryId ? null : categoryId);
  };

  const handleEdit = (event, category) => {
    event.stopPropagation();
    onEdit?.(category);
    setOpenMenuId(null);
  };

  const handleDelete = (event, categoryId) => {
    event.stopPropagation();
    onDelete?.(categoryId);
    setOpenMenuId(null);
  };

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
        {categories.length === 0 && (
          <tr>
            <td className="table-empty" colSpan={8}>No data available</td>
          </tr>
        )}
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
            <td className="category-action-cell">
              {canEdit && (
                <>
                  <button type="button" className="category-dots" onClick={(event) => toggleMenu(event, category._id || category.id)}>
                    <MoreVertical className="action-icon" />
                  </button>
                  {openMenuId === (category._id || category.id) && (
                    <div className="category-action-menu">
                      <button type="button" onClick={(event) => handleEdit(event, category)}>Edit</button>
                      <button type="button" onClick={(event) => handleDelete(event, category._id || category.id)}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoryTable;
