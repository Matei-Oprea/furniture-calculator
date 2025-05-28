import React, { useState } from 'react';

const OrderCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse image URLs safely
  const getImageUrls = () => {
    try {
      if (order.package_images) {
        return typeof order.package_images === 'string'
          ? JSON.parse(order.package_images)
          : Array.isArray(order.package_images)
          ? order.package_images
          : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing image URLs:', error);
      return [];
    }
  };

  const imageUrls = getImageUrls();

  // Format date safely
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Get status class for styling
  const getStatusClass = () => {
    switch (order.status?.toLowerCase()) {
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
          <p className="order-date">
            Ordered on: {formatDate(order.created_at)}
          </p>
        </div>
        <div className="order-status">
          <span className={`status-badge ${getStatusClass()}`}>
            {(order.status?.charAt(0).toUpperCase() + order.status?.slice(1)) || 'Pending'}
          </span>
        </div>
        <button className="expand-btn" type="button">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {isExpanded && (
        <div className="order-details">
          <div className="order-package">
            <h4>Package: {order.package_name}</h4>
            {imageUrls.length > 0 && (
              <div className="order-image-container">
                <img
                  src={imageUrls[0]}
                  alt={order.package_name || 'Package'}
                  className="order-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
            )}
            <p className="order-price">
              Price: ${parseFloat(order.package_price || 0).toFixed(2)}
            </p>
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