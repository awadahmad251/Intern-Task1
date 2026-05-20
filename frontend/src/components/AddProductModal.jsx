import { useRef, useState } from "react";
import "./AddProductModal.css";
import { uploads } from '../api/client';

export default function AddProductModal({ onClose, onSave }) {
  const [nameEn, setNameEn] = useState('');
  const [nameUr, setNameUr] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [city, setCity] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionUr, setDescriptionUr] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [includePackings, setIncludePackings] = useState(true);
  const [enableBulkOrder, setEnableBulkOrder] = useState(true);
  const [applyDiscount, setApplyDiscount] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const [packings, setPackings] = useState([{ id: 1, size: "", price: "" }]);
  const [bulkOrders, setBulkOrders] = useState([{ id: 1, minQty: "", amount: "" }]);

  const addPacking = () =>
    setPackings((prev) => [...prev, { id: Date.now(), size: "", price: "" }]);
  const removePacking = (id) =>
    setPackings((prev) => prev.filter((p) => p.id !== id));

  const addBulkOrder = () =>
    setBulkOrders((prev) => [...prev, { id: Date.now(), minQty: "", amount: "" }]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setUploadError('');
      const result = await uploads.uploadImage(file);
      setImageUrl(result.url);
    } catch (err) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

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
        <div
          className="ap-upload-box"
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {uploading && <p className="ap-upload-hint">Uploading...</p>}
        {uploadError && <p className="ap-upload-hint">{uploadError}</p>}

        <div className="ap-row">
          <input className="ap-input" type="text" placeholder="Title English" value={nameEn} onChange={(event) => setNameEn(event.target.value)} />
          <input className="ap-input ap-rtl" type="text" placeholder="اردو عنوان" value={nameUr} onChange={(event) => setNameUr(event.target.value)} />
        </div>

        <input className="ap-input" type="text" placeholder="Image URL" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />

        <div className="ap-select-wrap">
          <select className="ap-select" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Choose Category</option>
          </select>
        </div>

        <div className="ap-select-wrap">
          <select className="ap-select" value={brand} onChange={(event) => setBrand(event.target.value)}>
            <option value="">Choose Brand</option>
          </select>
        </div>

        <div className="ap-row">
          <input className="ap-input" type="text" placeholder="Price" value={price} onChange={(event) => setPrice(event.target.value)} />
          <input className="ap-input" type="text" placeholder="In Stock" value={stock} onChange={(event) => setStock(event.target.value)} />
        </div>

        <div className="ap-select-wrap">
          <select className="ap-select" value={city} onChange={(event) => setCity(event.target.value)}>
            <option value="">Choose City</option>
          </select>
        </div>

        <textarea className="ap-textarea" placeholder="Description English" rows={4} value={descriptionEn} onChange={(event) => setDescriptionEn(event.target.value)} />
        <textarea className="ap-textarea ap-rtl" placeholder="اردو تفصیل" rows={4} value={descriptionUr} onChange={(event) => setDescriptionUr(event.target.value)} />

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
                <input
                  className="ap-input ap-flex1"
                  type="text"
                  placeholder="Packing Size"
                  value={p.size || ''}
                  onChange={(event) =>
                    setPackings((prev) => prev.map((item) => (item.id === p.id ? { ...item, size: event.target.value } : item)))
                  }
                />
                <input
                  className="ap-input ap-flex1"
                  type="text"
                  placeholder="Price"
                  value={p.price || ''}
                  onChange={(event) =>
                    setPackings((prev) => prev.map((item) => (item.id === p.id ? { ...item, price: event.target.value } : item)))
                  }
                />
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
                <input
                  className="ap-input"
                  type="text"
                  placeholder="Min. Quantity"
                  value={b.minQty || ''}
                  onChange={(event) =>
                    setBulkOrders((prev) => prev.map((item) => (item.id === b.id ? { ...item, minQty: event.target.value } : item)))
                  }
                />
                <input
                  className="ap-input"
                  type="text"
                  placeholder="Amount"
                  value={b.amount || ''}
                  onChange={(event) =>
                    setBulkOrders((prev) => prev.map((item) => (item.id === b.id ? { ...item, amount: event.target.value } : item)))
                  }
                />
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
          <button
            className="ap-save-btn"
            type="button"
            onClick={() =>
              onSave?.({
                nameEn,
                nameUr,
                category,
                brand,
                price: Number(price || 0),
                stock: Number(stock || 0),
                city,
                descriptionEn,
                descriptionUr,
                imageUrl,
                packings: includePackings ? packings.map((p) => ({ size: p.size, price: Number(p.price || 0) })) : [],
                bulkOrders: enableBulkOrder ? bulkOrders.map((b) => ({ minQty: Number(b.minQty || 0), amount: Number(b.amount || 0) })) : [],
              })
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
