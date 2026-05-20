import React, { useEffect, useState } from 'react';
import './Users.css';
import UserTable from './UserTable';
import AddUserModal from './AddUserModal';
import UserDetailsPanel from './UserDetailsPanel';
import { api, isAdminUser } from '../api/client';

const roleByTab = {
  'Sales Person': 'sales',
  'Warehouse Managers': 'warehouse',
  Retailers: 'retailer',
  Coordinators: 'coordinator',
};

const Users = () => {
    const [activeTab, setActiveTab] = useState('Sales Person');
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const isAdmin = isAdminUser();

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const openModal = () => {
      setError('');
      setEditingUser(null);
      setModalOpen(true);
    };
    const closeModal = () => {
      setModalOpen(false);
      setEditingUser(null);
    };

    const openDetailsPanel = (user) => setSelectedUser(user);
    const closeDetailsPanel = () => setSelectedUser(null);

    const handleEditUser = (user) => {
      setError('');
      setEditingUser(user);
      setModalOpen(true);
    };

    const loadUsers = async () => {
      try {
        const data = await api.get('/api/users');
        setUsers(data.map((user) => ({ ...user, isSelected: false })));
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load users.');
      }
    };

    useEffect(() => {
      loadUsers();
    }, []);

    const handleToggle = async (userId, field, user) => {
      if (field === 'isSelected') {
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isSelected: !u.isSelected } : u)));
        return;
      }

      try {
        const updated = await api.put(`/api/users/${userId}`, { [field]: !user[field] });
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, ...updated } : u)));
      } catch (err) {
        setError(err.message || 'Failed to update user.');
      }
    };

    const handleDelete = async (userId) => {
      try {
        await api.del(`/api/users/${userId}`);
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } catch (err) {
        setError(err.message || 'Failed to delete user.');
      }
    };

    const handleAddUser = async (payload) => {
      try {
        setError('');
        const safePayload = { ...payload };
        if (editingUser && !safePayload.password) {
          delete safePayload.password;
        }
        const request = editingUser
          ? api.put(`/api/users/${editingUser._id || editingUser.id}`, safePayload)
          : api.post('/api/users', safePayload);
        const saved = await request;
        setUsers((prev) => {
          if (editingUser) {
            return prev.map((user) => ((user._id || user.id) === (editingUser._id || editingUser.id)
              ? { ...user, ...saved, isSelected: user.isSelected }
              : user));
          }
          return [{ ...saved, isSelected: false }, ...prev];
        });
        closeModal();
      } catch (err) {
        setError(err.message || `Failed to ${editingUser ? 'update' : 'create'} user.`);
      }
    };

  const visibleUsers = users.filter((user) => {
    const activeRole = roleByTab[activeTab];
    const matchesRole = activeRole ? user.role === activeRole : true;
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = !query || [user.name, user.email, user.phone, user.cnic, user.role]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="users-container">
      <div className="tabs">
        <button onClick={() => handleTabClick('Sales Person')} className={activeTab === 'Sales Person' ? 'active' : ''}>Sales Person</button>
        <button onClick={() => handleTabClick('Warehouse Managers')} className={activeTab === 'Warehouse Managers' ? 'active' : ''}>Warehouse Managers</button>
        <button onClick={() => handleTabClick('Retailers')} className={activeTab === 'Retailers' ? 'active' : ''}>Retailers</button>
        <button onClick={() => handleTabClick('Coordinators')} className={activeTab === 'Coordinators' ? 'active' : ''}>Coordinators</button>
      </div>
      <div className="page-header">
        <h1>{activeTab}</h1>
        <div className="toolbar">
          <input type="text" placeholder="Search by name, role..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            <select>
                <option>City</option>
            </select>
            <select>
                <option>Status</option>
            </select>
            {isAdmin && (
              <button className="add-user-btn" onClick={openModal}>+ Add {activeTab}</button>
            )}
        </div>
      </div>
      {error && <div className="users-error">{error}</div>}
      <UserTable users={visibleUsers} onRowClick={openDetailsPanel} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEditUser} canEdit={isAdmin} />
      {isModalOpen && <AddUserModal closeModal={closeModal} userType={activeTab} onSave={handleAddUser} initialData={editingUser} forcedRole={roleByTab[activeTab]} />}
      {selectedUser && <UserDetailsPanel user={selectedUser} onBack={closeDetailsPanel} />}
    </div>
  );
};

export default Users;