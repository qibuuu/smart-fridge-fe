import apiClient from './apiClient';

export const getCart = () => apiClient.get('/cart');

export const addToCart = (data) => apiClient.post('/cart', data);

export const toggleCartItem = (id) => apiClient.put(`/cart/${id}/toggle`);

export const deleteCartItem = (id) => apiClient.delete(`/cart/${id}`);
