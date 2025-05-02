import api from './apiService';

// Get all packages
export const getAllPackages = async () => {
  try {
    const response = await api.get('/packages');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get package by ID
export const getPackageById = async (id) => {
  try {
    const response = await api.get(`/packages/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get packages by room dimensions
export const getPackagesByDimensions = async (length, height) => {
  try {
    const response = await api.get(`/packages/dimensions?length=${length}&height=${height}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Create new package (admin only)
export const createPackage = async (packageData) => {
  try {
    const response = await api.post('/packages', packageData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update package (admin only)
export const updatePackage = async (id, packageData) => {
  try {
    const response = await api.put(`/packages/${id}`, packageData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Delete package (admin only)
export const deletePackage = async (id) => {
  try {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};