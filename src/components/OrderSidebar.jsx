import React from 'react';
import './OrderSidebar.css';
import { ArrowLeft } from 'react-feather';
import wheatBag from '../assets/images/wheatbag.png';

const OrderSidebar = ({ order, onClose }) => {
  return (
    <div className="order-sidebar-overlay" onClick={onClose}>
      <div className="order-sidebar" onClick={(event) => event.stopPropagation()}>
        <div className="order-sidebar-header">
          <button className="order-back-btn" onClick={onClose} type="button">
            <ArrowLeft size={16} />
          </button>
        </div>

        <div className="order-panel">
          <div className="order-panel-title">Order Tracking</div>
          <div className="order-tracking">
            <div className="order-track-item active">
              <span className="order-track-dot">✓</span>
              <div>
                <div className="order-track-label">Order Placed</div>
                <div className="order-track-time">Friday, 11 April, 12:33 Pm</div>
              </div>
            </div>
            <div className="order-track-item active">
              <span className="order-track-dot">✓</span>
              <div>
                <div className="order-track-label">Processed</div>
                <div className="order-track-time">Friday, 11 April, 6:00 Pm</div>
              </div>
            </div>
            <div className="order-track-item">
              <span className="order-track-dot"></span>
              <div>
                <div className="order-track-label">Expected Delivery</div>
                <div className="order-track-time">Monday, 14 April</div>
              </div>
            </div>
            <div className="order-track-item">
              <span className="order-track-dot"></span>
              <div>
                <div className="order-track-label">Completed/Cancelled</div>
                <div className="order-track-time">-</div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-panel">
          <div className="order-panel-title">Order Details</div>
          <div className="order-details">
            <div className="order-detail-row">
              <span>Order ID</span>
              <span>{order.id}</span>
            </div>
            <div className="order-detail-row">
              <span>Number of Items</span>
              <span>3</span>
            </div>
            <div className="order-detail-row">
              <span>Phone Number</span>
              <span>+92 332 0252150</span>
            </div>
            <div className="order-detail-row">
              <span>Delivery Address</span>
              <span>SD-21, North Nazimabad, Karachi</span>
            </div>
            <div className="order-detail-row">
              <span>Expected Delivery</span>
              <span>Monday, 14 April</span>
            </div>
          </div>
        </div>

        <div className="order-panel">
          <div className="order-panel-title">Items</div>
          <div className="order-items">
            {[1, 2, 3].map((item) => (
              <div className="order-item" key={item}>
                <img src={wheatBag} alt="Wheat Grain Bag" />
                <div className="order-item-info">
                  <div className="order-item-name">Wheat Grain Bag</div>
                  <div className="order-item-sub">x 10 Kg</div>
                  <div className="order-item-price">1200 Rs</div>
                </div>
                <div className="order-item-qty">
                  <div>Quantity</div>
                  <span>04</span>
                </div>
              </div>
            ))}
          </div>
          <div className="order-total">
            <span>Total</span>
            <span>7400 Rs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSidebar;
