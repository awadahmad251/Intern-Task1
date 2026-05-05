import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Categories from '../components/Categories';
// import CreateCategory from '../components/CreateCategory';
import './CategoriesPage.css';

const CategoriesPage = () => {
  return (
    <div className="categories-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Categories />
      </div>
    </div>
  );
};

export default CategoriesPage;
