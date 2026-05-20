import React, { useEffect, useState } from 'react';
import { Search, MoreVertical } from 'react-feather';
import './Orders.css';
import OrderSidebar from './OrderSidebar';
import { api } from '../api/client';

const statusLabels = {
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  completed: 'Completed',
  processed: 'Processed',
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      const data = await api.get('/api/orders');
      setOrders(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
  };

  const closeSidebar = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="orders-container">
      <div className="orders-topbar">
        <h1 className="orders-heading">Orders</h1>
        <div className="orders-toolbar">
          <div className="orders-search">
            <Search size={15} className="orders-search-icon" />
            <input type="text" placeholder="Search by order id, price..." className="orders-search-input" />
          </div>
          <button className="orders-filter-btn" type="button">
            City
            <span className="orders-caret" />
          </button>
          <button className="orders-filter-btn" type="button">
            Status
            <span className="orders-caret" />
          </button>
          <button className="orders-filter-btn" type="button">
            Date & Time
            <span className="orders-caret" />
          </button>
        </div>
      </div>

      {error && <div className="orders-error">{error}</div>}
      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Retailer</th>
              <th>Date & Time</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} onClick={() => handleRowClick(order)}>
                <td>
                  <div className="orders-id-cell">
                    <span className="orders-id-dot" />
                    {order.orderId || order._id?.slice(-6)}
                  </div>
                </td>
                <td>{order.retailer?.name || 'Retailer'}</td>
                <td>
                  <div className="orders-date">
                    <span>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span className="orders-time">{new Date(order.createdAt || Date.now()).toLocaleTimeString()}</span>
                  </div>
                </td>
                <td>{order.totalAmount} Rs</td>
                <td>
                  <span className={`orders-status orders-status--${order.status}`}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td>
                  <button
                    className="orders-dots"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedOrder(order);
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && <OrderSidebar order={selectedOrder} onClose={closeSidebar} />}
    </div>
  );
};

export default Orders;
