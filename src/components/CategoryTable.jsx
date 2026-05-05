import React, { useState } from 'react';
import './CategoryTable.css';
import ToggleSwitch from './ToggleSwitch';
import { MoreVertical, Check } from 'react-feather';
import wheatBag from '../assets/images/wheatbag.png';

const initialCategories = [
  { id: 1, name: 'Wheat', urduName: 'گندم', code: '#P321', createdOn: '24/10/2022', active: true, adminVerified: true, image: wheatBag, isSelected: true },
  { id: 2, name: 'Wheat', urduName: 'گندم', code: '#P321', createdOn: '24/10/2022', active: true, adminVerified: true, image: wheatBag, isSelected: false },
  { id: 3, name: 'Wheat', urduName: 'گندم', code: '#P321', createdOn: '24/10/2022', active: true, adminVerified: true, image: wheatBag, isSelected: false },
  { id: 4, name: 'Wheat', urduName: 'گندم', code: '#P321', createdOn: '24/10/2022', active: true, adminVerified: true, image: wheatBag, isSelected: true },
  { id: 5, name: 'Wheat', urduName: 'گندم', code: '#P321', createdOn: '24/10/2022', active: true, adminVerified: true, image: wheatBag, isSelected: false },
  { id: 6, name: 'Wheat', urduName: 'گندم', code: '#P321', createdOn: '24/10/2022', active: true, adminVerified: true, image: wheatBag, isSelected: false },
  { id: 7, name: 'Wheat', urduName: 'گندم', code: '#P321', createdOn: '24/10/2022', active: true, adminVerified: true, image: wheatBag, isSelected: false },
];

const CustomCheckbox = ({ checked, onChange }) => (
  <div className={`custom-checkbox ${checked ? 'checked' : ''}`} onClick={onChange}>
    {checked && <Check className="tick" size={16} />}
  </div>
);

const CategoryTable = () => {
  const [categories, setCategories] = useState(initialCategories);

  const handleSelectCategory = (categoryId) => {
    setCategories(categories.map(c => c.id === categoryId ? { ...c, isSelected: !c.isSelected } : c));
  };

  const handleToggle = (categoryId, field) => {
    setCategories(categories.map(c => c.id === categoryId ? { ...c, [field]: !c[field] } : c));
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
        {categories.map(category => (
          <tr key={category.id}>
            <td>
              <CustomCheckbox checked={category.isSelected} onChange={() => handleSelectCategory(category.id)} />
            </td>
            <td>
              <div className="category-info-cell">
                <img src={category.image} alt={category.name} className="category-image" />
                <span>{category.name}</span>
              </div>
            </td>
            <td className="urdu-cell">{category.urduName}</td>
            <td>{category.code}</td>
            <td>{category.createdOn}</td>
            <td><ToggleSwitch checked={category.active} onChange={() => handleToggle(category.id, 'active')} /></td>
            <td><ToggleSwitch checked={category.adminVerified} onChange={() => handleToggle(category.id, 'adminVerified')} /></td>
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
