import React, { useState } from 'react';
import './Users.css';
import UserTable from './UserTable';
import AddUserModal from './AddUserModal';
import UserDetailsPanel from './UserDetailsPanel';

const Users = () => {
    const [activeTab, setActiveTab] = useState('Sales Person');
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const openDetailsPanel = (user) => setSelectedUser(user);
    const closeDetailsPanel = () => setSelectedUser(null);

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
            <input type="text" placeholder="Search by name, role..." />
            <select>
                <option>City</option>
            </select>
            <select>
                <option>Status</option>
            </select>
            <button className="add-user-btn" onClick={openModal}>+ Add {activeTab}</button>
        </div>
      </div>
      <UserTable onRowClick={openDetailsPanel} />
      {isModalOpen && <AddUserModal closeModal={closeModal} userType={activeTab} />}
      {selectedUser && <UserDetailsPanel user={selectedUser} onBack={closeDetailsPanel} />}
    </div>
  );
};

export default Users;