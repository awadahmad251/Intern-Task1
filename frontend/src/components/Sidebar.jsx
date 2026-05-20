import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Sidebar.css';
import dashboardIcon from '../assets/dashboard-icon.svg';
import usersIcon from '../assets/users-icon.svg';
import productsIcon from '../assets/products-icon.svg';
import categoriesIcon from '../assets/categories-icon.svg';
import brandsIcon from '../assets/brands-icon.svg';
import ordersIcon from '../assets/orders-icon.svg';
import citiesIcon from '../assets/cities-icon.svg';
import bannerIcon from '../assets/banner-icon.svg';
import logsIcon from '../assets/logs-icon.svg';
import privacyIcon from '../assets/privacy-icon.svg';
import termsIcon from '../assets/terms-icon.svg';
import logoutIcon from '../assets/logout-icon.svg';

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="sidebar">
      <div className="logo">Karyana</div>
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              <img src={dashboardIcon} alt="Dashboard" className="sidebar-icon" />
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
              <img src={usersIcon} alt="Users" className="sidebar-icon" />
              Users
            </NavLink>
          </li>

          <li>
            <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
              <img src={productsIcon} alt="Products" className="sidebar-icon" />
              Products
            </NavLink>
          </li>

          <li>
            <NavLink to="/categories" className={({ isActive }) => isActive ? 'active' : ''}>
              <img src={categoriesIcon} alt="Categories" className="sidebar-icon" />
              Categories
            </NavLink>
          </li>

          <li>
            <NavLink to="/brands" className={({ isActive }) => isActive ? 'active' : ''}>
              <img src={brandsIcon} alt="Brands" className="sidebar-icon" />
              Brands
            </NavLink>
          </li>

          <li>
            <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>
              <img src={ordersIcon} alt="Orders" className="sidebar-icon" />
              Orders
            </NavLink>
          </li>

          <li>
            <NavLink to="/cities" className={({ isActive }) => isActive ? 'active' : ''}>
              <img src={citiesIcon} alt="Cities" className="sidebar-icon" />
              Cities
            </NavLink>
          </li>

          <li>
            <NavLink to="/banner" className={({ isActive }) => isActive ? 'active' : ''}>
              <img src={bannerIcon} alt="Banner" className="sidebar-icon" />
              Banner
            </NavLink>
          </li>

          <li>
            <NavLink to="/logs" className={({ isActive }) => isActive ? 'active' : ''}>
              <img src={logsIcon} alt="Logs" className="sidebar-icon" />
              Logs
            </NavLink>
          </li>

          <li>
            <NavLink to="/privacy-policy" className={({ isActive }) => isActive ? 'active' : ''}>
              <img src={privacyIcon} alt="Privacy Policy" className="sidebar-icon" />
              Privacy Policy
            </NavLink>
          </li>

          <li>
            <NavLink to="/terms-conditions" className={({ isActive }) => isActive ? 'active' : ''}>
              <img src={termsIcon} alt="Terms & Conditions" className="sidebar-icon" />
              Terms & Conditions
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="logout">
        <Link to="/" onClick={handleLogout}>
          <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;