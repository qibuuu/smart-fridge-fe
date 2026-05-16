import apiClient from './apiClient';

export const getMyFridge = () => apiClient.get('/fridge');

export const addToFridge = (data) => apiClient.post('/fridge', data);

export const deleteFromFridge = (id) => apiClient.delete(`/fridge/${id}`);

export const clearAllFridge = () => apiClient.delete('/fridge');

export const suggestFromFridge = () => apiClient.get('/fridge/suggest');
