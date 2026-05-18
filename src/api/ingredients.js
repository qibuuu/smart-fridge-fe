import apiClient from './apiClient';

export const getAllIngredients = () => apiClient.get('/ingredients');

export const createIngredient = (data) => apiClient.post('/ingredients', data);

export const updateIngredient = (id, data) => apiClient.put(`/ingredients/${id}`, data);

export const deleteIngredient = (id) => apiClient.delete(`/ingredients/${id}`);
