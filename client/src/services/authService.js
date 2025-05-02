import api from './apiService';

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

// Update user details
export const updateUserDetails = async (userData) => {
  try {
    const response = await api.put('/auth/updatedetails', userData);
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

// Update password
export const updatePassword = async (passwordData) => {
  try {
    const response = await api.put('/auth/updatepassword', passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};