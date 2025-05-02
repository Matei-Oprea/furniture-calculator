import React, { useState, useEffect } from 'react';

const PackageForm = ({ packageToEdit, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    room_length: '',
    room_height: '',
    price: '',
    image_urls: []
  });
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (packageToEdit) {
      // Parse image_urls if it's a string
      const imageUrls = typeof packageToEdit.image_urls === 'string'
        ? JSON.parse(packageToEdit.image_urls)
        : packageToEdit.image_urls || [];

      setFormData({
        name: packageToEdit.name || '',
        description: packageToEdit.description || '',
        type: packageToEdit.type || '',
        room_length: packageToEdit.room_length || '',
        room_height: packageToEdit.room_height || '',
        price: packageToEdit.price || '',
        image_urls: imageUrls
      });
    }
  }, [packageToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert number inputs to floats
    if (['room_length', 'room_height', 'price'].includes(name)) {
      setFormData({ ...formData, [name]: value === '' ? '' : parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    setError('');
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        image_urls: [...formData.image_urls, imageUrl.trim()]
      });
      setImageUrl('');
    }
  };

  const removeImageUrl = (index) => {
    const newImageUrls = [...formData.image_urls];
    newImageUrls.splice(index, 1);
    setFormData({ ...formData, image_urls: newImageUrls });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.room_length || !formData.room_height || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="package-form-container">
      <h2>{packageToEdit ? 'Edit Package' : 'Add New Package'}</h2>
      <form className="package-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="name">Package Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="room_length">Room Length (m)*</label>
            <input
              type="number"
              id="room_length"
              name="room_length"
              value={formData.room_length}
              onChange={handleChange}
              step="0.1"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="room_height">Room Height (m)*</label>
            <input
              type="number"
              id="room_height"
              name="room_height"
              value={formData.room_height}
              onChange={handleChange}
              step="0.1"
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price ($)*</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Images</label>
          <div className="image-urls-container">
            {formData.image_urls.map((url, index) => (
              <div key={index} className="image-url-item">
                <span>{url}</span>
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={() => removeImageUrl(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <div className="add-image-container">
            <input
              type="text"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Enter image URL"
            />
            <button 
              type="button" 
              className="add-image-btn"
              onClick={addImageUrl}
            >
              Add
            </button>
          </div>
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            {packageToEdit ? 'Update Package' : 'Create Package'}
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

export default PackageForm;