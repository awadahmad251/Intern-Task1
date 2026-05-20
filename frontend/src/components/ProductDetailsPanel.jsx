import React, { useState } from 'react';
import './ProductDetailsPanel.css';
import { ArrowLeft, Trash2, Edit2 } from 'react-feather';

const ProductDetailsPanel = ({ product, onClose, onUpdateStock, onDelete, onEdit, onAddVariant, canEdit = true }) => {
  const packingOptions = product?.packings?.length
    ? product.packings.map((item) => ({
        label: item.size || 'Packing',
        price: `${item.price || 0} Rs`,
      }))
    : [{ label: 'Default', price: `${product?.price || 0} Rs` }];

  const [selectedPacking, setSelectedPacking] = useState(packingOptions[0]);

  if (!product) {
    return null;
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(product);
      return;
    }
    onClose();
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(product);
      return;
    }
    onClose();
  };

  const handleUpdateStock = () => {
    if (onUpdateStock) {
      onUpdateStock(product);
    }
    onClose();
  };

  const handleAddVariant = () => {
    if (onAddVariant) {
      onAddVariant(product);
      return;
    }
    onClose();
  };

  return (
    <div className="product-details-panel-overlay" onClick={onClose}>
      <div className="product-details-panel" onClick={(event) => event.stopPropagation()}>
        <div className="panel-header">
          <button className="icon-btn" onClick={onClose} aria-label="Back">
            <ArrowLeft size={16} />
          </button>
          {canEdit && (
            <button className="danger-btn" type="button" onClick={handleDelete}>
              <Trash2 size={14} />
              Delete
            </button>
          )}
        </div>
        <div className="panel-content">
          <div className="hero-image">
            <img src={product.imageUrl || product.image} alt={product.nameEn || product.name} />
          </div>

          <div className="title-row">
            <div>
              <h3>{product.nameEn || product.name}</h3>
              <p className="subtitle-urdu">گندم کا تھیلا</p>
              <span className="category">{product.category?.nameEn || product.category}</span>
            </div>
            <div className="price">{selectedPacking.price}</div>
          </div>

          <div className="brand-row">
            <div className="brand-avatar">
              <img src={product.brand?.logoUrl || product.brandLogo} alt={product.brand?.nameEn || product.brand} />
            </div>
            <div>
              <div className="brand-name">{product.brand?.nameEn || product.brand}</div>
              <div className="brand-sub">349 Products Sold</div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Description</div>
            <p className="section-text">
              {product.descriptionEn || 'No description provided.'}
            </p>
            <button className="link-btn" type="button">Read More</button>
          </div>

          <div className="section">
            <div className="section-title urdu">تفصیل</div>
            <p className="section-text urdu">
              {product.descriptionUr || 'کوئی تفصیل دستیاب نہیں۔'}
            </p>
          </div>

          <div className="section">
            <div className="section-title">Packing</div>
            <div className="chip-row">
              {packingOptions.map((option) => (
                <button
                  key={option.label}
                  className={`chip ${selectedPacking.label === option.label ? 'active' : ''}`}
                  type="button"
                  onClick={() => setSelectedPacking(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="section-title">Bulk Order</div>
            <div className="chip-row">
              {(product.bulkOrders || []).length === 0 && (
                <span className="chip chip-wide">No bulk offers</span>
              )}
              {(product.bulkOrders || []).map((item) => (
                <span key={item.minQty} className="chip chip-wide">
                  &gt; {item.minQty} items<br />{item.amount} Rs
                </span>
              ))}
            </div>
          </div>
        </div>
        {canEdit && (
          <div className="panel-footer">
            <button className="footer-btn ghost" onClick={handleEdit}>
              <Edit2 size={14} />
              Edit
            </button>
            <button className="footer-btn" onClick={handleUpdateStock}>Update Stock</button>
            <button className="footer-btn primary" onClick={handleAddVariant}>Add Variant</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPanel;
