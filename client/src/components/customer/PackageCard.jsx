import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PackageCard = ({ packageData, onOrderClick }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Parse image URLs if they're a string
  const imageUrls = Array.isArray(packageData.image_urls)
    ? packageData.image_urls
    : typeof packageData.image_urls === 'string'
    ? JSON.parse(packageData.image_urls)
    : [];

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (onOrderClick) {
      onOrderClick(packageData);
    }
  };

  return (
    <div className="package-card">
      <div className="package-image-container">
        {imageUrls.length > 0 ? (
          <>
            <img
              src={imageUrls[currentImage]}
              alt={packageData.name}
              className="package-image"
            />
            {imageUrls.length > 1 && (
              <div className="image-controls">
                <button
                  className="image-control prev"
                  onClick={handlePrevImage}
                >
                  &lt;
                </button>
                <button
                  className="image-control next"
                  onClick={handleNextImage}
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-image">No Image Available</div>
        )}
      </div>
      <div className="package-info">
        <h3 className="package-title">{packageData.name}</h3>
        <p className="package-description">{packageData.description}</p>
        <div className="package-details">
          <div className="package-dimension">
            <span>Room Length:</span> {packageData.room_length}m
          </div>
          <div className="package-dimension">
            <span>Room Height:</span> {packageData.room_height}m
          </div>
          <div className="package-type">
            <span>Type:</span> {packageData.type}
          </div>
          <div className="package-price">
            <span>Price:</span> ${packageData.price.toFixed(2)}
          </div>
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default PackageCard;