import React, { useEffect, useState } from 'react';
import './Products.css';
import { Search } from 'react-feather';
import ProductTable from './ProductTable';
import AddProductModal from './AddProductModal';
import { api, isAdminUser } from '../api/client';

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    api.get('/api/categories').then(setCategories).catch(() => {});
    api.get('/api/brands').then(setBrands).catch(() => {});
    api.get('/api/cities').then(setCities).catch(() => {});
  }, []);

  const visibleProducts = products.filter((product) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return true;
    }

    const values = [
      product.nameEn,
      product.nameUr,
      product.code,
      product.brand?.nameEn,
      product.category?.nameEn,
      product.city?.name,
    ].filter(Boolean);

    return values.some((value) => String(value).toLowerCase().includes(query));
  });

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
            <input type="text" placeholder="Search by name, id..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
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
      <ProductTable products={visibleProducts} setProducts={setProducts} setError={setError} canEdit={isAdmin} />
      {isModalOpen && isAdmin && <AddProductModal onClose={toggleModal} onSave={handleCreateProduct} categories={categories} brands={brands} cities={cities} />}
    </div>
  );
};

export default Products;
