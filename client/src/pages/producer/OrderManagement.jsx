import React, { useState, useEffect } from 'react';
import OrderStatusForm from '../../components/producer/OrderStatusForm';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import '../../styles/Producer.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch all orders on initial load
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
      setError('');
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (order) => {
    setSelectedOrder(order);
    setShowStatusForm(true);
    setActionSuccess('');
  };

  const handleUpdateStatus = async (orderId, statusData) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, statusData);
      
      setOrders(
        orders.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      
      setShowStatusForm(false);
      setActionSuccess('Order status updated successfully');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update order status. Please try again.');
    }
  };

  const handleFormCancel = () => {
    setShowStatusForm(false);
    setSelectedOrder(null);
  };

  // Filter orders based on selected status
  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="order-management-page">
      <div className="page-header">
        <h1>Order Management</h1>
        <div className="status-filter">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {actionSuccess && <div className="success-message">{actionSuccess}</div>}
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found with the selected status.</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Package</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className={`status-${order.status}`}>
                  <td>{order.id}</td>
                  <td>
                    <div>{order.user_name}</div>
                    <div className="small-text">{order.user_email}</div>
                  </td>
                  <td>{order.package_name}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{formatDate(order.delivery_date)}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="update-status-btn"
                      onClick={() => handleStatusChange(order)}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showStatusForm && selectedOrder && (
        <div className="form-overlay">
          <div className="form-container">
            <OrderStatusForm
              order={selectedOrder}
              onSubmit={handleUpdateStatus}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;