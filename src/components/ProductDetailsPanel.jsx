import React, { useState } from 'react';
import './ProductDetailsPanel.css';
import { ArrowLeft, Trash2, Edit2 } from 'react-feather';

const ProductDetailsPanel = ({ product, onClose, onUpdateStock, onDelete, onEdit, onAddVariant }) => {
  const packingOptions = [
    { label: '1 Kg', price: '1200 Rs' },
    { label: '4 Kg', price: '1180 Rs' },
    { label: '5 Kg', price: '1150 Rs' },
    { label: '8 Kg', price: '1100 Rs' },
    { label: '10 Kg', price: '1040 Rs' },
    { label: '20 Kg', price: '950 Rs' },
  ];

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
          <button className="danger-btn" type="button" onClick={handleDelete}>
            <Trash2 size={14} />
            Delete
          </button>
        </div>
        <div className="panel-content">
          <div className="hero-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="title-row">
            <div>
              <h3>{product.name}</h3>
              <p className="subtitle-urdu">گندم کا تھیلا</p>
              <span className="category">{product.category}</span>
            </div>
            <div className="price">{selectedPacking.price}</div>
          </div>

          <div className="brand-row">
            <div className="brand-avatar">
              <img src={product.brandLogo} alt={product.brand} />
            </div>
            <div>
              <div className="brand-name">{product.brand}</div>
              <div className="brand-sub">349 Products Sold</div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Description</div>
            <p className="section-text">
              Sed pellentesque ac nisl ipsum ipsum. Nunc ac malesuada massa faucibus
              quis. In etiam velit amet mi lorem proin nisl ullamcorper et. Enim neque at...
            </p>
            <button className="link-btn" type="button">Read More</button>
          </div>

          <div className="section">
            <div className="section-title urdu">تفصیل</div>
            <p className="section-text urdu">
              گندم کی اعلیٰ معیار کی تھیلی۔ بہترین اناج اور صاف ستھری پیکنگ کے ساتھ
              دستیاب۔ مزید معلومات کے لیے رابطہ کریں۔
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
              <span className="chip chip-wide">&gt; 10 items<br />1200 Rs</span>
              <span className="chip chip-wide">&gt; 20 items<br />1040 Rs</span>
              <span className="chip chip-wide">&gt; 50 items<br />950 Rs</span>
            </div>
          </div>
        </div>
        <div className="panel-footer">
          <button className="footer-btn ghost" onClick={handleEdit}>
            <Edit2 size={14} />
            Edit
          </button>
          <button className="footer-btn" onClick={handleUpdateStock}>Update Stock</button>
          <button className="footer-btn primary" onClick={handleAddVariant}>Add Variant</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPanel;
