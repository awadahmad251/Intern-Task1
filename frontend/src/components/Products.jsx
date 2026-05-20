import React, { useEffect, useState } from 'react';
import './Products.css';
import { Search } from 'react-feather';
import ProductTable from './ProductTable';
import AddProductModal from './AddProductModal';
import { api, isAdminUser } from '../api/client';

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const isAdmin = isAdminUser();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const loadProducts = async () => {
    try {
      const data = await api.get('/api/products');
      setProducts(data.map((product) => ({ ...product, isSelected: false })));
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreateProduct = async (payload) => {
    try {
      const created = await api.post('/api/products', payload);
      setProducts((prev) => [{ ...created, isSelected: false }, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to create product.');
    }
  };

  return (
    <div className="products-container">
      <div className="page-header">
        <h1>Products</h1>
        <div className="toolbar">
          <div className="search-input">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search by name, id..." />
          </div>
          <select className="toolbar-select">
            <option>City</option>
          </select>
          <select className="toolbar-select">
            <option>Brand</option>
          </select>
          <select className="toolbar-select">
            <option>Category</option>
          </select>
          <select className="toolbar-select">
            <option>Status</option>
          </select>
          {isAdmin && (
            <button className="add-product-btn" onClick={toggleModal}>
              <span className="add-icon">+</span>
              Add Product
            </button>
          )}
        </div>
      </div>
      {error && <div className="products-error">{error}</div>}
      <ProductTable products={products} setProducts={setProducts} setError={setError} canEdit={isAdmin} />
      {isModalOpen && isAdmin && <AddProductModal onClose={toggleModal} onSave={handleCreateProduct} />}
    </div>
  );
};

export default Products;
