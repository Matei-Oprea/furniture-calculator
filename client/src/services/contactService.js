import api from './apiService';

// Submit contact form
export const submitContactForm = async (contactData) => {
  try {
    const response = await api.post('/contact', contactData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all contact submissions (admin only)
export const getAllContacts = async () => {
  try {
    const response = await api.get('/contact');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update contact status (admin only)
export const updateContactStatus = async (id, status) => {
  try {
    const response = await api.put(`/contact/${id}`, { status });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Delete contact (admin only)
export const deleteContact = async (id) => {
  try {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};