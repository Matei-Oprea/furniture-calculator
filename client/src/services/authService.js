import api from './apiService';

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Registration failed');
  } catch (error) {
    throw error;
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    if (response.data.success) {
      return response.data.user;
    }
    throw new Error(response.data.message || 'Failed to get user data');
  } catch (error) {
    throw error;
  }
};

// Update user details
export const updateUserDetails = async (userData) => {
  try {
    const response = await api.put('/auth/updatedetails', userData);
    if (response.data.success) {
      return response.data.user;
    }
    throw new Error(response.data.message || 'Failed to update user details');
  } catch (error) {
    throw error;
  }
};

// Update password
export const updatePassword = async (passwordData) => {
  try {
    const response = await api.put('/auth/updatepassword', passwordData);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Failed to update password');
  } catch (error) {
    throw error;
  }
};