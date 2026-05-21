import React, { useEffect, useState } from 'react';
import './Products.css';
import './AdminToolbar.css';
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
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
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
    const matchesSearch = !query || [
      product.nameEn,
      product.nameUr,
      product.code,
      product._id,
      product.brand?.nameEn,
      product.category?.nameEn,
      product.city?.name,
    ].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));

    const productCityId = product.city?._id || product.city || '';
    const productBrandId = product.brand?._id || product.brand || '';
    const productCategoryId = product.category?._id || product.category || '';

    const matchesCity = selectedCity === 'all' || productCityId === selectedCity;
    const matchesBrand = selectedBrand === 'all' || productBrandId === selectedBrand;
    const matchesCategory = selectedCategory === 'all' || productCategoryId === selectedCategory;
    const matchesStatus = selectedStatus === 'all'
      || (selectedStatus === 'active' && product.active)
      || (selectedStatus === 'inactive' && !product.active)
      || (selectedStatus === 'verified' && product.adminVerified)
      || (selectedStatus === 'unverified' && !product.adminVerified);

    return matchesSearch && matchesCity && matchesBrand && matchesCategory && matchesStatus;
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
          <select className="toolbar-select" value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
            <option value="all">City</option>
            {cities.map((city) => (
              <option key={city._id || city.id} value={city._id || city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <select className="toolbar-select" value={selectedBrand} onChange={(event) => setSelectedBrand(event.target.value)}>
            <option value="all">Brand</option>
            {brands.map((brand) => (
              <option key={brand._id || brand.id} value={brand._id || brand.id}>
                {brand.nameEn || brand.name || 'Unnamed Brand'}
              </option>
            ))}
          </select>
          <select className="toolbar-select" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
            <option value="all">Category</option>
            {categories.map((category) => (
              <option key={category._id || category.id} value={category._id || category.id}>
                {category.nameEn || category.name || 'Unnamed Category'}
              </option>
            ))}
          </select>
          <select className="toolbar-select" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
            <option value="all">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          {(selectedCity !== 'all' || selectedBrand !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all' || searchTerm) && (
            <button
              type="button"
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('all');
                setSelectedBrand('all');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
            >
              Clear Filters
            </button>
          )}
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
