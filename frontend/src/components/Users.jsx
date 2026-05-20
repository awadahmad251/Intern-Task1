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
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const isAdmin = isAdminUser();

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const openDetailsPanel = (user) => setSelectedUser(user);
    const closeDetailsPanel = () => setSelectedUser(null);

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
        const created = await api.post('/api/users', payload);
        setUsers((prev) => [{ ...created, isSelected: false }, ...prev]);
        closeModal();
      } catch (err) {
        setError(err.message || 'Failed to create user.');
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
      <UserTable users={visibleUsers} onRowClick={openDetailsPanel} onToggle={handleToggle} onDelete={handleDelete} canEdit={isAdmin} />
      {isModalOpen && <AddUserModal closeModal={closeModal} userType={activeTab} onSave={handleAddUser} />}
      {selectedUser && <UserDetailsPanel user={selectedUser} onBack={closeDetailsPanel} />}
    </div>
  );
};

export default Users;