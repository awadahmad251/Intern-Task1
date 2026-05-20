import React, { useState } from 'react';
import './ProductTable.css';
import ToggleSwitch from './ToggleSwitch';
import { MoreVertical, Check } from 'react-feather';
import UpdateStockModal from './UpdateStockModal';
import ProductDetailsPanel from './ProductDetailsPanel';
import neonLogo from '../assets/images/neonlogo.png';
import wheatBag from '../assets/images/wheatbag.png';
import { api } from '../api/client';

const CustomCheckbox = ({ checked, onChange }) => (
    <div className={`custom-checkbox ${checked ? 'checked' : ''}`} onClick={onChange}>
        {checked && <Check className="tick" size={16} />}
    </div>
);

const ProductTable = ({ products, setProducts, setError, canEdit = true }) => {
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [stockProduct, setStockProduct] = useState(null);
    const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const openStockModal = (product) => {
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
        if (!canEdit) {
            return;
        }
        api.del(`/api/products/${product._id}`)
            .then(() => setProducts(products.filter(p => p._id !== product._id)))
            .catch((err) => setError?.(err.message || 'Failed to delete product.'));
        closeDetailsPanel();
    };

    const handleSelectProduct = (productId) => {
        setProducts(products.map(p => p._id === productId ? { ...p, isSelected: !p.isSelected } : p));
    };

    const handleToggle = (productId, field) => {
        if (!canEdit) {
            return;
        }
        const target = products.find((product) => product._id === productId);
        if (!target) {
            return;
        }

        api.put(`/api/products/${productId}`, { [field]: !target[field] })
            .then((updated) => {
                setProducts(products.map((product) => (product._id === productId ? { ...product, ...updated } : product)));
            })
            .catch((err) => setError?.(err.message || 'Failed to update product.'));
    };

    const handleUpdateStock = (product, stockValue) => {
        api.put(`/api/products/${product._id}`, { stock: stockValue })
            .then((updated) => {
                setProducts(products.map((item) => (item._id === product._id ? { ...item, ...updated } : item)));
                closeStockModal();
            })
            .catch((err) => setError?.(err.message || 'Failed to update stock.'));
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
                        <tr key={product._id} onClick={() => handleRowClick(product)}>
                            <td onClick={(e) => e.stopPropagation()}>
                                <CustomCheckbox checked={product.isSelected} onChange={() => handleSelectProduct(product._id)} />
                            </td>
                            <td>
                                <div className="product-info-cell">
                                    <img src={product.imageUrl || wheatBag} alt={product.nameEn} className="product-image" />
                                    <div>
                                        {product.nameEn}
                                        <div className="product-code">{product.code || product._id?.slice(-6)}</div>
                                    </div>
                                </div>
                            </td>
                            <td><img src={product.brand?.logoUrl || neonLogo} alt={product.brand?.nameEn || 'Brand'} className="brand-logo" /></td>
                            <td>{product.category?.nameEn || '-'}</td>
                            <td>{product.packings?.[0]?.size || '-'}</td>
                            <td>{product.price}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                                <div className="stock-cell">
                                    <div className="stock-value">{product.stock}</div>
                                    <button className="update-stock-btn" onClick={() => openStockModal(product)} disabled={!canEdit}>
                                        Update
                                    </button>
                                </div>
                            </td>
                            <td onClick={(e) => e.stopPropagation()}><ToggleSwitch checked={product.active} onChange={() => handleToggle(product._id, 'active')} disabled={!canEdit} /></td>
                            <td onClick={(e) => e.stopPropagation()}><ToggleSwitch checked={product.adminVerified} onChange={() => handleToggle(product._id, 'adminVerified')} disabled={!canEdit} /></td>
                            <td className="action-cell" onClick={(e) => e.stopPropagation()}>
                                {canEdit && (
                                    <MoreVertical className="action-icon" onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); setIsDetailsPanelOpen(true); }} />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isStockModalOpen && canEdit && <UpdateStockModal product={stockProduct} onClose={closeStockModal} onSave={handleUpdateStock} />}
            {isDetailsPanelOpen && (
                <ProductDetailsPanel
                    product={selectedProduct}
                    onClose={closeDetailsPanel}
                    onUpdateStock={openStockModal}
                    onDelete={handleDeleteProduct}
                    canEdit={canEdit}
                />
            )}
        </>
    );
};

export default ProductTable;
