import React, { useEffect, useState } from 'react';
import './UpdateStockModal.css';

const UpdateStockModal = ({ product, onClose }) => {
  const [stockValue, setStockValue] = useState(product?.stock ?? 0);

  useEffect(() => {
    if (product) {
      setStockValue(product.stock ?? 0);
    }
  }, [product]);

  const handleDecrement = () => {
    setStockValue((current) => (current > 0 ? current - 1 : 0));
  };

  const handleIncrement = () => {
    setStockValue((current) => current + 1);
  };

  const handleUpdate = () => {
    onClose();
  };

  if (!product) {
    return null;
  }

  return (
    <div className="update-stock-modal-overlay">
      <div className="update-stock-modal">
        <div className="update-stock-modal-header">
          <h2>Update Stock</h2>
        </div>
        <div className="update-stock-modal-content">
          <div className="product-info">
            <img src={product.image} alt={product.name} className="product-image" />
            <div>
              <h3>{product.name}</h3>
              <p>{product.code}</p>
            </div>
          </div>
          <div className="stock-stepper">
            <button className="stepper-btn" type="button" onClick={handleDecrement}>-</button>
            <div className="stepper-value">{stockValue}</div>
            <button className="stepper-btn stepper-btn-dark" type="button" onClick={handleIncrement}>+</button>
          </div>
        </div>
        <div className="update-stock-modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="save-button" onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStockModal;
