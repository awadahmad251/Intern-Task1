import React, { useState } from 'react';
import './UserTable.css';
import ToggleSwitch from './ToggleSwitch';
import { MoreVertical, Eye } from 'react-feather';

const initialUsersData = [
    { id: 1, name: 'Lincoln Bergson', email: 'alinzami@gmail.com', password: 'abs1121', phone: '0332 22525151', cnic: '36202-2925920-2', earnings: '14K', active: true, adminVerified: true, avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Cristofer Lipshutz', email: 'alinzami@gmail.com', password: 'abs1121', phone: '0332 22525151', cnic: '36202-2925920-2', earnings: '14K', active: true, adminVerified: true, avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: 3, name: 'Zain Stanton', email: 'alinzami@gmail.com', password: 'abs1121', phone: '0332 22525151', cnic: '36202-2925920-2', earnings: '14K', active: false, adminVerified: true, avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { id: 4, name: 'Angel Franci', email: 'alinzami@gmail.com', password: 'abs1121', phone: '0332 22525151', cnic: '36202-2925920-2', earnings: '14K', active: true, adminVerified: false, avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { id: 5, name: 'Martin Baptista', email: 'alinzami@gmail.com', password: 'abs1121', phone: '0332 22525151', cnic: '36202-2925920-2', earnings: '14K', active: true, adminVerified: true, avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
];

const UserTable = ({ onRowClick }) => {
  const [users, setUsers] = useState(initialUsersData.map(u => ({...u, isSelected: false})));
  const [openMenuId, setOpenMenuId] = useState(null);

  // removed per-row action menu; clicking the 3-dots now opens a small Edit/Delete menu

  const handleRowClick = (user) => {
    setOpenMenuId(null);
    onRowClick(user);
  };

  const toggleMenu = (e, userId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  const handleEdit = (e, user) => {
    e.stopPropagation();
    alert(`Edit user: ${user.name}`);
    setOpenMenuId(null);
  };

  const handleDelete = (e, userId) => {
    e.stopPropagation();
    if (window.confirm('Delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
    setOpenMenuId(null);
  };

    const handleToggle = (userId, field) => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, [field]: !user[field] } : user
        ));
    };

    const handleSelectRow = (userId) => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, isSelected: !user.isSelected } : user
        ));
    };

    


  return (
    <table className="user-table">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Password</th>
          <th>Phone No</th>
          <th>CNIC</th>
          <th>Earnings</th>
          <th>Active</th>
          <th>Admin Verified</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} >
          <td><input type="checkbox" checked={user.isSelected} onChange={() => handleSelectRow(user.id)} /></td>
          <td onClick={() => handleRowClick(user)}>
            <div className="user-info-cell">
              <img src={user.avatar} alt={user.name} className="avatar" />
              <div>
                {user.name}
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          </td>
          <td onClick={() => handleRowClick(user)}>{user.password}</td>
          <td onClick={() => handleRowClick(user)}>{user.phone}</td>
          <td onClick={() => handleRowClick(user)}>{user.cnic}</td>
          <td onClick={() => handleRowClick(user)}>{user.earnings}</td>
          <td><ToggleSwitch checked={user.active} onChange={(e) => { e.stopPropagation(); handleToggle(user.id, 'active'); }} /></td>
          <td><ToggleSwitch checked={user.adminVerified} onChange={(e) => { e.stopPropagation(); handleToggle(user.id, 'adminVerified'); }} /></td>
          <td className="action-cell">
            <Eye className="action-icon" onClick={(e) => { e.stopPropagation(); handleRowClick(user); }} />
            <MoreVertical className="action-icon" onClick={(e) => toggleMenu(e, user.id)} />
            {openMenuId === user.id && (
              <div className="action-menu">
                <button onClick={(e) => handleEdit(e, user)}>Edit</button>
                <button onClick={(e) => handleDelete(e, user.id)}>Delete</button>
              </div>
            )}
          </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;