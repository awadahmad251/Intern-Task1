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
import Loader from './components/Loader'
import PageLoader from "./components/PageLoader";
import { auth } from './api/client';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')));
  const [isAuthReady, setIsAuthReady] = useState(false);
  useEffect(() => {
    let mounted = true;

    const verifyAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        if (mounted) {
          setIsAuthenticated(false);
          setIsAuthReady(true);
        }
        return;
      }

      try {
        const result = await auth.me();
        localStorage.setItem('user', JSON.stringify(result.user));
        if (mounted) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (mounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setIsAuthReady(true);
        }
      }
    };

    verifyAuth();

    const syncAuth = () => setIsAuthenticated(Boolean(localStorage.getItem('token')));
    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth-changed', syncAuth);
    return () => {
      mounted = false;
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth-changed', syncAuth);
    };
  }, []);

  if (!isAuthReady) {
    return <Loader />;
  }

return (
  <Router>
    <PageLoader>
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
    </PageLoader>
  </Router>
);
}

export default App;
