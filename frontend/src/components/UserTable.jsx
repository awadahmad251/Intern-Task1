import React, { useState } from 'react';
import './UserTable.css';
import ToggleSwitch from './ToggleSwitch';
import { MoreVertical, Eye } from 'react-feather';
const UserTable = ({ users, onRowClick, onToggle, onDelete, canEdit = true }) => {
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

  const handleDelete = (e, userId) => {
    e.stopPropagation();
    if (window.confirm('Delete this user?')) {
      onDelete?.(userId);
    }
    setOpenMenuId(null);
  };

    const handleSelectRow = (userId) => {
        onToggle?.(userId, 'isSelected', null);
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
          <tr key={user._id || user.id} >
          <td><input type="checkbox" checked={user.isSelected} onChange={() => handleSelectRow(user._id || user.id)} disabled={!canEdit} /></td>
          <td onClick={() => handleRowClick(user)}>
            <div className="user-info-cell">
              <img src={user.avatarUrl || user.avatar || 'https://randomuser.me/api/portraits/men/10.jpg'} alt={user.name} className="avatar" />
              <div>
                {user.name}
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          </td>
          <td onClick={() => handleRowClick(user)}>******</td>
          <td onClick={() => handleRowClick(user)}>{user.phone}</td>
          <td onClick={() => handleRowClick(user)}>{user.cnic}</td>
          <td onClick={() => handleRowClick(user)}>{user.earnings}</td>
          <td><ToggleSwitch checked={user.active} onChange={(e) => { e.stopPropagation(); onToggle?.(user._id || user.id, 'active', user); }} disabled={!canEdit} /></td>
          <td><ToggleSwitch checked={user.adminVerified} onChange={(e) => { e.stopPropagation(); onToggle?.(user._id || user.id, 'adminVerified', user); }} disabled={!canEdit} /></td>
          <td className="action-cell">
            <Eye className="action-icon" onClick={(e) => { e.stopPropagation(); handleRowClick(user); }} />
            {canEdit && (
              <>
                <MoreVertical className="action-icon" onClick={(e) => toggleMenu(e, user._id || user.id)} />
                {openMenuId === (user._id || user.id) && (
                  <div className="action-menu">
                    <button onClick={(e) => handleDelete(e, user._id || user.id)}>Delete</button>
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

export default UserTable;