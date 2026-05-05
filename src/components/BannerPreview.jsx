import React from 'react';
import './BannerPreview.css';
import { X } from 'react-feather';

const BannerPreview = ({ image, onClose }) => {
  return (
    <div className="bp-overlay" onClick={onClose}>
      <div className="bp-modal" onClick={(event) => event.stopPropagation()}>
        <button className="bp-close" onClick={onClose} type="button">
          <X size={16} />
        </button>
        <img src={image} alt="Banner Preview" />
        <div className="bp-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
};

export default BannerPreview;
