import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods for products
export const productAPI = {
  // Get all products
  getAll: () => api.get('/products/'),
  
  // Get product by ID
  getById: (id) => api.get(`/products/${id}`),
  
  // Create new product
  create: (productData) => api.post('/products/', productData),
  
  // Update product
  update: (id, productData) => api.put(`/products/${id}`, productData),
  
  // Delete product
  delete: (id) => api.delete(`/products/${id}`),
};

// API methods for cart
export const cartAPI = {
  // Get all cart items
  getAll: () => api.get('/cart/'),
  
  // Add item to cart
  addItem: (productId, quantity = 1) => api.post('/cart/add', { 
    product_id: productId, 
    quantity 
  }),
  
  // Remove item from cart
  removeItem: (itemId) => api.delete(`/cart/${itemId}`),
  
  // Clear entire cart
  clear: () => api.delete('/cart/'),
};

export default api;
