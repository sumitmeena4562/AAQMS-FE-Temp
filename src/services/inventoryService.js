import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const inventoryService = {
  // Fetch paginated inventory with filters
  getInventory: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/organization/inventory/`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get audit statistics
  getStats: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/organization/inventory/stats/`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new inventory item
  createItem: async (itemData) => {
    try {
      const response = await axios.post(`${API_URL}/organization/inventory/`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update existing item
  updateItem: async (id, itemData) => {
    try {
      const response = await axios.patch(`${API_URL}/organization/inventory/${id}/`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete inventory item
  deleteItem: async (id) => {
    try {
      await axios.delete(`${API_URL}/organization/inventory/${id}/`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default inventoryService;
