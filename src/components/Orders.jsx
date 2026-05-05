import React, { useState } from 'react';
import { Search, MoreVertical } from 'react-feather';
import './Orders.css';
import OrderSidebar from './OrderSidebar';

const mockOrders = [
  { id: '#KR21241', retailer: 'Javed Sheikh', date: '24/10/2022', time: '12:35 Pm', amount: '1200 Rs', status: 'delivered' },
  { id: '#KR21241', retailer: 'Javed Sheikh', date: '24/10/2022', time: '12:35 Pm', amount: '1200 Rs', status: 'cancelled' },
  { id: '#KR21241', retailer: 'Javed Sheikh', date: '24/10/2022', time: '12:35 Pm', amount: '1200 Rs', status: 'completed' },
  { id: '#KR21241', retailer: 'Javed Sheikh', date: '24/10/2022', time: '12:35 Pm', amount: '1200 Rs', status: 'completed' },
  { id: '#KR21241', retailer: 'Javed Sheikh', date: '24/10/2022', time: '12:35 Pm', amount: '1200 Rs', status: 'completed' },
  { id: '#KR21241', retailer: 'Javed Sheikh', date: '24/10/2022', time: '12:35 Pm', amount: '1200 Rs', status: 'processed' },
  { id: '#KR21241', retailer: 'Javed Sheikh', date: '24/10/2022', time: '12:35 Pm', amount: '1200 Rs', status: 'processed' },
  { id: '#KR21241', retailer: 'Javed Sheikh', date: '24/10/2022', time: '12:35 Pm', amount: '1200 Rs', status: 'processed' },
];

const statusLabels = {
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  completed: 'Completed',
  processed: 'Processed',
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

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
            {mockOrders.map((order, index) => (
              <tr key={`${order.id}-${index}`} onClick={() => handleRowClick(order)}>
                <td>
                  <div className="orders-id-cell">
                    <span className="orders-id-dot" />
                    {order.id}
                  </div>
                </td>
                <td>{order.retailer}</td>
                <td>
                  <div className="orders-date">
                    <span>{order.date}</span>
                    <span className="orders-time">{order.time}</span>
                  </div>
                </td>
                <td>{order.amount}</td>
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
