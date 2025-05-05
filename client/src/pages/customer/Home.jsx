import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PackageCard from "../../components/customer/PackageCard";
import {
  getAllPackages,
  getPackagesByDimensions,
} from "../../services/packageService";
import { createOrder } from "../../services/orderService";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Home.css";

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roomLength, setRoomLength] = useState("");
  const [roomHeight, setRoomHeight] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [orderFormData, setOrderFormData] = useState({
    delivery_address: "",
    delivery_date: "",
    observation: "",
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Format the price properly
  const formatPrice = (price) => {
    // Check if price exists and convert to number if it's a string
    if (price !== undefined && price !== null) {
      // Make sure price is a number
      const numPrice = typeof price === "string" ? parseFloat(price) : price;
      // Check if it's a valid number after conversion
      if (!isNaN(numPrice)) {
        return numPrice.toFixed(2);
      }
    }
    // Fallback for invalid or missing price
    return "0.00";
  };

  // Fetch all packages on initial load
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getAllPackages();
        setPackages(data);
        setError("");
      } catch (err) {
        setError("Failed to load packages. Please try again later.");
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Handle dimension filter
  const handleDimensionsSearch = async (e) => {
    e.preventDefault();

    if (!roomLength || !roomHeight) {
      setError("Please enter both room length and height");
      return;
    }

    setLoading(true);

    try {
      const data = await getPackagesByDimensions(roomLength, roomHeight);
      setPackages(data);
      setError("");
    } catch (err) {
      setError("Failed to search packages. Please try again.");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle add to cart click
  const handleAddToCart = (packageData) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setSelectedPackage(packageData);
    setShowOrderForm(true);
    setOrderFormData({
      delivery_address: "",
      delivery_date: "",
      observation: "",
    });
    setOrderSuccess(false);
    setOrderError("");
  };

  // Handle order form change
  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setOrderFormData({ ...orderFormData, [name]: value });
    setOrderError("");
  };

  // Handle order submit
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!orderFormData.delivery_address || !orderFormData.delivery_date) {
      setOrderError("Please fill in all required fields");
      return;
    }

    try {
      await createOrder({
        package_id: selectedPackage.id,
        delivery_address: orderFormData.delivery_address,
        delivery_date: orderFormData.delivery_date,
        observation: orderFormData.observation,
      });

      setOrderSuccess(true);
      setTimeout(() => {
        setShowOrderForm(false);
        setOrderSuccess(false);
      }, 3000);
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to place order");
    }
  };

  // Get tomorrow's date in YYYY-MM-DD format for the date input min attribute
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find the Perfect Furniture for Your Space</h1>
          <p>
            Enter your room dimensions to discover the ideal furniture package
          </p>

          <form className="dimensions-form" onSubmit={handleDimensionsSearch}>
            <div className="form-inputs">
              <div className="form-group">
                <label htmlFor="roomLength">Room Length (m)</label>
                <input
                  type="number"
                  id="roomLength"
                  value={roomLength}
                  onChange={(e) => setRoomLength(e.target.value)}
                  min="0"
                  step="0.1"
                  placeholder="Enter length"
                />
              </div>

              <div className="form-group">
                <label htmlFor="roomHeight">Room Height (m)</label>
                <input
                  type="number"
                  id="roomHeight"
                  value={roomHeight}
                  onChange={(e) => setRoomHeight(e.target.value)}
                  min="0"
                  step="0.1"
                  placeholder="Enter height"
                />
              </div>
            </div>

            <button type="submit" className="search-btn">
              Find Packages
            </button>
          </form>
        </div>
      </section>

      <section className="packages-section">
        <h2>Available Furniture Packages</h2>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading packages...</div>
        ) : packages.length === 0 ? (
          <div className="no-packages">
            No furniture packages found for the specified dimensions.
          </div>
        ) : (
          <div className="packages-grid">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                packageData={pkg}
                onOrderClick={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {showOrderForm && selectedPackage && (
        <div className="order-form-overlay">
          <div className="order-form-container">
            <button
              className="close-form-btn"
              onClick={() => setShowOrderForm(false)}
            >
              ✕
            </button>

            <h2>Place Your Order</h2>
            <h3>
              {selectedPackage.name} - ${formatPrice(selectedPackage.price)}
            </h3>

            {orderSuccess ? (
              <div className="success-message">
                Your order has been placed successfully!
              </div>
            ) : (
              <form className="order-form" onSubmit={handleOrderSubmit}>
                {orderError && (
                  <div className="error-message">{orderError}</div>
                )}

                <div className="form-group">
                  <label htmlFor="delivery_address">Delivery Address*</label>
                  <textarea
                    id="delivery_address"
                    name="delivery_address"
                    value={orderFormData.delivery_address}
                    onChange={handleOrderFormChange}
                    required
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="delivery_date">Delivery Date*</label>
                  <input
                    type="date"
                    id="delivery_date"
                    name="delivery_date"
                    value={orderFormData.delivery_date}
                    onChange={handleOrderFormChange}
                    min={getTomorrowDate()}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="observation">Special Instructions</label>
                  <textarea
                    id="observation"
                    name="observation"
                    value={orderFormData.observation}
                    onChange={handleOrderFormChange}
                    rows="3"
                  />
                </div>

                <button type="submit" className="place-order-btn">
                  Place Order
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
