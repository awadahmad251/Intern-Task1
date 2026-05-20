import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import BrandsPage from './pages/BrandsPage';
import OrdersPage from './pages/OrdersPage';
import CitiesPage from './pages/CitiesPage';
import BannerPage from './pages/BannerPage';
import LogsPage from './pages/LogsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')));

  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(Boolean(localStorage.getItem('token')));
    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth-changed', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth-changed', syncAuth);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />} />
        <Route path="/users" element={isAuthenticated ? <UsersPage /> : <Navigate to="/" />} />
        <Route path="/products" element={isAuthenticated ? <ProductsPage /> : <Navigate to="/" />} />
        <Route path="/categories" element={isAuthenticated ? <CategoriesPage /> : <Navigate to="/" />} />
        <Route path="/brands" element={isAuthenticated ? <BrandsPage /> : <Navigate to="/" />} /> 
        <Route path="/orders" element={isAuthenticated ? <OrdersPage /> : <Navigate to="/" />} />
        <Route path="/cities" element={isAuthenticated ? <CitiesPage /> : <Navigate to="/" />} />
        <Route path="/banner" element={isAuthenticated ? <BannerPage /> : <Navigate to="/" />} />
        <Route path="/logs" element={isAuthenticated ? <LogsPage /> : <Navigate to="/" />} />
        <Route path="/privacy-policy" element={isAuthenticated ? <PrivacyPolicyPage /> : <Navigate to="/" />} />
        <Route path="/terms-conditions" element={isAuthenticated ? <TermsConditionsPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
