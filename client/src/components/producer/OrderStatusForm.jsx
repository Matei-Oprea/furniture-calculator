import React, { useState } from 'react';

const OrderStatusForm = ({ order, onSubmit, onCancel }) => {
  const [status, setStatus] = useState(order.status || 'pending');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(order.id, { status });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-status-form">
      <h3>Update Order #{order.id} Status</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="order-info">
          <p><strong>Customer:</strong> {order.user_name}</p>
          <p><strong>Email:</strong> {order.user_email}</p>
          <p><strong>Package:</strong> {order.package_name}</p>
          <p><strong>Delivery Address:</strong> {order.delivery_address}</p>
          <p><strong>Delivery Date:</strong> {new Date(order.delivery_date).toLocaleDateString()}</p>
          {order.observation && (
            <p><strong>Notes:</strong> {order.observation}</p>
          )}
        </div>
        
        <div className="form-buttons">
          <button 
            type="submit" 
            className="update-status-btn"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderStatusForm;