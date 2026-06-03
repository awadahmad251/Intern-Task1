import React, { useEffect, useState } from 'react';
import { Search, MoreVertical } from 'react-feather';
import './Orders.css';
import './AdminToolbar.css';
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
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
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
    api.get('/api/cities').then(setCities).catch(() => {});
  }, []);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
  };

  const closeSidebar = () => {
    setSelectedOrder(null);
  };

  const visibleOrders = orders.filter((order) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = !query || [order.orderId, order._id, order.totalAmount, order.retailer?.name]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));

    const orderCityId = order.city?._id || order.city || '';
    const matchesCity = selectedCity === 'all' || orderCityId === selectedCity;
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

    const orderDateKey = new Date(order.createdAt || Date.now()).toISOString().slice(0, 10);
    const matchesDate = selectedDate === 'all' || orderDateKey === selectedDate;

    return matchesSearch && matchesCity && matchesStatus && matchesDate;
  });

  const orderDateOptions = Array.from(new Set(orders.map((order) => new Date(order.createdAt || Date.now()).toISOString().slice(0, 10)))).sort().reverse();

  return (
    <div className="orders-container">
      <div className="orders-topbar">
        <h1 className="orders-heading">Orders</h1>
        <div className="orders-toolbar">
          <div className="orders-search">
            <Search size={15} className="orders-search-icon" />
            <input type="text" placeholder="Search by order id, price..." className="orders-search-input" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
          <select className="orders-filter-select" value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
            <option value="all">City</option>
            {cities.map((city) => (
              <option key={city._id || city.id} value={city._id || city.id}>{city.name}</option>
            ))}
          </select>
          <select className="orders-filter-select" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
            <option value="all">Status</option>
            <option value="processed">Processed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="delivered">Delivered</option>
          </select>
          <select className="orders-filter-select" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)}>
            <option value="all">Date & Time</option>
            {orderDateOptions.map((date) => (
              <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>
            ))}
          </select>
          {(searchTerm || selectedCity !== 'all' || selectedStatus !== 'all' || selectedDate !== 'all') && (
            <button
              type="button"
              className="orders-clear-btn"
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('all');
                setSelectedStatus('all');
                setSelectedDate('all');
              }}
            >
              Clear Filters
            </button>
          )}
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
            {visibleOrders.map((order) => (
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
