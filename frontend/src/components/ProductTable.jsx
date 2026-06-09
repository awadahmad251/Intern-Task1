import React, { useState } from 'react';
import './ProductTable.css';
import ToggleSwitch from './ToggleSwitch';
import { MoreVertical } from 'react-feather';
import UpdateStockModal from './UpdateStockModal';
import ProductDetailsPanel from './ProductDetailsPanel';
import AddProductModal from './AddProductModal';
import neonLogo from '../assets/images/neonlogo.png';
import wheatBag from '../assets/images/wheatbag.png';
import { api } from '../api/client';
import Swal from 'sweetalert2';



const ProductTable = ({ products, setProducts, setError, canEdit = true, categories = [], brands = [], cities = [] }) => {
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [stockProduct, setStockProduct] = useState(null);
    const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const [openMenuProductId, setOpenMenuProductId] = useState(null);

    const openStockModal = (product) => { setStockProduct(product); setIsStockModalOpen(true); };
    const closeStockModal = () => { setIsStockModalOpen(false); setStockProduct(null); };
    const handleRowClick = (product) => { setSelectedProduct(product); setIsDetailsPanelOpen(true); };
    const closeDetailsPanel = () => { setIsDetailsPanelOpen(false); setSelectedProduct(null); };

    const handleDeleteProduct = async (product) => {
        if (!canEdit) return;
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This product will be deleted permanently!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });
        if (result.isConfirmed) {
            api.del(`/api/products/${product._id}`)
                .then(() => {
                    setProducts(products.filter((p) => p._id !== product._id));
                    Swal.fire({ title: 'Deleted!', text: 'Product deleted successfully.', icon: 'success', timer: 1500, showConfirmButton: false });
                })
                .catch((err) => {
                    Swal.fire({ title: 'Error!', text: err.message || 'Failed to delete product.', icon: 'error' });
                    setError?.(err.message || 'Failed to delete product.');
                });
            closeDetailsPanel();
        }
    };

    const handleEditProduct = async (payload) => {
        if (!editProduct) return;
        try {
            const body = {
                nameEn: payload.nameEn,
                nameUr: payload.nameUr,
                price: payload.price,
                stock: payload.stock,
                descriptionEn: payload.descriptionEn,
                descriptionUr: payload.descriptionUr,
                imageUrl: payload.imageUrl,
                packings: payload.packings,
                bulkOrders: payload.bulkOrders,
            };
            if (payload.category) body.category = payload.category;
            if (payload.brand) body.brand = payload.brand;
            if (payload.city) body.city = payload.city;

            const updated = await api.put(`/api/products/${editProduct._id}`, body);
            setProducts((prev) => prev.map((p) => (p._id === editProduct._id ? { ...p, ...updated } : p)));
            setEditProduct(null);
        } catch (err) {
            setError?.(err.message || 'Failed to update product.');
        }
    };

    const handleSelectProduct = (productId) => {
        setProducts(products.map(p => p._id === productId ? { ...p, isSelected: !p.isSelected } : p));
    };

    const handleToggle = (productId, field) => {
        if (!canEdit) return;
        const target = products.find((product) => product._id === productId);
        if (!target) return;
        api.put(`/api/products/${productId}`, { [field]: !target[field] })
            .then((updated) => setProducts(products.map((product) => (product._id === productId ? { ...product, ...updated } : product))))
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
                    {products.length === 0 && (
                        <tr><td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: '#aaa', fontSize: '14px' }}>No products found.</td></tr>
                    )}
                    {products.map(product => (
                        <tr key={product._id} onClick={() => handleRowClick(product)}>
                            <td onClick={(e) => e.stopPropagation()}>
                                <div className={`product-checkbox ${product.isSelected ? 'checked' : ''}`} onClick={() => handleSelectProduct(product._id)} />
                            </td>
                            <td>
                                <div className="product-name-cell">
                                    <img src={product.imageUrl || wheatBag} alt={product.nameEn} className="product-thumb" />
                                    <div>
                                        <div className="product-name-text">{product.nameEn}</div>
                                        <div className="product-id-text">#{product.code || product._id?.slice(-6)}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="brand-cell">
                                    <img src={product.brand?.logoUrl || neonLogo} alt={product.brand?.nameEn || 'Brand'} className="brand-logo" />
                                    <span>{product.brand?.nameEn || '—'}</span>
                                </div>
                            </td>
                            <td>{product.category?.nameEn || '-'}</td>
                            <td>{product.packings?.[0]?.size || '-'}</td>
                            <td>{product.price}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                                <span className="stock-value">{product.stock}</span>
                                {canEdit && <button className="stock-update" onClick={() => openStockModal(product)}>Update</button>}
                            </td>
                            <td onClick={(e) => e.stopPropagation()}><ToggleSwitch checked={product.active} onChange={() => handleToggle(product._id, 'active')} disabled={!canEdit} /></td>
                            <td onClick={(e) => e.stopPropagation()}><ToggleSwitch checked={product.adminVerified} onChange={() => handleToggle(product._id, 'adminVerified')} disabled={!canEdit} /></td>
                            <td className="action-cell" onClick={(e) => e.stopPropagation()}>
                                {canEdit && (
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <MoreVertical className="action-icon" onClick={(e) => { e.stopPropagation(); setOpenMenuProductId(openMenuProductId === product._id ? null : product._id); }} />
                                        {openMenuProductId === product._id && (
                                            <div className="product-dropdown">
                                                <button className="product-dropdown-item" onClick={(e) => { e.stopPropagation(); setOpenMenuProductId(null); setSelectedProduct(product); setIsDetailsPanelOpen(true); }}>View details</button>
                                                <button className="product-dropdown-item" onClick={(e) => { e.stopPropagation(); setOpenMenuProductId(null); setEditProduct(product); }}>Edit</button>
                                                <button className="product-dropdown-item product-dropdown-delete" onClick={(e) => { e.stopPropagation(); setOpenMenuProductId(null); handleDeleteProduct(product); }}>Delete</button>
                                            </div>
                                        )}
                                    </div>
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
                    onEdit={(product) => { closeDetailsPanel(); setEditProduct(product); }}
                    canEdit={canEdit}
                />
            )}

            {editProduct && canEdit && (
                <AddProductModal
                    onClose={() => setEditProduct(null)}
                    onSave={handleEditProduct}
                    categories={categories}
                    brands={brands}
                    cities={cities}
                    initialData={editProduct}
                    isEdit
                />
            )}
        </>
    );
};

export default ProductTable;
