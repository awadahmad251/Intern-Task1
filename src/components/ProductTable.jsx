import React, { useState } from 'react';
import './ProductTable.css';
import ToggleSwitch from './ToggleSwitch';
import { MoreVertical, Check } from 'react-feather';
import UpdateStockModal from './UpdateStockModal';
import ProductDetailsPanel from './ProductDetailsPanel';
import neonLogo from '../assets/images/neonlogo.png';
import wheatBag from '../assets/images/wheatbag.png';

const initialProductsData = [
    { id: 1, name: 'Wheat Grain Bag', code: '#P321', brand: 'Neon', category: 'Wheat', packing: '1 Kg', price: '1200 Rs', stock: 400, active: true, adminVerified: true, image: wheatBag, brandLogo: neonLogo, isSelected: true },
    { id: 2, name: 'Wheat Grain Bag', code: '#P321', brand: 'Neon', category: 'Wheat', packing: '1 Kg', price: '1200 Rs', stock: 400, active: true, adminVerified: false, image: wheatBag, brandLogo: neonLogo, isSelected: false },
    { id: 3, name: 'Wheat Grain Bag', code: '#P321', brand: 'Neon', category: 'Wheat', packing: '1 Kg', price: '1200 Rs', stock: 400, active: false, adminVerified: true, image: wheatBag, brandLogo: neonLogo, isSelected: true },
    { id: 4, name: 'Wheat Grain Bag', code: '#P321', brand: 'Neon', category: 'Wheat', packing: '1 Kg', price: '1200 Rs', stock: 400, active: false, adminVerified: false, image: wheatBag, brandLogo: neonLogo, isSelected: false },
    { id: 5, name: 'Wheat Grain Bag', code: '#P321', brand: 'Neon', category: 'Wheat', packing: '1 Kg', price: '1200 Rs', stock: 400, active: true, adminVerified: true, image: wheatBag, brandLogo: neonLogo, isSelected: true },
];

const CustomCheckbox = ({ checked, onChange }) => (
    <div className={`custom-checkbox ${checked ? 'checked' : ''}`} onClick={onChange}>
        {checked && <Check className="tick" size={16} />}
    </div>
);

const ProductTable = () => {
    const [products, setProducts] = useState(initialProductsData);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [stockProduct, setStockProduct] = useState(null);
    const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleUpdateStock = (product) => {
        setStockProduct(product);
        setIsStockModalOpen(true);
    };

    const closeStockModal = () => {
        setIsStockModalOpen(false);
        setStockProduct(null);
    };

    const handleRowClick = (product) => {
        setSelectedProduct(product);
        setIsDetailsPanelOpen(true);
    };

    const closeDetailsPanel = () => {
        setIsDetailsPanelOpen(false);
        setSelectedProduct(null);
    };

    const handleDeleteProduct = (product) => {
        setProducts(products.filter(p => p.id !== product.id));
        closeDetailsPanel();
    };

    const handleSelectProduct = (productId) => {
        setProducts(products.map(p => p.id === productId ? {...p, isSelected: !p.isSelected} : p));
    };

    const handleToggle = (productId, field) => {
        setProducts(products.map(p => p.id === productId ? { ...p, [field]: !p[field] } : p));
    };

    return (
        <>
            <table className="product-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Packing</th>
                        <th>Price</th>
                        <th>In Stock</th>
                        <th>Active</th>
                        <th>Admin Verified</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} onClick={() => handleRowClick(product)}>
                            <td onClick={(e) => e.stopPropagation()}>
                                <CustomCheckbox checked={product.isSelected} onChange={() => handleSelectProduct(product.id)} />
                            </td>
                            <td>
                                <div className="product-info-cell">
                                    <img src={product.image} alt={product.name} className="product-image" />
                                    <div>
                                        {product.name}
                                        <div className="product-code">{product.code}</div>
                                    </div>
                                </div>
                            </td>
                            <td><img src={product.brandLogo} alt={product.brand} className="brand-logo" /></td>
                            <td>{product.category}</td>
                            <td>{product.packing}</td>
                            <td>{product.price}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                                <div className="stock-cell">
                                    <div className="stock-value">{product.stock}</div>
                                    <button className="update-stock-btn" onClick={() => handleUpdateStock(product)}>
                                        Update
                                    </button>
                                </div>
                            </td>
                            <td onClick={(e) => e.stopPropagation()}><ToggleSwitch checked={product.active} onChange={() => handleToggle(product.id, 'active')} /></td>
                            <td onClick={(e) => e.stopPropagation()}><ToggleSwitch checked={product.adminVerified} onChange={() => handleToggle(product.id, 'adminVerified')} /></td>
                            <td className="action-cell" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="action-icon" onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); setIsDetailsPanelOpen(true); }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isStockModalOpen && <UpdateStockModal product={stockProduct} onClose={closeStockModal} />}
            {isDetailsPanelOpen && (
                <ProductDetailsPanel
                    product={selectedProduct}
                    onClose={closeDetailsPanel}
                    onUpdateStock={handleUpdateStock}
                    onDelete={handleDeleteProduct}
                />
            )}
        </>
    );
};

export default ProductTable;
