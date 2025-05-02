import React, { useState } from 'react';

const OrderCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse image URLs if they're a string
  const imageUrls = Array.isArray(order.image_urls)
    ? order.image_urls
    : typeof order.image_urls === 'string'
    ? JSON.parse(order.image_urls)
    : [];

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status class for styling
  const getStatusClass = () => {
    switch (order.status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="order-card">
      <div className="order-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="order-basic-info">
          <h3>Order #{order.id}</h3>
          <p className="order-date">Ordered on: {formatDate(order.created_at)}</p>
        </div>
        <div className="order-status">
          <span className={`status-badge ${getStatusClass()}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        <button className="expand-btn">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {isExpanded && (
        <div className="order-details">
          <div className="order-package">
            <h4>Package: {order.package_name}</h4>
            {imageUrls.length > 0 && (
              <img
                src={imageUrls[0]}
                alt={order.package_name}
                className="order-image"
              />
            )}
            <p className="order-price">Price: ${parseFloat(order.price).toFixed(2)}</p>
          </div>

          <div className="order-delivery-info">
            <h4>Delivery Information</h4>
            <p>Address: {order.delivery_address}</p>
            <p>Delivery Date: {formatDate(order.delivery_date)}</p>
            {order.observation && (
              <div className="order-observation">
                <h4>Notes</h4>
                <p>{order.observation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;