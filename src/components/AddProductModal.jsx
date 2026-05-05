import { useState } from "react";
import "./AddProductModal.css";

export default function AddProductModal({ onClose }) {
  const [includePackings, setIncludePackings] = useState(true);
  const [enableBulkOrder, setEnableBulkOrder] = useState(true);
  const [applyDiscount, setApplyDiscount] = useState(true);

  const [packings, setPackings] = useState([{ id: 1, size: "", price: "" }]);
  const [bulkOrders, setBulkOrders] = useState([{ id: 1, minQty: "", amount: "" }]);

  const addPacking = () =>
    setPackings((prev) => [...prev, { id: Date.now(), size: "", price: "" }]);
  const removePacking = (id) =>
    setPackings((prev) => prev.filter((p) => p.id !== id));

  const addBulkOrder = () =>
    setBulkOrders((prev) => [...prev, { id: Date.now(), minQty: "", amount: "" }]);

  return (
    <div className="ap-overlay">
      <div className="ap-modal">
        <div className="ap-title-row">
          <h2 className="ap-title">Add Product</h2>
          <button className="ap-close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="ap-section-label">Thumbnail</div>
        <div className="ap-upload-box">
          <div className="ap-upload-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="#e07b54" strokeWidth="1.5" fill="#fff0eb" />
              <path d="M8 12l2.5 2.5L16 9" stroke="#e07b54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8.5" cy="8.5" r="1" fill="#e07b54" />
            </svg>
          </div>
          <p className="ap-upload-text">
            <span className="ap-upload-link">Click to upload</span> or drag and drop
          </p>
          <p className="ap-upload-hint">JPG, PNG (max. 10MB)</p>
        </div>

        <div className="ap-row">
          <input className="ap-input" type="text" placeholder="Title English" />
          <input className="ap-input ap-rtl" type="text" placeholder="اردو عنوان" />
        </div>

        <div className="ap-select-wrap">
          <select className="ap-select">
            <option value="">Choose Category</option>
          </select>
        </div>

        <div className="ap-select-wrap">
          <select className="ap-select">
            <option value="">Choose Brand</option>
          </select>
        </div>

        <div className="ap-row">
          <input className="ap-input" type="text" placeholder="Price" />
          <input className="ap-input" type="text" placeholder="In Stock" />
        </div>

        <div className="ap-select-wrap">
          <select className="ap-select">
            <option value="">Choose City</option>
          </select>
        </div>

        <textarea className="ap-textarea" placeholder="Description English" rows={4} />
        <textarea className="ap-textarea ap-rtl" placeholder="اردو تفصیل" rows={4} />

        <div className="ap-toggle-row">
          <label className="ap-switch">
            <input
              type="checkbox"
              checked={includePackings}
              onChange={() => setIncludePackings(!includePackings)}
            />
            <span className="ap-slider" />
          </label>
          <span className="ap-toggle-label">Include Packings</span>
        </div>

        {includePackings && (
          <div className="ap-packing-section">
            {packings.map((p) => (
              <div className="ap-packing-row" key={p.id}>
                <input className="ap-input ap-flex1" type="text" placeholder="Packing Size" />
                <input className="ap-input ap-flex1" type="text" placeholder="Price" />
                <button className="ap-remove-btn" onClick={() => removePacking(p.id)} type="button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
            <button className="ap-add-btn" onClick={addPacking} type="button">
              + Add More
            </button>
          </div>
        )}

        <div className="ap-toggle-row">
          <label className="ap-switch">
            <input
              type="checkbox"
              checked={enableBulkOrder}
              onChange={() => setEnableBulkOrder(!enableBulkOrder)}
            />
            <span className="ap-slider" />
          </label>
          <span className="ap-toggle-label">Enable Bulk Order</span>
        </div>

        {enableBulkOrder && (
          <div className="ap-packing-section">
            {bulkOrders.map((b) => (
              <div className="ap-row" key={b.id}>
                <input className="ap-input" type="text" placeholder="Min. Quantity" />
                <input className="ap-input" type="text" placeholder="Amount" />
              </div>
            ))}
            <button className="ap-add-btn" onClick={addBulkOrder} type="button">
              + Add More
            </button>
          </div>
        )}

        <div className="ap-toggle-row">
          <label className="ap-switch">
            <input
              type="checkbox"
              checked={applyDiscount}
              onChange={() => setApplyDiscount(!applyDiscount)}
            />
            <span className="ap-slider" />
          </label>
          <span className="ap-toggle-label">Apply Discount</span>
        </div>

        {applyDiscount && (
          <div className="ap-discount-row">
            <input className="ap-input ap-flex1" type="text" placeholder="Value" />
            <div className="ap-select-wrap ap-discount-select">
              <select className="ap-select">
                <option>Percentage</option>
                <option>Fixed</option>
              </select>
            </div>
          </div>
        )}

        <div className="ap-footer">
          <button className="ap-cancel-btn" onClick={onClose} type="button">Cancel</button>
          <button className="ap-save-btn" type="button">Save</button>
        </div>
      </div>
    </div>
  );
}
