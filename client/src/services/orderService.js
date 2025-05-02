import api from './apiService';

// Get all orders (admin only)
export const getAllOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get current user's orders
export const getMyOrders = async () => {
  try {
    const response = await api.get('/orders/myorders');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Create new order
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (id, statusData) => {
  try {
    const response = await api.put(`/orders/${id}`, statusData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Delete order
export const deleteOrder = async (id) => {
  try {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};