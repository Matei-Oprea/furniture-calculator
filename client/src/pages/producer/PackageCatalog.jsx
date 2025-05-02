import React, { useState, useEffect } from 'react';
import PackageForm from '../../components/producer/PackageForm';
import { getAllPackages, createPackage, updatePackage, deletePackage } from '../../services/packageService';
import '../../styles/Producer.css';

const PackageCatalog = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  // Fetch all packages on initial load
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await getAllPackages();
      setPackages(data);
      setError('');
    } catch (err) {
      setError('Failed to load packages. Please try again later.');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentPackage(null);
    setShowForm(true);
    setActionSuccess('');
  };

  const handleEdit = (packageData) => {
    setCurrentPackage(packageData);
    setShowForm(true);
    setActionSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      await deletePackage(id);
      setPackages(packages.filter((pkg) => pkg.id !== id));
      setActionSuccess('Package deleted successfully');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete package. Please try again.');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentPackage) {
        // Update existing package
        const updatedPackage = await updatePackage(currentPackage.id, formData);
        setPackages(
          packages.map((pkg) => (pkg.id === currentPackage.id ? updatedPackage : pkg))
        );
        setActionSuccess('Package updated successfully');
      } else {
        // Create new package
        const newPackage = await createPackage(formData);
        setPackages([...packages, newPackage]);
        setActionSuccess('Package created successfully');
      }
      
      setShowForm(false);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save package. Please try again.');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentPackage(null);
  };

  return (
    <div className="package-catalog-page">
      <div className="page-header">
        <h1>Furniture Package Management</h1>
        <button className="add-new-btn" onClick={handleAddNew}>
          Add New Package
        </button>
      </div>

      {actionSuccess && <div className="success-message">{actionSuccess}</div>}
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading packages...</div>
      ) : packages.length === 0 ? (
        <div className="no-packages">
          <p>No furniture packages available.</p>
          <p>Click 'Add New Package' to create your first furniture package.</p>
        </div>
      ) : (
        <div className="packages-table-container">
          <table className="packages-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Dimensions (Length × Height)</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>{pkg.id}</td>
                  <td>{pkg.name}</td>
                  <td>{pkg.type || 'N/A'}</td>
                  <td>
                    {pkg.room_length}m × {pkg.room_height}m
                  </td>
                  <td>${parseFloat(pkg.price).toFixed(2)}</td>
                  <td className="actions-cell">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(pkg)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(pkg.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <PackageForm
              packageToEdit={currentPackage}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageCatalog;