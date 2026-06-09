import React, { useState } from 'react';
import './UserTable.css';
import ToggleSwitch from './ToggleSwitch';
import { MoreVertical, Eye } from 'react-feather';
import { formatPakCnic } from '../utils/formatters';
import ConfirmDialog from './ConfirmDialog';

const UserTable = ({ users, onRowClick, onToggle, onDelete, onEdit, canEdit = true }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleRowClick = (user) => { setOpenMenuId(null); onRowClick(user); };

  const toggleMenu = (e, userId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  const handleDelete = (e, userId) => {
    e.stopPropagation();
    setDeleteConfirmId(userId);
    setOpenMenuId(null);
  };

  const handleEdit = (e, user) => {
    e.stopPropagation();
    onEdit?.(user);
    setOpenMenuId(null);
  };

  return (
    <>
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
        {users.length === 0 ? (
          <tr><td colSpan={9} className="user-table-empty">No users found.</td></tr>
        ) : users.map(user => {
          const uid = user._id || user.id;
          return (
            <tr key={uid}>
              <td>
                <div
                  className={`user-checkbox ${user.isSelected ? 'checked' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onToggle?.(uid, 'isSelected', null); }}
                />
              </td>
              <td onClick={() => handleRowClick(user)}>
                <div className="user-info-cell">
                  <img src={user.avatarUrl || user.avatar || 'https://randomuser.me/api/portraits/men/10.jpg'} alt={user.name} className="avatar" />
                  <div>
                    <div className="user-name-text">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              </td>
              <td onClick={() => handleRowClick(user)}>••••••</td>
              <td onClick={() => handleRowClick(user)}>{user.phone}</td>
              <td onClick={() => handleRowClick(user)}>{formatPakCnic(user.cnic)}</td>
              <td onClick={() => handleRowClick(user)}>{user.earnings ? `${user.earnings}K` : '—'}</td>
              <td>
                <ToggleSwitch checked={user.active} onChange={(e) => { e.stopPropagation(); onToggle?.(uid, 'active', user); }} disabled={!canEdit} />
              </td>
              <td>
                <ToggleSwitch checked={user.adminVerified} onChange={(e) => { e.stopPropagation(); onToggle?.(uid, 'adminVerified', user); }} disabled={!canEdit} />
              </td>
              <td className="action-cell">
                <button type="button" className="icon-button" onClick={(e) => { e.stopPropagation(); handleRowClick(user); }}>
                  <Eye className="action-icon" />
                </button>
                {canEdit && (
                  <div style={{ position: 'relative' }}>
                    <button type="button" className="icon-button" onClick={(e) => toggleMenu(e, uid)}>
                      <MoreVertical className="action-icon" />
                    </button>
                    {openMenuId === uid && (
                      <div className="action-menu">
                        <button onClick={(e) => handleEdit(e, user)}>Edit</button>
                        <button onClick={(e) => handleDelete(e, uid)}>Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>

    {deleteConfirmId && (
      <ConfirmDialog
        message="Delete this user? This cannot be undone."
        onConfirm={() => { onDelete?.(deleteConfirmId); setDeleteConfirmId(null); }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    )}
    </>
  );
};

export default UserTable;
