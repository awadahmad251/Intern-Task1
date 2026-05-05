import React, { useState } from 'react';
import { Search } from 'react-feather';
import './Cities.css';
import CityTable from './CityTable';
import AddCity from './AddCity';

const Cities = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="cities-container">
      <div className="cities-topbar">
        <h1 className="cities-heading">Cities</h1>
        <div className="cities-toolbar">
          <div className="cities-search">
            <Search size={15} className="cities-search-icon" />
            <input type="text" placeholder="Search by order id, price..." className="cities-search-input" />
          </div>
          <button className="cities-filter-btn" type="button">
            Status
            <span className="cities-caret" />
          </button>
          <button className="cities-add-btn" type="button" onClick={() => setShowModal(true)}>
            + Add City
          </button>
        </div>
      </div>

      <CityTable />

      {showModal && <AddCity onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Cities;
