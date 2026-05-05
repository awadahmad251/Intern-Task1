import React, { useState } from 'react';
import './CityTable.css';
import ToggleSwitch from './ToggleSwitch';
import { MoreVertical, Check } from 'react-feather';

const initialCities = [
  { id: '#C26000', name: 'Kohat', date: '24/10/2022', time: '12:35 Pm', active: true, adminVerified: true, isSelected: true },
  { id: '#C27000', name: 'Islamabad', date: '24/10/2022', time: '12:35 Pm', active: true, adminVerified: true, isSelected: false },
  { id: '#C28000', name: 'Lahore', date: '24/10/2022', time: '12:35 Pm', active: true, adminVerified: true, isSelected: false },
  { id: '#C29000', name: 'Gujranwala', date: '24/10/2022', time: '12:35 Pm', active: true, adminVerified: true, isSelected: false },
  { id: '#C30000', name: 'DG Khan', date: '24/10/2022', time: '12:35 Pm', active: true, adminVerified: true, isSelected: false },
  { id: '#C31000', name: 'DI Khan', date: '24/10/2022', time: '12:35 Pm', active: true, adminVerified: true, isSelected: false },
  { id: '#C32000', name: 'Multan', date: '24/10/2022', time: '12:35 Pm', active: true, adminVerified: true, isSelected: false },
  { id: '#C33000', name: 'Jand', date: '24/10/2022', time: '12:35 Pm', active: true, adminVerified: true, isSelected: false },
];

const CustomCheckbox = ({ checked, onChange }) => (
  <div className={`custom-checkbox ${checked ? 'checked' : ''}`} onClick={onChange}>
    {checked && <Check className="tick" size={16} />}
  </div>
);

const CityTable = () => {
  const [cities, setCities] = useState(initialCities);

  const handleSelectCity = (cityId) => {
    setCities(cities.map(city => city.id === cityId ? { ...city, isSelected: !city.isSelected } : city));
  };

  const handleToggle = (cityId, field) => {
    setCities(cities.map(city => city.id === cityId ? { ...city, [field]: !city[field] } : city));
  };

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
            <tr key={city.id}>
              <td>
                <CustomCheckbox checked={city.isSelected} onChange={() => handleSelectCity(city.id)} />
              </td>
              <td>{city.id}</td>
              <td>{city.name}</td>
              <td>
                <div className="cities-date">
                  <span>{city.date}</span>
                  <span className="cities-time">{city.time}</span>
                </div>
              </td>
              <td>
                <ToggleSwitch checked={city.active} onChange={() => handleToggle(city.id, 'active')} />
              </td>
              <td>
                <ToggleSwitch checked={city.adminVerified} onChange={() => handleToggle(city.id, 'adminVerified')} />
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
